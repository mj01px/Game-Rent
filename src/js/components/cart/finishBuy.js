// Function to finalize the purchase
export function finishBuy() {
    // 1. Get required DOM elements
    const finishBuyBtn = document.getElementById('checkout-btn');

    finishBuyBtn.addEventListener('click', () => {
        console.log('Finishing purchase...');
    });
}

export function updateCartValue() {
    const cartItems = document.querySelectorAll('.cart-modal__item');
    let total = 0;

    cartItems.forEach(item => {
        const priceText = item.querySelector('.cart-modal__item-price').textContent;
        const quantityInput = item.querySelector('.cart-modal__item-qty-input');

        // Pega o valor ATUAL do input (mesmo que tenha sido alterado)
        const quantity = parseInt(quantityInput.value) || 1;
        const price = parseFloat(priceText.replace(/[^\d.-]/g, ''));

        total += price * quantity;
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
}

export function initCartValueUpdate() {
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('cart-modal__item-qty-input')) {
            updateCartValue(); // Recalcula sempre que o input muda
        }
    });
}
