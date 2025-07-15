import {setSelectedGameId} from "./gameState.js";

export function modalGameDetails(id) {
    const gameCard = document.getElementById(`game-${id}`);
    setSelectedGameId(id)

    const modal = document.getElementById('game-modal');
    const closeModal = document.getElementById('close-game-modal');
    const actionButton = modal.querySelector('.game-modal-button');

    const titleEl = document.getElementById('modal-game-title');
    const descEl = document.getElementById('modal-game-desc');
    const imgEl = document.querySelector('.modal__game-img');
    const priceEl = document.getElementById('modal-game-price');

    // Set the selected game ID in the state

    // Check if all required elements exist
    if (!gameCard || !modal || !closeModal || !titleEl || !descEl || !imgEl || !priceEl) {
        return;
    }

    // Extract data from the selected game card
    const title = gameCard.querySelector('.dashboard__card-name')?.innerText || 'Game';
    const imgSrc = gameCard.querySelector('img')?.getAttribute('src') || 'img/game-placeholder.png';
    const description = gameCard.getAttribute('data-description') || 'No description available';
    const price = gameCard.getAttribute('data-price') || 'Price not available';

    // Fill modal fields with extracted data
    titleEl.innerText = title;
    descEl.innerText = description;
    imgEl.setAttribute('src', imgSrc);
    priceEl.innerText = price;

    // Open the modal
    modal.style.display = 'flex';

    // Close the modal on X click
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    if (actionButton) {
        actionButton.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Close the modal when clicking outside the modal content
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}


