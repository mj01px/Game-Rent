/**
 * Handles click events for game card buttons (Rent/Return functionality)
 * Manages the UI state and opens game details modal when renting
 */

// Import dependencies
import { modalGameDetails } from './modalGameDetails.js';  // Modal display functionality
import { setSelectedGameId } from './gameState.js';       // State management for selected game

/**
 * Handles the main logic for game card button clicks
 * @param {string|number} id - The unique identifier of the game card
 */
export function handleCardButtonClick(id) {
    // Get reference to the game card element
    const card = document.getElementById(`game-${id}`);

    // Early return if card doesn't exist
    if (!card) return;

    // Get references to button and image elements within the card
    const button = card.querySelector('.dashboard__card-btn');
    const image = card.querySelector('.dashboard__card-img');

    // Validate required elements exist
    if (!image || !button) return;

    // Check if game is currently rented (has rented class)
    const isRented = image.classList.contains('dashboard__card-img--rented');

    if (isRented) {
        // RETURN FLOW: Game is being returned
        image.classList.remove('dashboard__card-img--rented');  // Remove visual indicator
        button.classList.remove('dashboard__card-btn--return'); // Remove return styling
        button.textContent = 'Rent';                           // Reset button text
    } else {
        // RENT FLOW: Game is being rented
        setSelectedGameId(id);      // Update global state with selected game ID
        modalGameDetails(id);       // Open modal with game details
    }
}

// Expose function to global scope only if it doesn't already exist
// This allows the function to be called from HTML onclick attributes
if (!window.handleCardButtonClick) {
    window.handleCardButtonClick = handleCardButtonClick;
}