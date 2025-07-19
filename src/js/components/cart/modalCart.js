import { checkCartEmpty } from './functionModelCart.js';
import { updateCartCount } from './functionModelCart.js';

/**
 * Initializes the shopping cart modal functionality
 * Handles opening/closing of the cart modal and click events
 */
export function initCartModal() {
    // Get DOM elements
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');

    // Validate required elements exist
    if (!cartIcon || !cartModal || !closeCart) {
        console.warn('[modalCart] Required elements not found');
        return;
    }

    /**
     * Event listener for cart icon click
     * Opens the cart modal
     */
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    /**
     * Event listener for close button click
     * Closes the cart modal
     */
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    /**
     * Event listener for window click
     * Closes modal when clicking outside (on backdrop)
     * @param {MouseEvent} e - The click event
     */
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    checkCartEmpty();
    updateCartCount();

}