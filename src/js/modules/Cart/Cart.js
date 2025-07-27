import {updateCartUI} from "../Games/AddToCart.js";

export function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const openCartBtn = document.querySelector('.cart-icon');

    if (!cartModal || !closeCart || !openCartBtn) {
        console.warn('Cart modal elements not found, retrying in 100ms');
        setTimeout(openCartModal, 100);
        return;
    }

    openCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCartUI();
    });

    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}