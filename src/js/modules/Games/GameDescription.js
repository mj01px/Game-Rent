export function openDescriptionModal(games) {
    console.log("Initializing description modal...");

    const modal = document.getElementById('game-description-modal');
    if (!modal) {
        console.error("Modal element not found!");
        return;
    }

    // Event delegation para lidar com clicks dinâmicos
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            event.preventDefault();
            console.log("Description button clicked");

            const button = event.target;
            const gameId = parseInt(button.getAttribute('data-id'));
            const game = games.find(g => g.id === gameId);

            if (game) {
                updateModalContent(game);
                showModal();
            }
        }
    });

    // Fechar modal
    const closeModal = document.getElementById('close-game-modal');
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    function updateModalContent(game) {
        document.getElementById('modalGameTitle').textContent = game.name;
        document.getElementById('modalGameDescription').textContent = game.description;
        document.getElementById('modalGameImage').src = `../assets/images/games/${game.image}`;
        document.getElementById('modalPlatform').textContent = game.platformName;
        document.getElementById('modalPlatform').className = `platform ${game.platform}`;
        document.getElementById('modalOriginalPrice').textContent = `$${game.originalPrice.toFixed(2)}`;
        document.getElementById('modalRentalPrice').textContent = `$${game.rentalPrice.toFixed(2)}/Week`;

        const rating = game.rating;
        const fullStars = '★'.repeat(Math.floor(rating));
        const emptyStars = '☆'.repeat(5 - Math.floor(rating));
        document.getElementById('modalGameRating').innerHTML = `${fullStars}${emptyStars} <span>${rating.toFixed(1)}</span>`;
    }

    function showModal() {
        modal.classList.add('active'); // ativa o CSS
        document.body.style.overflow = 'hidden';
        console.log("Modal shown");
    }


    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log("Modal hidden");
    }

    document.getElementById('modal-cart-btn').addEventListener('click', () => {
        hideModal(); // fecha o modal atual
    });
}