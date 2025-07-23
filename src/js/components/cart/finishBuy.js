/**
 * Handles the purchase finalization process
 * Sets up event listener for the checkout button
 */
export function finishBuy() {
    // 1. Get the checkout button DOM element
    const finishBuyBtn = document.getElementById('checkout-btn');

    // 2. Add click event listener to the button
    finishBuyBtn.addEventListener('click', () => {
        console.log('Finishing purchase...');
        // (Future implementation: Add checkout logic here)

        // Redirect to the new page
        window.location.href = 'web/components/checkout/checkout.html';
    });
}

/**
 * Calculates and updates the total cart value
 * Sums up all items (price × quantity) and updates the total display
 */
export function updateCartValue() {
    // 1. Get all cart item elements
    const cartItems = document.querySelectorAll('.cart-modal__item');
    let total = 0;

    // 2. Process each item in the cart
    cartItems.forEach(item => {
        // Get price text and quantity input elements
        const priceText = item.querySelector('.cart-modal__item-price').textContent;
        const quantityInput = item.querySelector('.cart-modal__item-qty-input');

        // 3. Parse current values (with fallbacks)
        // - Remove non-numeric characters from price (keeps digits, dots and minus)
        // - Default to quantity 1 if input is invalid
        const quantity = parseInt(quantityInput.value) || 1;
        const price = parseFloat(priceText.replace(/[^\d.-]/g, ''));

        // 4. Add to running total
        total += price * quantity;
    });

    // 5. Update the total display with 2 decimal places
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

/**
 * Initializes automatic cart value updates
 * Sets up event listeners for quantity changes
 */
export function initCartValueUpdate() {
    // Listen for input events on the entire document
    document.addEventListener('input', (e) => {
        // Check if the changed element is a cart quantity input
        if (e.target.classList.contains('cart-modal__item-qty-input')) {
            // Trigger cart value recalculation
            updateCartValue();
        }
    });
}