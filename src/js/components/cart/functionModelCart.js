/**
 * Adds a game to the shopping cart
 * @function addToCart
 * @param {string} id - The ID of the game to add to cart
 * @returns {void}
 *
 * This function:
 * 1. Retrieves game data from the game card
 * 2. Creates a new cart item element
 * 3. Appends it to the cart list
 * 4. Updates the cart counter
 */
export function addToCart(id) {
    // 1. Get required DOM elements
    const gameCard = document.getElementById(`game-${id}`);
    const cartItemsList = document.getElementById('cart-items'); // Cart list UL element

    // Validate elements exist before proceeding
    if (!gameCard || !cartItemsList) {
        console.error('Required elements not found:', { gameCard, cartItemsList });
        return;
    }

    // 2. Extract game data from card element
    const title = gameCard.querySelector('.dashboard__card-name')?.innerText || 'Game';
    const imgSrc = gameCard.querySelector('img')?.getAttribute('src') || 'img/game-placeholder.png';
    const price = gameCard.getAttribute('data-price') || 'Price not available';

    // 3. Create new cart item element
    const cartItem = document.createElement('li');
    cartItem.className = 'cart-modal__item';
    cartItem.innerHTML = `
        <div class="cart-modal__item-img">
            <img src="${imgSrc}" alt="${title}">
        </div>
        <div class="cart-modal__item-info">
            <p class="cart-modal__item-title">${title}</p>
            <p class="cart-modal__item-price">${price}</p>
            <label class="cart-modal__item-qty">
                Quantity: 
                <input type="number" min="1" value="1" class="cart-modal__item-qty-input">
            </label>
        </div>
    `;

    // 4. Add the new item to cart
    cartItemsList.appendChild(cartItem);

    // 5. Update cart counter
    updateCartCount();

    console.log('Item added to cart:', { title, price });
}

/**
 * Updates the cart counter display
 * @function updateCartCount
 * @returns {void}
 *
 * Counts all cart items and updates the counter badge
 */
function updateCartCount() {
    const count = document.querySelectorAll('.cart-modal__item').length;
    const countElement = document.getElementById('cart-count');

    // Safely update counter if element exists
    if (countElement) {
        countElement.textContent = count-1;
    }
}