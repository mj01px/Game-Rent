import { modalGameDetails } from './modalGameDetails.js';
import { setSelectedGameId } from './gameState.js';
import { updateRentedCount } from '../cart/updateRentedCounter.js';

// Function to handle the card button click event
export function handleCardButtonClick(id) {
    const card = document.getElementById(`game-${id}`);
    if (!card) return;
    // Get the image and button elements within the game card
    const button = card.querySelector('.dashboard__card-btn');
    const image = card.querySelector('.dashboard__card-img');

    if (!image || !button) return;

    // Check if the game is currently rented to apply the correct styles
    const isRented = image.classList.contains('dashboard__card-img--rented');

    // Toggle the rented status of the game card
    if (isRented) {
        image.classList.remove('dashboard__card-img--rented');
        button.classList.remove('dashboard__card-btn--return');
        button.textContent = 'Rent';
    } else {
        setSelectedGameId(id);
        modalGameDetails(id);
        updateRentedCount()
    }
}

// Export the function to be used in other modules
window.handleCardButtonClick = handleCardButtonClick;
