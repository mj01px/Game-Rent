import {openCartModal} from "../modules/homepage/Cart/Cart.js";
import {initializeCart, updateCartUI} from "../modules/homepage/Cart/CartUI.js";
import {GameCatalog} from "../modules/catalog/catalog.js";
import {openDescriptionModal} from "../modules/homepage/Games/GameDescription.js";
import {games} from "../data/games.js";

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

if (document.getElementById('catalog-container')) {
    let catalogInstance; // Variável para armazenar a instância do catálogo

    Promise.all([
        initContainer('head-container', 'head.html', '../../partials/shared/'),
        initContainer('navbar-container-catalog', 'navbar-catalog.html', '../../components/catalog/navbar-catalog/'),
        initContainer('footer-container', 'footer.html', '../../partials/shared/'),
        initContainer('cart-modal-container', 'cart-modal.html', '../../components/homepage/cart-modal/'),
        initContainer('game-description-container', 'game-modal.html', '../../components/homepage/game-card/'),
    ])
        .then(() => {
            initializeCart();
            openCartModal();
            updateCartUI();

            const modalInit = openDescriptionModal(games);
            if (modalInit && modalInit.clickHandler) {
                document.removeEventListener('click', modalInit.clickHandler);
            }

            // Inicializa o catálogo e armazena a instância
            catalogInstance = new GameCatalog('#catalog-container', {
                itemsPerPage: 12,
                sortBy: 'rating'
            });

            // Configura o search da navbar - AGORA COM RETRY
            const connectSearchInput = (attempts = 0) => {
                const maxAttempts = 5;
                const searchInput = document.querySelector('.catalog-navbar #search-name');

                if (searchInput && catalogInstance.filterManager) {
                    // Configura o evento de input (CORREÇÃO AQUI - usando setFilters em vez de setFilter)
                    searchInput.addEventListener('input', (e) => {
                        catalogInstance.filterManager.setFilters({
                            searchTerm: e.target.value.toLowerCase().trim()
                        });
                    });

                    // Sincroniza o valor do input com o estado atual do filtro
                    if (catalogInstance.filterManager.filters.searchTerm) {
                        searchInput.value = catalogInstance.filterManager.filters.searchTerm;
                    }

                } else if (attempts < maxAttempts) {
                    console.log(`Tentativa ${attempts + 1}: Elementos não prontos, tentando novamente...`);
                    setTimeout(() => connectSearchInput(attempts + 1), 200 * (attempts + 1));
                } else {
                    console.error('Não foi possível conectar o search input após várias tentativas');
                }
            };

            // Primeira tentativa de conexão
            setTimeout(() => connectSearchInput(), 300);

            // Configuração do modal
            if (window) {
                window.openGameModal = function(gameId) {
                    const game = games.find(g => g.id === gameId);
                    if (game) {
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