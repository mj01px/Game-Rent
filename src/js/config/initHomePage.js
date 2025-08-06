import {LoadGameData} from "../modules/homepage/Games/LoadGameData.js";
import {openDescriptionModal} from "../modules/homepage/Games/GameDescription.js";
import {openCartModal} from "../modules/homepage/Cart/Cart.js";
import {initializeCart, updateCartUI} from "../modules/homepage/Cart/CartUI.js";
import {games} from "../data/games.js";
import {initCatalog} from "../modules/catalog/catalog.js";
import {setupCategoryFilters} from "../modules/catalog/filter/homepage-category.js";
/**
 * Loads an HTML partial asynchronously and injects it into the DOM element specified by containerId.
 * @param {string} containerId - The ID of the container where the HTML will be inserted.
 * @param {string} filePath - The relative path to the HTML partial.
 * @param {string} basePath - The base directory path for the partial.
 * @returns {Promise} Resolves after the HTML is loaded and inserted.
 */
export function initContainer(containerId, filePath, basePath) {
    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })

        .then(html => {

            document.getElementById(containerId).innerHTML = html;
        });

}

// Load all page components asynchronously
Promise.all([
    initContainer('head-container', 'head.html', '../../partials/shared/'),
    initContainer('navbar-container', 'navbar.html', '../../partials/shared/'),
    initContainer('banner-container', 'banner.html', '../../partials/shared/'),
    initContainer('games-container', 'game-card.html', '../../components/homepage/game-card/'),
    initContainer('category-container', 'game-category.html', '../../components/homepage/game-category/'),
    initContainer('workflow-container', 'workflow.html', '../../partials/workflow/'),
    initContainer('footer-container', 'footer.html', '../../partials/shared/'),
    initContainer('cart-modal-container', 'cart-modal.html', '../../components/homepage/cart-modal/'),
    initContainer('game-description-container', 'game-modal.html', '../../components/homepage/game-card/'),
])
    .then(() => {
        // After all HTML components are loaded:

        // Instantiate the game loader to render featured games
        new LoadGameData('.featured');

        // Initialize event listeners and UI logic for the game description modal
        openDescriptionModal(games);

        // Load cart data from storage and initialize cart state
        initializeCart();

        // Set up event handlers for the cart modal open/close functionality
        openCartModal();

        // Render the initial state of the cart UI
        updateCartUI();

        initCatalog()

        setupCategoryFilters()
    })
    .catch(err => {
        // Handle any errors in loading the partials
        console.error("Error loading components:", err);
    });
