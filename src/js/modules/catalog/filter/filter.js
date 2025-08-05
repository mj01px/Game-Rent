export class FilterManager {
    constructor({ container, initialSort = 'name', onFilterChange }) {
        this.container = container;
        this.onFilterChange = onFilterChange;
        this.searchTerm = '';
        this.minPrice = 0;
        this.maxPrice = Infinity;
        this.platform = 'all';
        this.sortBy = initialSort;

        this.init();
    }

    init() {
        this.renderControls();
        this.setupEventListeners();
    }

    renderControls() {
        const controlsContainer = this.container.querySelector('.catalog-controls');
        controlsContainer.innerHTML = `
            <div class="filter-group search-group">
                <label for="search-name">Search:</label>
                <input type="text" id="search-name" class="search-input" placeholder="Game name...">
            </div>
            
            <div class="filter-group">
                <label for="price-range">Price Range:</label>
                <div class="price-range-container">
                    <input type="number" id="min-price" class="price-input" placeholder="Min" min="0">
                    <span>to</span>
                    <input type="number" id="max-price" class="price-input" placeholder="Max" min="0">
                </div>
            </div>
            
            <div class="filter-group">
                <label for="sort-by">Sort by:</label>
                <select id="sort-by" class="sort-select">
                    <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Name</option>
                    <option value="rating" ${this.sortBy === 'rating' ? 'selected' : ''}>Rating</option>
                    <option value="price" ${this.sortBy === 'price' ? 'selected' : ''}>Price</option>
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
        `;
    }

    setupEventListeners() {
        // Search by name
        this.container.querySelector('#search-name').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.onFilterChange();
        });

        // Price range
        this.container.querySelector('#min-price').addEventListener('change', (e) => {
            this.minPrice = parseFloat(e.target.value) || 0;
            this.onFilterChange();
        });

        this.container.querySelector('#max-price').addEventListener('change', (e) => {
            this.maxPrice = parseFloat(e.target.value) || Infinity;
            this.onFilterChange();
        });

        // Sorting
        this.container.querySelector('#sort-by').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.onFilterChange();
        });

        // Platform filter
        this.container.querySelector('#platform-filter').addEventListener('change', (e) => {
            this.platform = e.target.value;
            this.onFilterChange();
        });
    }

    applyFilters(games) {
        return games.filter(game => {
            const nameMatch = game.name.toLowerCase().includes(this.searchTerm);
            const priceMatch = game.rentalPrice >= this.minPrice && game.rentalPrice <= this.maxPrice;
            const platformMatch = this.platform === 'all' || game.platform === this.platform;

            return nameMatch && priceMatch && platformMatch;
        });
    }

    getSortFunction() {
        switch(this.sortBy) {
            case 'rating': return (a, b) => b.rating - a.rating;
            case 'price': return (a, b) => a.rentalPrice - b.rentalPrice;
            case 'name':
            default: return (a, b) => a.name.localeCompare(b.name);
        }
    }
}