// Function to finalize the purchase
export function finishBuy() {
    // 1. Get required DOM elements
    const finishBuyBtn = document.getElementById('checkout-btn');

    finishBuyBtn.addEventListener('click', () => {
        console.log('Finishing purchase...');

    });
}