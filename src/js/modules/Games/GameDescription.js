import { addToCart } from "../Cart/CartUI.js";

// Holds the currently selected game object displayed in the modal
let currentGame = null;

/**
 * Initializes event listeners and logic to open and control
 * the game description modal.
 *
 * @param {Array} games - Array of game objects available for display
 */
export function openDescriptionModal(games) {
    // Get the modal element from the DOM
    const modal = document.getElementById('game-description-modal');
    if (!modal) {
        console.error("Modal element not found!");
        return; // Exit if modal not found to avoid errors
    }

    // Listen for any click event on the document to catch clicks on 'show-description' buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('show-description')) {
            event.preventDefault();

            // Get the clicked button and extract the game ID from its data attribute
            const button = event.target;
            const gameId = parseInt(button.getAttribute('data-id'));

            // Find the corresponding game object from the passed array
            currentGame = games.find(g => g.id === gameId);

            if (currentGame) {
                // Update modal content with the current game's details
                updateModalContent(currentGame);

                // Show the modal on screen
                showModal();
            }
        }
    });

    // Setup event listener for close button inside modal
    const closeModal = document.getElementById('close-game-modal');
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    // Allow clicking outside modal content (on overlay) to close modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Close modal when user presses the Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    /**
     * Updates the modal's UI with the selected game's data
     * @param {Object} game - Game object with all necessary info
     */
    function updateModalContent(game) {
        document.getElementById('modalGameTitle').textContent = game.name;
        document.getElementById('modalGameDescription').textContent = game.description;
        document.getElementById('modalGameImage').src = `../assets/images/games/${game.image}`;

        // Set platform text and dynamic class for styling (e.g., PC, Xbox)
        const platformElem = document.getElementById('modalPlatform');
        platformElem.textContent = game.platformName;
        platformElem.className = `platform ${game.platform}`;

        // Format and show prices with 2 decimals and rental period
        document.getElementById('modalOriginalPrice').textContent = `$${game.originalPrice.toFixed(2)}`;
        document.getElementById('modalRentalPrice').textContent = `$${game.rentalPrice.toFixed(2)}/Week`;

        // Render star rating: full stars + empty stars + numeric rating
        const rating = game.rating;
        const fullStars = '★'.repeat(Math.floor(rating));
        const emptyStars = '☆'.repeat(5 - Math.floor(rating));
        document.getElementById('modalGameRating').innerHTML = `${fullStars}${emptyStars} <span>${rating.toFixed(1)}</span>`;
    }

    /**
     * Shows the modal and disables page scrolling
     */
    function showModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    /**
     * Hides the modal and re-enables page scrolling
     */
    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    }

    // Handle click on "Rent Now" button: add current game to cart and close modal
    document.getElementById('modal-cart-btn').addEventListener('click', () => {
        if (currentGame) {
            addToCart(currentGame);
            hideModal();
        }
    });
}
