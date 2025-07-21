/**
 * Adds a game to the shopping cart
 * @function addToCart
 * @param {string} id - The ID of the game to add to cart
 * @returns {void}
 *
 * This function:
 * Checks if cart is empty and displays appropriate message
 * @function checkCartEmpty
 * @returns {void}
 */
export function checkCartEmpty() {
    const cartItemsList = document.getElementById('cart-items');
    const cartFooter = document.querySelector('.cart-modal__footer');

    if (!cartItemsList || !cartFooter) return;

    // Remove any existing empty messages
    const emptyMessages = cartItemsList.querySelectorAll('.cart-modal__empty');
    emptyMessages.forEach(msg => msg.remove());

    // Count the number of items in the cart
    const items = cartItemsList.querySelectorAll('.cart-modal__item');

    if (items.length === 0) {
        // if no items, show empty message
        const emptyMsg = document.createElement('li');
        emptyMsg.className = 'cart-modal__empty';
        emptyMsg.textContent = 'Your cart is empty';
        cartItemsList.appendChild(emptyMsg);

        // Hide the footer when cart is empty
        cartFooter.style.display = 'none';
    } else {
        // if there are items, ensure footer is visible
        cartFooter.style.display = '';
    }
}

 /**
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
     cartItem.dataset.gameId = id; // get the game ID from the card
     cartItem.className = 'cart-modal__item';
     cartItem.innerHTML = `
        <div class="cart-modal__item-img">
            <img src="${imgSrc}" alt="${title}">
        </div>
        <div class="cart-modal__item-info">
            <button class="cart-modal__remove-item"></button> 
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
    checkCartEmpty();

    console.log('Item added to cart:', { title, price });
}

/**
 * Removes a game from the shopping cart and updates all related UI elements
 * @function removeFromCart
 * @returns {void}
 *
 * This function uses event delegation to handle all remove buttons in the cart.
 * When a game is removed from cart, it:
 * 1. Removes the item from cart DOM
 * 2. Updates the cart item counter
 * 3. Checks if cart is now empty
 * 4. Resets the game card's rental status UI
 */
export function removeFromCart() {
    const cartItemsList = document.getElementById('cart-items');

    if (!cartItemsList) {
        console.error('Cart items list not found');
        return;
    }

    // Event delegation for all remove buttons
    cartItemsList.addEventListener('click', (e) => {
        // Check if clicked element is a remove button
        if (e.target.classList.contains('cart-modal__remove-item')) {
            const cartItem = e.target.closest('.cart-modal__item');

            if (cartItem) {
                // 1. Remove cart item from DOM
                cartItem.remove();

                // 2. Update cart counter display
                updateCartCount();

                // 3. Check if cart is now empty
                checkCartEmpty();

                // 4. Get game ID from data attribute
                const gameId = cartItem.dataset.gameId;

                if (gameId) {
                    // 5. Reset game card rental status
                    const gameCard = document.getElementById(`game-${gameId}`);
                    if (gameCard) {
                        const image = gameCard.querySelector('.dashboard__card-img');
                        const button = gameCard.querySelector('.dashboard__card-btn');

                        if (image && button) {
                            // Remove rented visual indicators
                            image.classList.remove('dashboard__card-img--rented');
                            button.classList.remove('dashboard__card-btn--return');
                            // Reset button text to default
                            button.textContent = 'Rent';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Updates the cart counter display
 * @function updateCartCount
 * @returns {void}
 *
 * Counts all cart items and updates the counter badge
 */
export function updateCartCount() {
    const cartItemsList = document.getElementById('cart-items');
    if (!cartItemsList) return;

    // Count only the items with class 'cart-modal__item'
    const count = cartItemsList.querySelectorAll('.cart-modal__item').length;
    const countElement = document.getElementById('cart-count');

    if (countElement) {
        countElement.textContent = count;
    }
}