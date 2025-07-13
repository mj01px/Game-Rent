// Function to toggle the rented status of a game card
function statusChange(id) {
    let gameClicked = document.getElementById(`game-${id}`);// Function to get the game card by ID
    let image = gameClicked.querySelector('.dashboard__card-img'); // Get the card image element
    let button = gameClicked.querySelector('.dashboard__card-btn'); // Get the card button element

    // Toggle the rented status of the game card
    if (image.classList.contains('dashboard__card-img--rented')) { // Check if the game is currently rented
        image.classList.remove('dashboard__card-img--rented'); // Remove the opacity of the image
        button.classList.remove('dashboard__card-btn--return') // Remove the return button style
        button.textContent = 'Rent'; // Change the button text to 'Rent'

    } else {
        image.classList.add('dashboard__card-img--rented'); // Add the opacity to the image
        button.classList.add('dashboard__card-btn--return'); // Add the return button style
        button.textContent = 'Return'; // Change the button text to 'Return'
    }
}

// Function to toggle the visibility of the cart modal
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');

// Add event listeners to the cart icon and close button
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

// Close the cart modal when the close button is clicked
closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close the cart modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});
