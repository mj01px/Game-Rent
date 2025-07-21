// Import dependencies
import { getSelectedGameId } from './gameState.js'; // Helper to get currently selected game ID
import {addToCart, removeFromCart} from '../cart/functionModelCart.js'; // Function to handle adding items to cart

// Stores reference to the click listener so we can remove it later
let buttonClickListener = null;

/**
 * Initializes the button status functionality
 * Handles both rent and return operations for games
 * Manages click events on the add-to-cart/rent button
 */
export function initButtonStatus() {
    // Get reference to the button element
    const buttonStatus = document.getElementById('add-to-cart-btn');

    // Safety check if button doesn't exist
    if (!buttonStatus) {
        console.warn('[modalCart] Button not found.');
        return;
    }

    // Remove previous click listener if it exists
    // This prevents multiple listeners from being attached
    if (buttonClickListener) {
        buttonStatus.removeEventListener('click', buttonClickListener);
    }

    /**
     * Click handler function for the rent/return button
     * Handles both renting and returning game scenarios
     */
    buttonClickListener = function handleClick() {
        // Get currently selected game ID
        const gameId = getSelectedGameId();

        // Get reference to the game card element
        const gameCard = document.getElementById(`game-${gameId}`);

        // Validate game card exists
        if (!gameCard) {
            console.warn(`[buttonStatus] Game card #game-${gameId} not found.`);
            return;
        }

        // Get references to image and button elements within the card
        const image = gameCard.querySelector('.dashboard__card-img');
        const button = gameCard.querySelector('.dashboard__card-btn');

        // Validate required elements exist
        if (!image || !button) {
            console.warn('[buttonStatus] Missing image or button elements.');
            return;
        }

        // Check if game is currently rented (has rented class)
        if (image.classList.contains('dashboard__card-img--rented')) {
            // RETURN LOGIC - Game is being rented
            image.classList.remove('dashboard__card-img--rented');
            button.classList.remove('dashboard__card-btn--return');
            button.textContent = 'Rent'; // Reset button text

        } else {
            // RENT LOGIC - Game is being rented
            image.classList.add('dashboard__card-img--rented');
            button.classList.add('dashboard__card-btn--return');
            button.textContent = 'Rented'; // Update button text

            // Add the game to cart (only when renting, not when returning)
            addToCart(gameId);

            // Remove the game from cart if it was already rented
            removeFromCart()
        }

        // Close the modal after operation
        document.getElementById('game-modal').style.display = 'none';
    };

    // Attach the new click listener to the button
    buttonStatus.addEventListener('click', buttonClickListener);
}