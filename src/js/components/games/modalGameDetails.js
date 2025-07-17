/**
 * Manages the game details modal functionality
 * Handles displaying game information in a modal dialog
 * and manages modal open/close behavior
 */

import { setSelectedGameId } from "./gameState.js";

/**
 * Displays game details in a modal dialog
 * @param {string|number} id - The ID of the game to display
 */
export function modalGameDetails(id) {
    // Get the game card element by ID
    const gameCard = document.getElementById(`game-${id}`);
    // Set the selected game ID in global state
    setSelectedGameId(id);

    // Get references to all modal elements
    const modal = document.getElementById('game-modal');
    const closeModal = document.getElementById('close-game-modal');
    const titleEl = document.getElementById('modal-game-title');
    const descEl = document.getElementById('modal-game-desc');
    const imgEl = document.querySelector('.modal__game-img');
    const priceEl = document.getElementById('modal-game-price');

    // Early return if any required elements are missing
    if (!gameCard || !modal || !closeModal || !titleEl || !descEl || !imgEl || !priceEl) {
        return;
    }

    // Get game details from card element with fallback defaults
    const title = gameCard.querySelector('.dashboard__card-name')?.innerText || 'Game';
    const imgSrc = gameCard.querySelector('img')?.getAttribute('src') || 'img/game-placeholder.png';
    const description = gameCard.getAttribute('data-description') || 'No description available';
    const price = gameCard.getAttribute('data-price') || 'Price not available';

    // Populate modal with game details
    titleEl.innerText = title;
    descEl.innerText = description;
    imgEl.setAttribute('src', imgSrc);
    priceEl.innerText = price;

    // Show the modal by setting display to flex
    modal.style.display = 'flex';

    // Close modal when close button is clicked
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside the modal content (on backdrop)
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}