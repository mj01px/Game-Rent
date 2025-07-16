import { getSelectedGameId } from './gameState.js';

// Modal Cart Component Loader
export function initButtonStatus() {
    const buttonStatus = document.getElementById('add-to-cart-btn');

    if (!buttonStatus) {
        console.warn('[modalCart] Button not found.');
        return;
    }

    // Add event listener to the button
    buttonStatus.addEventListener('click', () => {
        const gameId = getSelectedGameId();
        const gameCard = document.getElementById(`game-${gameId}`);

        // Check if the game card exists
        if (!gameCard) {
            console.warn(`[buttonStatus] Game card #game-${gameId} not found.`);
            return;
        }

        // Get the image and button elements within the game card
        const image = gameCard.querySelector('.dashboard__card-img');
        const button = gameCard.querySelector('.dashboard__card-btn');

        if (!image || !button) {
            console.warn('[buttonStatus] Missing image or button elements.');
            return;
        }

        // Toggle rented status
        if (image.classList.contains('dashboard__card-img--rented')) {
            image.classList.remove('dashboard__card-img--rented');
            button.classList.remove('dashboard__card-btn--return');
            button.textContent = 'Rent';
        } else {
            image.classList.add('dashboard__card-img--rented');
            button.classList.add('dashboard__card-btn--return');
            button.textContent = 'Return';
        }

        // Close the modal after updating the status
        document.getElementById('game-modal').style.display = 'none';
    });
}
