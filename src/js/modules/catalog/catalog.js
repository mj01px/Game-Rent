import { games } from '../../data/games.js';
import { FilterManager } from './filter/filter.js';
import { PaginationManager } from './pagination/pagination.js';

export class GameCatalog {
    constructor(containerSelector, options = {}) {
        this.defaults = {
            baseImagePath: '../../../assets/images/games/',
            itemsPerPage: 12,
            lazyLoad: true,
            initialSort: 'name'
        };

        this.config = { ...this.defaults, ...options };
        this.container = document.querySelector(containerSelector);
        this.games = [];
        this.filteredGames = [];
        this.filterManager = null;
        this.paginationManager = null;

        if (!this.container) {
            console.error('Container element not found!');
            return;
        }

        this.init().catch(error => {
            console.error('Failed to initialize GameCatalog:', error);
            this.showErrorMessage();
        });
    }

    async init() {
        this.setupUI();
        this.initializeManagers();
        await this.loadGames();
        this.filterManager.setReady(); // Indica que os filtros podem ser aplicados
        this.renderInitialGames();
    }

    initializeManagers() {
        this.filterManager = new FilterManager({
            container: this.container,
            initialSort: this.config.initialSort,
            onFilterChange: () => this.handleFilterChange()
        });

        this.paginationManager = new PaginationManager({
            container: this.container,
            itemsPerPage: this.config.itemsPerPage,
            onPageChange: (page) => this.handlePageChange(page)
        });
    }

    async loadGames() {
        try {
            // Simula um carregamento assíncrono
            await new Promise(resolve => setTimeout(resolve, 100));

            // Aqui você pode substituir por uma chamada API real se necessário
            this.games = [...games]; // Cria uma cópia dos dados
            this.filteredGames = this.filterManager.applyFilters(this.games);
            this.sortGames();
            return this.filteredGames;
        } catch (error) {
            console.error('Error loading games:', error);
            this.showErrorMessage();
            throw error;
        }
    }

    renderInitialGames() {
        if (!this.filteredGames.length) {
            this.showNoGamesMessage();
            return;
        }

        this.paginationManager.update(this.filteredGames.length);
        this.renderGames();
    }

    handleFilterChange() {
        try {
            this.filteredGames = this.filterManager.applyFilters(this.games);
            this.sortGames();
            this.paginationManager.reset();
            this.paginationManager.update(this.filteredGames.length);
            this.renderGames();
        } catch (error) {
            console.error('Error handling filter change:', error);
        }
    }

    handlePageChange(page) {
        this.renderGames();
    }

    sortGames() {
        const sortFunction = this.filterManager.getSortFunction();
        this.filteredGames.sort(sortFunction);
    }

    setupUI() {
        this.container.innerHTML = `
            <div class="featured">
                <div class="catalog-controls"></div>
                <div class="carousel-container">
                    <div class="games-grid"></div>
                    <div class="pagination-container"></div>
                </div>
            </div>
        `;

        this.gamesGrid = this.container.querySelector('.games-grid');
    }

    renderGames() {
        if (!this.filteredGames.length) {
            this.showNoGamesMessage();
            return;
        }

        const currentPage = this.paginationManager.currentPage;
        const gamesToShow = this.paginationManager.getPaginatedItems(this.filteredGames);

        this.gamesGrid.innerHTML = gamesToShow.map(game => this.createGameCard(game)).join('');
        this.setupCardInteractions();
    }

    createGameCard(game) {
        const fullStars = Math.floor(game.rating);
        const halfStar = game.rating % 1 >= 0.5;

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
        if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
        for (let i = starsHTML.match(/fa-star/g)?.length || 0; i < 5; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        const cardClasses = `game-card ${game.available ? '' : 'unavailable'}`;
        const buttonHTML = game.available
            ? `<button class="show-description" data-id="${game.id}">Show Description</button>`
            : `<button class="show-description" data-id="${game.id}" disabled>Unavailable</button>`;

        return `
            <div class="${cardClasses}" data-id="${game.id}" data-rating="${game.rating}" 
                 data-price="${game.rentalPrice}" data-platform="${game.platform}">
                <div class="game-image">
                    <img src="${this.config.baseImagePath}${game.image}" 
                         alt="${game.name}" 
                         ${this.config.lazyLoad ? 'loading="lazy"' : ''}>
                    <span class="platform ${game.platform}">${game.platformName}</span>
                    ${!game.available ? '<span class="unavailable-badge">Unavailable</span>' : ''}
                </div>
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <div class="game-rating">
                        ${starsHTML}
                        <span>${game.rating.toFixed(1)}</span>
                    </div>
                    <div class="game-price">
                        <span class="original-price">$${game.originalPrice.toFixed(2)}</span>
                        <span class="rental-price">$${game.rentalPrice.toFixed(2)}/week</span>
                    </div>
                    ${buttonHTML}
                </div>
            </div>
        `;
    }

    setupCardInteractions() {
        this.container.querySelectorAll('.show-description').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const gameId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.handleShowDescription(gameId);
            });
        });

        this.container.querySelectorAll('.rent-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const gameId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.handleRentGame(gameId);
            });
        });
    }

    handleShowDescription(gameId) {
        const game = this.filteredGames.find(g => g.id === gameId);
        if (game) {
            // Implemente a lógica para mostrar a descrição do jogo
            console.log('Showing description for:', game.name);
        }
    }

    handleRentGame(gameId) {
        const game = this.filteredGames.find(g => g.id === gameId);
        if (game) {
            console.log('Adding to cart:', game.name);
            if (window.addToCart) {
                window.addToCart(game);
            } else {
                console.error('addToCart function not found');
            }
        }
    }

    showNoGamesMessage() {
        if (this.gamesGrid) {
            this.gamesGrid.innerHTML = `
                <div class="no-games-message">
                    <i class="fas fa-gamepad"></i>
                    <strong>No Games Found</strong>
                    <p>Try adjusting your filters or search criteria.</p>
                </div>
            `;
        }
    }

    showErrorMessage() {
        this.container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Error loading games</strong>
                <p>Please try reloading the page or come back later.</p>
                <button class="reload-btn">Reload</button>
            </div>
        `;

        this.container.querySelector('.reload-btn')?.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

export function redirectToCatalog(filterOptions = {}) {
    // Armazena os filtros no sessionStorage para serem aplicados após o redirecionamento
    if (Object.keys(filterOptions).length > 0) {
        sessionStorage.setItem('initialFilter', JSON.stringify(filterOptions));
    }

    // Redireciona para a página do catálogo
    window.location.href = '../../components/catalog/catalog.html';
}

export function initCatalog() {
    const button = document.querySelector('.cta-btn');

    if (button) {
        button.addEventListener('click', () => {
            redirectToCatalog();
        });
    }
}