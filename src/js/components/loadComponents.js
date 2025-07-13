// Function to load HTML components dynamically
function loadComponent(containerId, filePath, basePath ) {
    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        });
}

// Get the game ID from the URL parameters
Promise.all([
    loadComponent('navbar-container', '_navbar.html', 'web/components/'),
    loadComponent('game__card-container', 'game-card.html', 'web/' ),
    loadComponent('fade__bar-container', '_fade-bar.html', 'web/components/'),
    loadComponent('modal-container', '_modal-cart.html', 'web/components/'),
])
    .then(() => {
        // Execute before the DOMContentLoaded event
        const cartIcon = document.getElementById('cart-icon');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.getElementById('close-cart');

        // Event for the cart icon
        cartIcon.addEventListener('click', () => {
            console.log('Cart clicked');
            cartModal.style.display = 'flex';
        });

        // Close the cart modal
        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        // Close the cart modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    })
    .catch(err => {
        console.error("Error to load component:", err);
    });