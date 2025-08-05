export class FilterManager {
    constructor({ container, initialSort = 'name', onFilterChange }) {
        this.container = container;
        this.onFilterChange = onFilterChange;

        // Filter state
        this.filters = {
            searchTerm: '',
            platform: 'all',
            genre: 'all',
            availability: 'available'
        };

        this.sortBy = 'rating';
        this.sortDirection = 'asc'; // 'asc' or 'desc'

        this.init();
        this.container.querySelector('#sort-by').value = 'rating';
    }

    init() {
        this.renderControls();
        this.setupEventListeners();
    }

    renderControls() {
        const controlsContainer = this.container.querySelector('.catalog-controls');
        controlsContainer.innerHTML = `
            <div class="filter-section">
                <div class="filter-group">
                    <label for="search-name">Search:</label>
                    <input type="text" id="search-name" class="search-input" placeholder="Game name...">
                </div>
                
                <div class="filter-group">
                    <label for="platform-filter">Platform:</label>
                    <select id="platform-filter" class="platform-filter">
                        <option value="all">All Platforms</option>
                        <option value="playstation">PlayStation</option>
                        <option value="xbox">Xbox</option>
                        <option value="switch">Switch</option>
                        <option value="pc">PC</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="genre-filter">Genre:</label>
                    <select id="genre-filter" class="genre-filter">
                        <option value="all">All Genres</option>
                        <option value="action">Action</option>
                        <option value="adventure">Adventure</option>
                        <option value="rpg">RPG</option>
                        <option value="fps">FPS</option>
                        <option value="sports">Sports</option>
                        <option value="racing">Racing</option>
                        <option value="horror">Horror</option>
                        <option value="strategy">Strategy</option>
                        <option value="simulation">Simulation</option>
                        <option value="fighting">Fighting</option>
                        <option value="platform">Platform</option>
                        <option value="rhythm">Rhythm</option>
                        <option value="moba">MOBA</option>
                        <option value="competitive">Competitive</option>
                        <option value="party">Party</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="availability-filter">Availability:</label>
                    <select id="availability-filter">
                        <option value="available">Available Now</option>
                        <option value="all">All</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-actions">
                <button class="clear-filters-btn">Reset Filters</button>
                <div class="sort-controls">
                    <label for="sort-by">Sort By:</label>
                    <select id="sort-by">
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="rentalPrice">Rental Price</option>
                    </select>
                    <button class="sort-direction-btn" aria-label="Toggle sort direction">
                        <span class="sort-icon">↑</span>
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Search input
        this.container.querySelector('#search-name').addEventListener('input', (e) => {
            this.filters.searchTerm = e.target.value.toLowerCase().trim();
            this.onFilterChange();
        });

        // Platform filter
        this.container.querySelector('#platform-filter').addEventListener('change', (e) => {
            this.filters.platform = e.target.value;
            this.onFilterChange();
        });

        // Genre filter
        this.container.querySelector('#genre-filter').addEventListener('change', (e) => {
            this.filters.genre = e.target.value;
            this.onFilterChange();
        });

        // Availability filter
        this.container.querySelector('#availability-filter').addEventListener('change', (e) => {
            this.filters.availability = e.target.value;
            this.onFilterChange();
        });

        // Sort by
        this.container.querySelector('#sort-by').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.onFilterChange();
        });

        // Sort direction
        this.container.querySelector('.sort-direction-btn').addEventListener('click', () => {
            this.toggleSortDirection();
            this.onFilterChange();
        });

        // Clear filters button
        this.container.querySelector('.clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });
    }

    toggleSortDirection() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        const icon = this.container.querySelector('.sort-icon');
        icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
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
        this.container.querySelector('#search-name').value = '';
        this.container.querySelector('#platform-filter').value = 'all';
        this.container.querySelector('#genre-filter').value = 'all';
        this.container.querySelector('#availability-filter').value = 'available';
        this.container.querySelector('#sort-by').value = 'rating';
        this.container.querySelector('.sort-icon').textContent = '↑';

        // Trigger filter change
        this.onFilterChange();
    }

    applyFilters(games) {
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