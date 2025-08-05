import {openCartModal} from "../modules/homepage/Cart/Cart.js";
import {initializeCart, updateCartUI} from "../modules/homepage/Cart/CartUI.js";
import {GameCatalog} from "../modules/catalog/catalog.js";

// Função auxiliar para carregar containers com verificação de existência
export function initContainer(containerId, filePath, basePath) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found, skipping ${filePath}`);
        return Promise.resolve();
    }

    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
        });
}

// Verifica se estamos na página de catálogo antes de executar
if (document.getElementById('catalog-container')) {
    // Load all page components asynchronously
    Promise.all([
        initContainer('head-container', 'head.html', '../../partials/shared/'),
        initContainer('navbar-container', 'navbar.html', '../../partials/shared/'),
        initContainer('footer-container', 'footer.html', '../../partials/shared/'),
        initContainer('cart-modal-container', 'cart-modal.html', '../../components/homepage/cart-modal/'),
    ])
        .then(() => {
            initializeCart();
            openCartModal();
            updateCartUI();

            new GameCatalog('#catalog-container', {
                itemsPerPage: 12,
                sortBy: 'rating'
            });
        })
        .catch(err => {
            console.error("Error loading catalog components:", err);
        });
}