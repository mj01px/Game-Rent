import {openCartModal} from "../modules/homepage/Cart/Cart.js";
import {initializeCart, updateCartUI} from "../modules/homepage/Cart/CartUI.js";
import {GameCatalog} from "../modules/catalog/catalog.js";
import {openDescriptionModal} from "../modules/homepage/Games/GameDescription.js";
import {games} from "../data/games.js";

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
        initContainer('game-description-container', 'game-modal.html', '../../components/homepage/game-card/'),
        initContainer('game-description-container', 'game-modal.html', '../../components/homepage/game-card/'),
    ])
        .then(() => {
            // Inicializa o carrinho
            initializeCart();
            openCartModal();
            updateCartUI();

            // Inicializa o modal de descrição (mas desativa o listener automático)
            const modalInit = openDescriptionModal(games);

            // Remove o listener padrão que procura por clicks em '.show-description'
            // Assumindo que a função openDescriptionModal retorna o handler
            if (modalInit && modalInit.clickHandler) {
                document.removeEventListener('click', modalInit.clickHandler);
            }

            // Inicializa o catálogo
            const catalog = new GameCatalog('#catalog-container', {
                itemsPerPage: 12,
                sortBy: 'rating'
            });

            // Configura uma forma de abrir o modal a partir do catálogo
            if (window) {
                window.openGameModal = function(gameId) {
                    const game = games.find(g => g.id === gameId);
                    if (game) {
                        // Atualiza o modal com o jogo específico
                        document.getElementById('modalGameTitle').textContent = game.name;
                        document.getElementById('modalGameDescription').textContent = game.description;
                        document.getElementById('modalGameImage').src = `../../../assets/images/games/${game.image}`;

                        const platformElem = document.getElementById('modalPlatform');
                        platformElem.textContent = game.platformName;
                        platformElem.className = `platform ${game.platform}`;

                        document.getElementById('modalOriginalPrice').textContent = `$${game.originalPrice.toFixed(2)}`;
                        document.getElementById('modalRentalPrice').textContent = `$${game.rentalPrice.toFixed(2)}/Week`;

                        const rating = game.rating;
                        const fullStars = '★'.repeat(Math.floor(rating));
                        const emptyStars = '☆'.repeat(5 - Math.floor(rating));
                        document.getElementById('modalGameRating').innerHTML = `${fullStars}${emptyStars} <span>${rating.toFixed(1)}</span>`;

                        // Mostra o modal
                        document.getElementById('game-description-modal').classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                };
            }
        })
        .catch(err => {
            console.error("Error loading catalog components:", err);
        });
}