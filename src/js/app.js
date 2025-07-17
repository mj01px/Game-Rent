/**
 * Makes core functions globally available by attaching them to the window object
 * This allows direct access from HTML attributes like onclick
 */

// Import the loadComponent function and make it globally available
import { loadComponent } from './components/loadComponents.js';
window.loadComponent = loadComponent;

// Import the modalGameDetails function and make it globally available
import { modalGameDetails } from './components/games/modalGameDetails.js';
window.modalGameDetails = modalGameDetails;