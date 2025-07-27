// Cart.js
let cart = [];

export function initializeCart() {
    // Verificar se há itens no localStorage
    const savedCart = localStorage.getItem('gameCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

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

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

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

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.rentalPrice * item.quantity), 0);
}

function saveCart() {
    localStorage.setItem('gameCart', JSON.stringify(cart));
}

export function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.querySelector('.cart-total span');
    const cartCountElement = document.querySelector('.cart-count');
    const cartFooter = document.querySelector('.cart-total');

    if (!cartItemsContainer || !cartTotalElement || !cartCountElement || !cartFooter) {
        console.warn('Cart elements not found, retrying in 100ms');
        setTimeout(updateCartUI, 100);
        return;
    }

    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Atualizar itens
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = 'Total: $0.00';
        cartFooter.classList.add('cart-footer-hidden');
        return;
    } else {
        cartFooter.classList.remove('cart-footer-hidden');
    }

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

    // Atualizar total
    cartTotalElement.textContent = `Total: $${calculateTotal().toFixed(2)}`;

    // Adicionar event listeners
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}