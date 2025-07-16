// Imports
import { initCartModal } from '../components/cart/modalCart.js';
import { modalGameDetails } from "./games/modalGameDetails.js";
import { initButtonStatus } from "./games/buttonStatus.js";
import {handleCardButtonClick} from "./games/handleCardButtonClick.js";

// Function to load HTML components dynamically
export function loadComponent(containerId, filePath, basePath ) {
    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        });
}

// Get the game ID from the URL parameters
Promise.all([
    loadComponent('navbar-container', '_navbar.html', 'web/components/shared/'),
    loadComponent('game__card-container', 'game-card.html', 'web/components/games/'),
    loadComponent('fade__bar-container', '_fade-bar.html', 'web/components/shared/'),
    loadComponent('modal-container', '_modal-cart.html', 'web/components/cart/'),
    loadComponent('game-modal-container', '_modal-game-details.html', 'web/components/games/'),
])
    .then(() => {
        // Initialize the modal cart component after loading
        modalGameDetails()
        initCartModal()
        initButtonStatus()
        handleCardButtonClick()

    })
    .catch(err => {
        console.error("Error to load component:", err);
    });

