export function addToCart(gameId) {
    const titleEl = document.getElementById('modal-game-title');
    const priceEl = document.getElementById('modal-game-price');

    const gameTitle = titleEl.innerText;
    const gamePrice = priceEl.innerText;

    console.log(gameTitle);
    console.log(gamePrice);
}
