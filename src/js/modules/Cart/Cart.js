export function openCartModal() {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart'); // corrigido

    cartIcon.addEventListener('click', () => {
        console.log(cartModal);
        cartModal.style.display = 'block'; // Use 'block' to show the modal
    });

    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none'; // Use 'none' to hide the modal
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none'; // Hide modal when clicking outside
        }
    });

    //close cart modal on escape key press esc
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            cartModal.style.display = 'none'; // Hide modal on Escape key
        }
    });

}
