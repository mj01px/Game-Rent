export function updateRentedCount() {
    const buttonClicked = document.getElementById('add-to-cart-btn');

    buttonClicked.addEventListener('click', () => {
        console.log('[modalCart] Button clicked.');
        updateRentedCount();
    });
}
