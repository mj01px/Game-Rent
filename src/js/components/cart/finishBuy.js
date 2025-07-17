// // Function to finalize the purchase
// export function finishBuy() {
//     const finishBuyBtn = document.getElementById('checkout-btn');
//
//
//     if (!finishBuyBtn) {
//         console.warn('Checkout button not found');
//         return;
//     }
//
//     // Remove existing listener to prevent duplication
//     finishBuyBtn.replaceWith(finishBuyBtn.cloneNode(true));
//     const freshBtn = document.getElementById('checkout-btn');
//
//     freshBtn.addEventListener('click', () => {
//         console.log('Checkout initiated');
//         // Add checkout logic...
//     });
// }