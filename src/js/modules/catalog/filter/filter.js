export class FilterManager {
    constructor({ container, initialSort = 'name', onFilterChange }) {
        this.container = container;
        this.onFilterChange = onFilterChange;
        this.isReady = false; // Flag para controlar quando está pronto

        // Filter state
        this.filters = {
            searchTerm: '',
            platform: 'all',
            genre: 'all',
            availability: 'available'
        };

        this.sortBy = initialSort;
        this.sortDirection = 'asc'; // 'asc' or 'desc'

        this.init();
        this.checkInitialFilters();
    }

    init() {
        this.renderControls();
        this.setupEventListeners();
    }

    // Método para indicar que o filtro está pronto para ser usado
    setReady() {
        this.isReady = true;
        this.onFilterChange(); // Dispara uma atualização inicial
    }

    checkInitialFilters() {
        const initialFilter = sessionStorage.getItem('initialFilter');
        if (initialFilter) {
            try {
                const filterOptions = JSON.parse(initialFilter);
                this.setFilters(filterOptions);
                sessionStorage.removeItem('initialFilter');
            } catch (e) {
                console.error('Error parsing initial filter:', e);
            }
        }
    }

    setFilters(filters) {
        Object.keys(filters).forEach(key => {
            if (key in this.filters) {
                this.filters[key] = filters[key];
                // Update UI if element exists
                const element = this.container.querySelector(`#${key}-filter`);
                if (element) {
                    element.value = filters[key];
                }
            }

            // Handle sort options
            if (key === 'sortBy') {
                this.sortBy = filters[key];
                const sortElement = this.container.querySelector('#sort-by');
                if (sortElement) {
                    sortElement.value = filters[key];
                }
            }

            if (key === 'sortDirection') {
                this.sortDirection = filters[key];
                const icon = this.container.querySelector('.sort-icon');
                if (icon) {
                    icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
                }
            }
        });

        // Só dispara onFilterChange se estiver pronto
        if (this.isReady) {
            this.onFilterChange();
        }
    }

    setFilter(property, value) {
        if (property in this.filters) {
            this.filters[property] = value;
            // Update UI if element exists
            const element = this.container.querySelector(`#${property}-filter`);
            if (element) {
                element.value = value;
            }

            if (this.isReady) {
                this.onFilterChange();
            }
        }
    }

    renderControls() {
        const controlsContainer = this.container.querySelector('.catalog-controls');
        if (!controlsContainer) return;

        controlsContainer.innerHTML = `
            <div class="filter-section">
                <div class="filter-group">
                    <label for="search-name">Search:</label>
                    <input type="text" id="search-name" class="search-input" placeholder="Game name..." value="${this.filters.searchTerm}">
                </div>
                
                <div class="filter-group">
                    <label for="platform-filter">Platform:</label>
                    <select id="platform-filter" class="platform-filter">
                        <option value="all" ${this.filters.platform === 'all' ? 'selected' : ''}>All Platforms</option>
                        <option value="playstation" ${this.filters.platform === 'playstation' ? 'selected' : ''}>PlayStation</option>
                        <option value="xbox" ${this.filters.platform === 'xbox' ? 'selected' : ''}>Xbox</option>
                        <option value="switch" ${this.filters.platform === 'switch' ? 'selected' : ''}>Switch</option>
                        <option value="pc" ${this.filters.platform === 'pc' ? 'selected' : ''}>PC</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="genre-filter">Genre:</label>
                    <select id="genre-filter" class="genre-filter">
                        <option value="all" ${this.filters.genre === 'all' ? 'selected' : ''}>All Genres</option>
                        <option value="action" ${this.filters.genre === 'action' ? 'selected' : ''}>Action</option>
                        <option value="adventure" ${this.filters.genre === 'adventure' ? 'selected' : ''}>Adventure</option>
                        <option value="rpg" ${this.filters.genre === 'rpg' ? 'selected' : ''}>RPG</option>
                        <option value="fps" ${this.filters.genre === 'fps' ? 'selected' : ''}>FPS</option>
                        <option value="sports" ${this.filters.genre === 'sports' ? 'selected' : ''}>Sports</option>
                        <option value="racing" ${this.filters.genre === 'racing' ? 'selected' : ''}>Racing</option>
                        <option value="horror" ${this.filters.genre === 'horror' ? 'selected' : ''}>Horror</option>
                        <option value="strategy" ${this.filters.genre === 'strategy' ? 'selected' : ''}>Strategy</option>
                        <option value="simulation" ${this.filters.genre === 'simulation' ? 'selected' : ''}>Simulation</option>
                        <option value="fighting" ${this.filters.genre === 'fighting' ? 'selected' : ''}>Fighting</option>
                        <option value="platform" ${this.filters.genre === 'platform' ? 'selected' : ''}>Platform</option>
                        <option value="rhythm" ${this.filters.genre === 'rhythm' ? 'selected' : ''}>Rhythm</option>
                        <option value="moba" ${this.filters.genre === 'moba' ? 'selected' : ''}>MOBA</option>
                        <option value="sandbox" ${this.filters.genre === 'sandbox' ? 'selected' : ''}>Sandbox</option>
                        <option value="competitive" ${this.filters.genre === 'competitive' ? 'selected' : ''}>Competitive</option>
                        <option value="party" ${this.filters.genre === 'party' ? 'selected' : ''}>Party</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="availability-filter">Availability:</label>
                    <select id="availability-filter">
                        <option value="available" ${this.filters.availability === 'available' ? 'selected' : ''}>Available Now</option>
                        <option value="all" ${this.filters.availability === 'all' ? 'selected' : ''}>All</option>
                        <option value="unavailable" ${this.filters.availability === 'unavailable' ? 'selected' : ''}>Unavailable</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-actions">
                <button class="clear-filters-btn">Reset Filters</button>
                <div class="sort-controls">
                    <label for="sort-by">Sort By:</label>
                    <select id="sort-by">
                        <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Name</option>
                        <option value="price" ${this.sortBy === 'price' ? 'selected' : ''}>Price</option>
                        <option value="rating" ${this.sortBy === 'rating' ? 'selected' : ''}>Rating</option>
                        <option value="rentalPrice" ${this.sortBy === 'rentalPrice' ? 'selected' : ''}>Rental Price</option>
                    </select>
                    <button class="sort-direction-btn" aria-label="Toggle sort direction">
                        <span class="sort-icon">${this.sortDirection === 'asc' ? '↑' : '↓'}</span>
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Search input
        const searchInput = this.container.querySelector('#search-name');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.searchTerm = e.target.value.toLowerCase().trim();
                this.onFilterChange();
            });
        }

        // Platform filter
        const platformFilter = this.container.querySelector('#platform-filter');
        if (platformFilter) {
            platformFilter.addEventListener('change', (e) => {
                this.filters.platform = e.target.value;
                this.onFilterChange();
            });
        }

        // Genre filter
        const genreFilter = this.container.querySelector('#genre-filter');
        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => {
                this.filters.genre = e.target.value;
                this.onFilterChange();
            });
        }

        // Availability filter
        const availabilityFilter = this.container.querySelector('#availability-filter');
        if (availabilityFilter) {
            availabilityFilter.addEventListener('change', (e) => {
                this.filters.availability = e.target.value;
                this.onFilterChange();
            });
        }

        // Sort by
        const sortBy = this.container.querySelector('#sort-by');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.onFilterChange();
            });
        }

        // Sort direction
        const sortDirectionBtn = this.container.querySelector('.sort-direction-btn');
        if (sortDirectionBtn) {
            sortDirectionBtn.addEventListener('click', () => {
                this.toggleSortDirection();
                this.onFilterChange();
            });
        }

        // Clear filters button
        const clearFiltersBtn = this.container.querySelector('.clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    toggleSortDirection() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        const icon = this.container.querySelector('.sort-icon');
        if (icon) {
            icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
        }
    }

    clearFilters() {
        // Reset all filter values
        this.filters = {
            searchTerm: '',
            platform: 'all',
            genre: 'all',
            availability: 'available'
        };

        this.sortBy = 'rating';
        this.sortDirection = 'asc';

        // Update UI elements to reflect cleared state
        const searchInput = this.container.querySelector('#search-name');
        if (searchInput) searchInput.value = '';

        const platformFilter = this.container.querySelector('#platform-filter');
        if (platformFilter) platformFilter.value = 'all';

        const genreFilter = this.container.querySelector('#genre-filter');
        if (genreFilter) genreFilter.value = 'all';

        const availabilityFilter = this.container.querySelector('#availability-filter');
        if (availabilityFilter) availabilityFilter.value = 'available';

        const sortBy = this.container.querySelector('#sort-by');
        if (sortBy) sortBy.value = 'rating';

        const icon = this.container.querySelector('.sort-icon');
        if (icon) icon.textContent = '↑';

        // Trigger filter change
        if (this.isReady) {
            this.onFilterChange();
        }
    }

    applyFilters(games) {
        if (!games || !Array.isArray(games)) return [];

        return games.filter(game => {
            const nameMatch = game.name.toLowerCase().includes(this.filters.searchTerm);
            const platformMatch = this.filters.platform === 'all' || game.platform === this.filters.platform;
            const genreMatch = this.filters.genre === 'all' ||
                (game.category && game.category.includes(this.filters.genre));
            const availabilityMatch = this.filters.availability === 'all' ||
                (this.filters.availability === 'available' && game.available) ||
                (this.filters.availability === 'unavailable' && !game.available);

            return nameMatch && platformMatch && genreMatch && availabilityMatch;
        });
    }

    getSortFunction() {
        const directionModifier = this.sortDirection === 'asc' ? 1 : -1;

        switch(this.sortBy) {
            case 'name':
                return (a, b) => a.name.localeCompare(b.name) * directionModifier;
            case 'price':
                return (a, b) => (a.originalPrice - b.originalPrice) * directionModifier;
            case 'rentalPrice':
                return (a, b) => (a.rentalPrice - b.rentalPrice) * directionModifier;
            case 'rating':
            default:
                return (a, b) => (b.rating - a.rating) * directionModifier;
        }
    }
}