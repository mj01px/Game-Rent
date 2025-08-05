import { games } from '../../data/games.js';
import {openDescriptionModal} from "../homepage/Games/GameDescription.js";

export class GameCatalog {
    constructor(containerSelector, options = {}) {
        this.defaults = {
            filterRating: 0,
            sortBy: 'name',
            baseImagePath: '../../../assets/images/games/',
            itemsPerPage: 12, // 4 columns x 3 rows
            lazyLoad: true
        };

        this.config = { ...this.defaults, ...options };
        this.container = document.querySelector(containerSelector);
        this.currentPage = 1;
        this.filteredGames = [];

        this.init().then(() => {
            console.log('GameCatalog initialized successfully');
        });
    }

    async init() {
        if (!this.container) {
            console.error('Container element not found!');
            return;
        }

        await this.loadGames();
        this.setupUI();
        this.renderGames();
        this.setupEventListeners();
    }

    async loadGames() {
        try {
            this.filteredGames = games
                .filter(game => game.rating >= this.config.filterRating)
                .sort(this.getSortFunction());

        } catch (error) {
            console.error('Error loading games:', error);
            this.showErrorMessage();
        }
    }

    getSortFunction() {
        switch(this.config.sortBy) {
            case 'rating':
                return (a, b) => b.rating - a.rating;
            case 'price':
                return (a, b) => a.rentalPrice - b.rentalPrice;
            case 'name':
            default:
                return (a, b) => a.name.localeCompare(b.name);
        }
    }

    setupUI() {
        this.container.innerHTML = `
            <div class="featured">
                <div class="catalog-controls">
                    <div class="filter-group">
                        <label for="sort-by">Sort by:</label>
                        <select id="sort-by" class="sort-select">
                            <option value="name" ${this.config.sortBy === 'name' ? 'selected' : ''}>Name</option>
                            <option value="rating" ${this.config.sortBy === 'rating' ? 'selected' : ''}>Rating</option>
                            <option value="price" ${this.config.sortBy === 'price' ? 'selected' : ''}>Price</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="platform-filter">Platform:</label>
                        <select id="platform-filter" class="platform-filter">
                            <option value="all">All</option>
                            <option value="playstation">PlayStation</option>
                            <option value="xbox">Xbox</option>
                            <option value="switch">Switch</option>
                            <option value="pc">PC</option>
                        </select>
                    </div>
                </div>
                
                <div class="carousel-container">
                    <div class="games-grid"></div>
                </div>
                
                <div class="pagination">
                    <button class="prev-page" disabled>Previous</button>
                    <span class="page-info">Page 1</span>
                    <button class="next-page">Next</button>
                </div>
            </div>
        `;

        this.gamesGrid = this.container.querySelector('.games-grid');
        this.prevPageBtn = this.container.querySelector('.prev-page');
        this.nextPageBtn = this.container.querySelector('.next-page');
        this.pageInfo = this.container.querySelector('.page-info');
    }

    renderGames() {
        const startIndex = (this.currentPage - 1) * this.config.itemsPerPage;
        const endIndex = startIndex + this.config.itemsPerPage;
        const gamesToShow = this.filteredGames.slice(startIndex, endIndex);

        this.gamesGrid.innerHTML = gamesToShow.map(game => this.createGameCard(game)).join('');
        this.updatePaginationControls();
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

        return `
        <div class="game-card" data-id="${game.id}" data-rating="${game.rating}" 
             data-price="${game.rentalPrice}" data-platform="${game.platform}">
            <div class="game-image">
                <img src="${this.config.baseImagePath}${game.image}" 
                     alt="${game.name}" 
                     ${this.config.lazyLoad ? 'loading="lazy"' : ''}>
                <span class="platform ${game.platform}">${game.platformName}</span>
            </div>
            <div class="game-info">
                <h3>${game.name}</h3>
                <div class="game-rating">
                    ${starsHTML}
                    <span>${game.rating.toFixed(1)}</span>
                </div>
                <div class="game-price">
                    <span class="original-price">From: $${game.originalPrice.toFixed(2)}</span>
                    <span class="rental-price">$${game.rentalPrice.toFixed(2)}/week</span>
                </div>
                <button class="show-description" data-id="${game.id}">Show Description</button>
     
            </div>
        </div>
        `;
    }

    //open modal with game description
    setupCardInteractions() {
        this.container.querySelectorAll('.show-description').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const gameId = parseInt(e.currentTarget.getAttribute('data-id'));

                // Chama a função global para abrir o modal
                if (window.openGameModal) {
                    window.openGameModal(gameId);
                }
            });
        });

        this.container.querySelectorAll('.rent-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.closest('.game-card').dataset.id;
                this.handleRentGame(gameId);
            });
        });
    }

    handleRentGame(gameId) {
        const game = this.filteredGames.find(g => g.id == gameId);
        console.log('Renting game:', game?.name);
        alert(`You are renting: ${game?.name}`);
    }

    setupEventListeners() {
        this.container.querySelector('.sort-select').addEventListener('change', (e) => {
            this.config.sortBy = e.target.value;
            this.reloadGames();
        });

        this.container.querySelector('.platform-filter').addEventListener('change', (e) => {
            this.filterByPlatform(e.target.value);
        });

        this.prevPageBtn.addEventListener('click', () => {
            this.currentPage--;
            this.renderGames();
        });

        this.nextPageBtn.addEventListener('click', () => {
            this.currentPage++;
            this.renderGames();
        });
    }

    filterByPlatform(platform) {
        if (platform === 'all') {
            this.filteredGames = games;
        } else {
            this.filteredGames = games.filter(game => game.platform === platform);
        }
        this.currentPage = 1;
        this.renderGames();
    }

    reloadGames() {
        this.loadGames().then(() => {
            this.currentPage = 1;
            this.renderGames();
        });
    }

    updatePaginationControls() {
        const totalPages = Math.ceil(this.filteredGames.length / this.config.itemsPerPage);
        const startItem = ((this.currentPage - 1) * this.config.itemsPerPage) + 1;
        const endItem = Math.min(this.currentPage * this.config.itemsPerPage, this.filteredGames.length);

        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage >= totalPages;
        this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages} | Items ${startItem}-${endItem} of ${this.filteredGames.length}`;
    }

    showErrorMessage() {
        this.container.innerHTML = `
            <div class="no-games-message">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Error loading games</strong>
                <p>Please try reloading the page or come back later.</p>
                <button class="reload-btn">Reload</button>
            </div>
        `;

        this.container.querySelector('.reload-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

export function initCatalog() {
    const button = document.querySelector('.cta-btn');

    if (button) {
        button.addEventListener('click', () => {
            redirectToCatalog();
        });
    }
}
function redirectToCatalog() {
    window.location.href = '../../components/catalog/catalog.html';
}
