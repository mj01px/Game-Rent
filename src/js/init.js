import {LoadGameData} from "./modules/Games/LoadGameData.js";
import {openCartModal} from "./modules/Cart/Cart.js";

export function initContainer(containerId, filePath, basePath) {
    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        });
}

Promise.all([
    initContainer('head-container', 'head.html', 'partials/shared/'),
    initContainer('navbar-container', 'navbar.html', 'partials/shared/'),
    initContainer('banner-container', 'banner.html', 'partials/shared/'),
    initContainer('games-container', 'game-card.html', 'components/game-card/'),
    initContainer('category-container', 'game-category.html', 'components/game-category/'),
    initContainer('workflow-container', 'workflow.html', 'partials/workflow/'),
    initContainer('footer-container', 'footer.html', 'partials/shared/'),
    initContainer('cart-modal-container', 'cart-modal.html', 'components/cart-modal/'), // Note o ID diferente
    initContainer('game-description-modal', 'game-modal.html', 'components/game-card/'),
])
    .then(() => {
        new LoadGameData('.featured');
        openCartModal();
    })
    .catch(err => {
        console.error("Error loading components:", err);
    });