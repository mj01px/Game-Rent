// Array to hold cart items in memory
let cart = [];

/** Broadcast intra-aba para qualquer tela (checkout incluso) */
function emitCartChanged() {
    try {
        const detail = { cart: cart.slice() };
        window.dispatchEvent(new CustomEvent('cart:changed', { detail }));
    } catch {}
}

/**
 * Initializes cart by loading saved data from localStorage if present.
 */
export function initializeCart() {
    const savedCart = localStorage.getItem('gameCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

/** Public helper (se precisar em outros lugares) */
export function getCart() {
    return cart.slice();
}

/**
 * Adds a game object to the cart.
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
            quantity: 1,
            // se tiver, pode salvar:
            platform: game.platform,
            platformName: game.platformName,
            available: game.available
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`${game.name} added to cart!`);
}

/** Remove item */
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

/** +/- quantidade */
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

/** Total */
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.rentalPrice * item.quantity), 0);
}

/** Persiste + notifica */
function saveCart() {
    localStorage.setItem('gameCart', JSON.stringify(cart));
    emitCartChanged();
}

/** Render do modal */
export function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.querySelector('.cart-total span');
    const cartCountElement = document.querySelector('.cart-count');
    const cartFooter = document.querySelector('.cart-total');

    if (!cartItemsContainer || !cartTotalElement || !cartCountElement || !cartFooter) {
        // tenta algumas vezes pra evitar dar ruim quando o DOM não montou ainda
        let tries = 5;
        const tick = () => {
            if (--tries <= 0) return;
            const ok = document.getElementById('cart-items') && document.querySelector('.cart-total span');
            if (ok) return updateCartUI();
            setTimeout(tick, 100);
        };
        setTimeout(tick, 100);
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartFooter.classList.add('cart-footer-hidden');
        cartTotalElement.textContent = `Total: $0.00`;
        return;
    } else {
        cartFooter.classList.remove('cart-footer-hidden');
    }

    cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="../../../assets/images/games/${item.image}" alt="${item.name}">
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

    cartTotalElement.textContent = `Total: $${calculateTotal().toFixed(2)}`;
}

/** Notificação */
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

/** ---- ONE-TIME: delegação global pros botões (modal + checkout) ---- */
if (!window.__cartDelegationInstalled) {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        // usa as CLASSES originais do modal
        if (btn.classList.contains('quantity-btn') || btn.classList.contains('remove-btn')) {
            const id = parseInt(btn.dataset.id, 10);
            if (!id) return;

            if (btn.classList.contains('minus')) updateQuantity(id, -1);
            else if (btn.classList.contains('plus')) updateQuantity(id, +1);
            else if (btn.classList.contains('remove-btn')) removeFromCart(id);
        }
    }, true); // capture true pra pegar cedo e evitar conflitos

    window.__cartDelegationInstalled = true;
}

/** Expor e reagir ao evento */
window.updateCartUI = updateCartUI;
window.addEventListener('cart:changed', () => updateCartUI());
