// Array to hold cart items in memory
let cart = [];

/**
 * Initializes cart by loading saved data from localStorage if present.
 * Parses JSON string and updates UI accordingly.
 */
export function initializeCart() {
    const savedCart = localStorage.getItem('gameCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

/**
 * Adds a game object to the cart.
 * If already in cart, increments quantity by 1.
 * Otherwise, adds a new cart item with quantity 1.
 * @param {Object} game - Game data to add
 */
export function addToCart(game) {
    if (!game) return;

    const existingItem = cart.find(item => item.id === game.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: game.id,
            name: game.name,
            image: game.image,
            rentalPrice: game.rentalPrice,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`${game.name} added to cart!`);
}

/**
 * Removes an item from the cart by its ID.
 * @param {number} itemId - ID of the item to remove
 */
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

/**
 * Updates the quantity of a specific cart item by the given change (+/-).
 * Removes the item if quantity drops to zero or below.
 * @param {number} itemId - ID of the item to update
 * @param {number} change - Quantity change (+1 or -1)
 */
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        saveCart();
        updateCartUI();
    }
}

/**
 * Calculates the total rental price of all items in the cart.
 * @returns {number} Total price
 */
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.rentalPrice * item.quantity), 0);
}

/**
 * Saves the current cart state as JSON string in localStorage.
 */
function saveCart() {
    localStorage.setItem('gameCart', JSON.stringify(cart));
}

/**
 * Updates the cart UI:
 * - Shows cart items or empty message
 * - Updates total price and item count badge
 * - Adds event listeners for quantity buttons and remove buttons
 */
export function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.querySelector('.cart-total span');
    const cartCountElement = document.querySelector('.cart-count');
    const cartFooter = document.querySelector('.cart-total');

    // Retry if UI elements are not yet loaded in the DOM
    if (!cartItemsContainer || !cartTotalElement || !cartCountElement || !cartFooter) {
        console.warn('Cart elements not found, retrying in 100ms');
        setTimeout(updateCartUI, 100);
        return;
    }

    // Update cart item count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Display empty cart message and hide footer if cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartFooter.classList.add('cart-footer-hidden');
        return;
    } else {
        cartFooter.classList.remove('cart-footer-hidden');
    }

    // Render cart items markup
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="../assets/images/games/${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
            <div class="cart-item-price">
                $${(item.rentalPrice * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    // Update total price display
    cartTotalElement.textContent = `Total: $${calculateTotal().toFixed(2)}`;

    // Attach event listeners to quantity decrement buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
    });

    // Attach event listeners to quantity increment buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
    });

    // Attach event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

/**
 * Shows a temporary notification message on screen.
 * @param {string} message - Text to display
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Fade out and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
