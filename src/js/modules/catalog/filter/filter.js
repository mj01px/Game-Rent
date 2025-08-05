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
            
            <div class="filter-group search-group">
                <label for="search-name">Search:</label>
                <input type="text" id="search-name" class="search-input" placeholder="Game name...">
            </div>
            
            <button class="clear-filters-btn">Clear Filters</button>
        `;
    }

    setupEventListeners() {
        // Search by name
        this.container.querySelector('#search-name').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.onFilterChange();
        });

        // Platform filter
        this.container.querySelector('#platform-filter').addEventListener('change', (e) => {
            this.platform = e.target.value;
            this.onFilterChange();
        });

        // Clear filters button
        this.container.querySelector('.clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });
    }

    clearFilters() {
        // Reset all filter values
        this.searchTerm = '';
        this.platform = 'all';

        // Update UI elements to reflect cleared state
        this.container.querySelector('#search-name').value = '';
        this.container.querySelector('#platform-filter').value = 'all';

        // Trigger filter change
        this.onFilterChange();
    }

    applyFilters(games) {
        return games.filter(game => {
            const nameMatch = game.name.toLowerCase().includes(this.searchTerm);
            const platformMatch = this.platform === 'all' || game.platform === this.platform;

            return nameMatch && platformMatch;
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