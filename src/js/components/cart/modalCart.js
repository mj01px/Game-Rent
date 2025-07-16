// Modal Cart Component Loader
export function initCartModal() {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');

    // Verify if the elements exist before adding event listeners
    if (!cartIcon || !cartModal || !closeCart) {
        console.warn('[modalCart] Elements not find.');
        return;
    }

    // Add event listeners for opening and closing the cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    // Close the cart modal when the close button is clicked or when clicking outside the modal
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Close the cart modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}
