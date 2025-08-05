import { games } from '../../data/games.js';



export function initCatalog() {
    const button = document.querySelector('.cta-btn');

    button.addEventListener('click', () => {
        redirectToCatalog();
    });
}

function redirectToCatalog() {
    window.location.href = '../../components/catalog/catalog.html';
}


export class GameCatalog {
    constructor(containerSelector, options = {}) {
        this.defaults = {
            filterRating: 0, // Mostra todos os jogos por padrão
            sortBy: 'name', // Padrão: ordenar por nome
            baseImagePath: '../../../assets/images/games/',
            itemsPerPage: 1,
            lazyLoad: true
        };

        this.config = { ...this.defaults, ...options };
        this.container = document.querySelector(containerSelector);
        this.currentPage = 1;
        this.filteredGames = [];

        this.init().then(r => {
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
            // Filtra e ordena os jogos
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
        // Cria a estrutura do catálogo
        this.container.innerHTML = `
      <div class="catalog-controls">
        <div class="filter-group">
          <label for="sort-by">Ordenar por:</label>
          <select id="sort-by" class="sort-select">
            <option value="name" ${this.config.sortBy === 'name' ? 'selected' : ''}>Nome</option>
            <option value="rating" ${this.config.sortBy === 'rating' ? 'selected' : ''}>Avaliação</option>
            <option value="price" ${this.config.sortBy === 'price' ? 'selected' : ''}>Preço</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="platform-filter">Plataforma:</label>
          <select id="platform-filter" class="platform-filter">
            <option value="all">Todas</option>
            <option value="playstation">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="switch">Switch</option>
            <option value="pc">PC</option>
          </select>
        </div>
      </div>
      
      <div class="games-grid"></div>
      
      <div class="pagination">
        <button class="prev-page" disabled>Anterior</button>
        <span class="page-info">Página 1</span>
        <button class="next-page">Próxima</button>
      </div>
    `;

        this.gamesGrid = this.container.querySelector('.games-grid');
        this.prevPageBtn = this.container.querySelector('.prev-page');
        this.nextPageBtn = this.container.querySelector('.next-page');
        this.pageInfo = this.container.querySelector('.page-info');
    }

    renderGames() {
        // Calcula os jogos para a página atual
        const startIndex = (this.currentPage - 1) * this.config.itemsPerPage;
        const endIndex = startIndex + this.config.itemsPerPage;
        const gamesToShow = this.filteredGames.slice(startIndex, endIndex);

        // Renderiza os jogos
        this.gamesGrid.innerHTML = gamesToShow.map(game => this.createGameCard(game)).join('');

        // Atualiza controles de paginação
        this.updatePaginationControls();

        // Configura interações
        this.setupCardInteractions();
    }

    createGameCard(game) {
        const starsHTML = this.generateStarRating(game.rating);
        const isFeatured = game.rating >= 4.5;

        return `
      <div class="game-card" data-id="${game.id}" data-rating="${game.rating}" 
           data-price="${game.rentalPrice}" data-platform="${game.platform}">
        <div class="game-image">
          <img src="${this.config.baseImagePath}${game.image}" 
               alt="${game.name}" 
               ${this.config.lazyLoad ? 'loading="lazy"' : ''}>
          <span class="platform ${game.platform}">${game.platformName}</span>
          ${isFeatured ? '<span class="featured-badge">Destaque</span>' : ''}
        </div>
        
        <div class="game-info">
          <h3>${game.name}</h3>
          
          <div class="game-meta">
            <div class="game-rating">
              ${starsHTML}
              <span>${game.rating.toFixed(1)}</span>
            </div>
            
            <div class="game-price">
              <span class="rental-price">R$ ${game.rentalPrice.toFixed(2)}/semana</span>
              <span class="original-price">De: R$ ${game.originalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button class="show-description" aria-expanded="false">
            Ver Descrição
          </button>
          
          <div class="game-description" hidden>
            <p>${game.description || 'Descrição não disponível'}</p>
            <button class="rent-btn">Alugar Agora</button>
          </div>
        </div>
      </div>
    `;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';

        return stars;
    }

    setupCardInteractions() {
        // Descrição expansível
        this.container.querySelectorAll('.show-description').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.game-card');
                const desc = card.querySelector('.game-description');
                const isExpanded = desc.hidden;

                desc.hidden = !isExpanded;
                e.target.setAttribute('aria-expanded', isExpanded);
                e.target.textContent = isExpanded ? 'Ocultar' : 'Ver Descrição';
            });
        });

        // Botão de aluguel
        this.container.querySelectorAll('.rent-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.closest('.game-card').dataset.id;
                this.handleRentGame(gameId);
            });
        });
    }

    handleRentGame(gameId) {
        const game = this.filteredGames.find(g => g.id == gameId);
        console.log('Iniciando aluguel do jogo:', game?.name);
        // Adicione aqui a lógica para alugar o jogo
        alert(`Você está alugando: ${game?.name}`);
    }

    setupEventListeners() {
        // Filtros
        this.container.querySelector('.sort-select').addEventListener('change', (e) => {
            this.config.sortBy = e.target.value;
            this.reloadGames();
        });

        this.container.querySelector('.platform-filter').addEventListener('change', (e) => {
            this.filterByPlatform(e.target.value);
        });

        // Paginação
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

        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage >= totalPages;
        this.pageInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;
    }

    showErrorMessage() {
        this.container.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Ocorreu um erro ao carregar os jogos</h3>
        <p>Por favor, tente recarregar a página ou volte mais tarde.</p>
        <button class="reload-btn">Recarregar</button>
      </div>
    `;

        this.container.querySelector('.reload-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

