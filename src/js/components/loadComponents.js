// Imports
import { initCartModal } from '../components/modalCart.js';
import { modalGameDetails } from "../components/modalGameDetails.js";
import { initButtonStatus } from "../components/buttonStatus.js";
import {initCardButtonListeners} from "./handleCardButtonClick.js";

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
    loadComponent('navbar-container', '_navbar.html', 'web/components/'),
    loadComponent('game__card-container', 'game-card.html', 'web/' ),
    loadComponent('fade__bar-container', '_fade-bar.html', 'web/components/'),
    loadComponent('modal-container', '_modal-cart.html', 'web/components/'),
    loadComponent('game-modal-container', '_modal-game-details.html', 'web/components/' ),
])
    .then(() => {
        // Initialize the modal cart component after loading
        modalGameDetails()
        initCartModal()
        initButtonStatus()
        initCardButtonListeners()

    })
    .catch(err => {
        console.error("Error to load component:", err);
    });

