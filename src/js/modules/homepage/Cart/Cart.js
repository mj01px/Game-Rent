import {updateCartUI} from "../Cart/CartUI.js";

/**
 * Initializes event listeners to handle opening and closing
 * of the shopping cart modal.
 */
export function openCartModal() {
    // Get DOM elements: the modal, close button, and cart icon button
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const openCartBtn = document.querySelector('.cart-icon');

    const button = document.querySelector('.checkout-btn');

    if (button) {
        button.addEventListener('click', () => {
            window.location.href = '../../components/finishBuy/finish-buy.html'; // Adjust the path as necessary
        });
    }

    // If any required element is missing, retry initialization after 100ms
    if (!cartModal || !closeCart || !openCartBtn) {
        console.warn('Cart modal elements not found, retrying in 100ms');
        setTimeout(openCartModal, 100);
        return;
    }

    // When clicking the cart icon, display the modal and update its UI
    openCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCartUI(); // Refresh the cart contents and totals
    });

    // When clicking the close button inside modal, hide the modal
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Clicking outside the modal content (on overlay) also closes the modal
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Close the modal when the Escape key is pressed
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal.style.display === 'block') {
            cartModal.style.display = 'none';
        }
    });
}
