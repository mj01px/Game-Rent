// Component initialization imports
import { initCartModal } from '../components/cart/modalCart.js';
import { modalGameDetails } from "./games/modalGameDetails.js";
import { initButtonStatus } from "./games/buttonStatus.js";
import { handleCardButtonClick } from "./games/handleCardButtonClick.js";

/**
 * Loads HTML components dynamically
 * @param {string} containerId - Target container element ID
 * @param {string} filePath - Component HTML file path
 * @param {string} basePath - Base directory path
 */
export function loadComponent(containerId, filePath, basePath) {
    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        });
}

// Load all components in parallel
Promise.all([
    loadComponent('navbar-container', '_navbar.html', 'web/components/shared/'),
    loadComponent('game__card-container', 'game-card.html', 'web/components/games/'),
    loadComponent('fade__bar-container', '_fade-bar.html', 'web/components/shared/'),
    loadComponent('modal-container', '_modal-cart.html', 'web/components/cart/'),
    loadComponent('game-modal-container', '_modal-game-details.html', 'web/components/games/'),
])
    .then(() => {
        // Initialize components in proper order
        modalGameDetails();      // Game details modal
        initCartModal();        // Shopping cart modal
        handleCardButtonClick(); // Card button handlers

        // Initialize button status last
        initButtonStatus();

    })
    .catch(err => {
        console.error("Error loading components:", err);
    });