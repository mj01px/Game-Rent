import { modalGameDetails } from './modalGameDetails.js';
import { setSelectedGameId } from './gameState.js';

// Function to initialize card button listeners
export function initCardButtonListeners() {
    const cards = document.querySelectorAll('.dashboard__card');

    // Check if there are any cards to process
    cards.forEach(card => {
        const button = card.querySelector('.dashboard__card-btn');
        const id = card.id.replace('game-', '');

        // Check if the button exists
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Get the image element within the card to apply the opacity effect
            const image = card.querySelector('.dashboard__card-img');

            if (!image || !button) return;

            // Check if the game is currently rented
            const isRented = image.classList.contains('dashboard__card-img--rented');

            // Toggle the rented status of the game card
            if (isRented) {
                image.classList.remove('dashboard__card-img--rented');
                button.classList.remove('dashboard__card-btn--return');
                button.textContent = 'Rent';
            } else {
                setSelectedGameId(id);
                modalGameDetails(id);
            }
        });
    });
}


