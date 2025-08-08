export class FilterManager {
    constructor({ container, initialSort = 'name', onFilterChange }) {
        this.container = container;
        this.onFilterChange = onFilterChange;
        this.isReady = false;

        // Referência ao input de busca na navbar
        this.navbarSearchInput = document.querySelector('.catalog-navbar #search-name');

        // Filter state
        this.filters = {
            searchTerm: '',
            platform: 'all',
            genre: 'all',
            availability: 'all'
        };

        this.sortBy = initialSort;
        this.sortDirection = 'asc';

        // Centralized filter options (mantido igual)
        this.filterOptions = {
            platform: [
                { value: 'all', text: 'All Platforms' },
                { value: 'playstation', text: 'PlayStation' },
                { value: 'xbox', text: 'Xbox' },
                { value: 'switch', text: 'Switch' },
                { value: 'pc', text: 'PC' }
            ],
            genre: [
                { value: 'all', text: 'All Games' },
                { value: 'action', text: 'Action' },
                { value: 'adventure', text: 'Adventure' },
                { value: 'rpg', text: 'RPG' },
                { value: 'fps', text: 'FPS' },
                { value: 'sports', text: 'Sports' },
                { value: 'racing', text: 'Racing' },
                { value: 'horror', text: 'Horror' },
                { value: 'strategy', text: 'Strategy' },
                { value: 'simulation', text: 'Simulation' },
                { value: 'fighting', text: 'Fighting' },
                { value: 'platform', text: 'Platform' },
                { value: 'rhythm', text: 'Rhythm' },
                { value: 'moba', text: 'MOBA' },
                { value: 'sandbox', text: 'Sandbox' },
                { value: 'competitive', text: 'Competitive' },
                { value: 'party', text: 'Party' }
            ],
            availability: [
                { value: 'all', text: 'All' },
                { value: 'available', text: 'Available Now' },
                { value: 'unavailable', text: 'Unavailable' }
            ],
            sortBy: [
                { value: 'name', text: 'Name' },
                { value: 'price', text: 'Price' },
                { value: 'rating', text: 'Rating' },
            ]
        };

        this.init();
        this.checkInitialFilters();
    }
    init() {
        this.renderControls();
        this.setupEventListeners();
    }

    setReady() {
        this.isReady = true;
        this.onFilterChange();
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
                const element = this.container.querySelector(`#${key}-filter`);
                if (element) {
                    element.value = filters[key];
                }
                this.updateDropdownText(key, filters[key]);
            }

            if (key === 'sortBy') {
                this.sortBy = filters[key];
                const sortElement = this.container.querySelector('#sort-by');
                if (sortElement) {
                    sortElement.value = filters[key];
                }
                this.updateDropdownText('sortBy', filters[key]);
            }

            if (key === 'sortDirection') {
                this.sortDirection = filters[key];
                const icon = this.container.querySelector('.sort-icon');
                if (icon) {
                    icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
                }
            }
        });

        if (this.isReady) {
            this.onFilterChange();
        }
    }

    getSelectedText(value, options) {
        const option = options.find(opt => opt.value === value);
        return option ? option.text : options[0].text;
    }

    renderDropdown(filterName, label) {
        const options = this.filterOptions[filterName];
        const currentValue = filterName === 'sortBy' ? this.sortBy : this.filters[filterName];

        return `
            <div class="filter-pill ${filterName}-dropdown">
                <label>${label}:</label>
                <div class="dropdown-header">
                    <span class="dropdown-selected">${this.getSelectedText(currentValue, options)}</span>
                    <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    </svg>
                </div>
                <div class="dropdown-options">
                    ${options.map(opt => `
                        <div class="dropdown-option ${currentValue === opt.value ? 'selected' : ''}" 
                             data-value="${opt.value}">
                            ${opt.text}
                        </div>
                    `).join('')}
                </div>
                <select id="${filterName}-filter" style="display: none;">
                    ${options.map(opt => `
                        <option value="${opt.value}" ${currentValue === opt.value ? 'selected' : ''}>
                            ${opt.text}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    renderControls() {
        const controlsContainer = this.container.querySelector('.catalog-controls');
        if (!controlsContainer) return;

        // Adicionando campo de busca
        controlsContainer.innerHTML = `
            <div class="filter-row">
                <div class="search-box">
                </div>
                ${this.renderDropdown('platform', 'Platform')}
                ${this.renderDropdown('genre', 'Game')}
                ${this.renderDropdown('availability', 'Availability')}
                ${this.renderDropdown('sortBy', 'Sort By')}
                
                <button class="sort-direction-btn" aria-label="Toggle sort direction">
                    <span class="sort-icon">${this.sortDirection === 'asc' ? '↑' : '↓'}</span>
                </button>
                
                <button class="clear-filters-btn">Reset Filters</button>
            </div>
        `;

        this.setupDropdowns();
    }

    setupDropdowns() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-pill')) {
                document.querySelectorAll('.filter-pill').forEach(pill => {
                    pill.classList.remove('open');
                });
            }
        });

        document.querySelectorAll('.filter-pill').forEach(pill => {
            const header = pill.querySelector('.dropdown-header');
            const options = pill.querySelectorAll('.dropdown-option');
            const hiddenSelect = pill.querySelector('select');

            header.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.filter-pill').forEach(p => {
                    if (p !== pill) p.classList.remove('open');
                });
                pill.classList.toggle('open');
            });

            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = option.dataset.value;
                    const text = option.textContent;

                    pill.querySelector('.dropdown-selected').textContent = text;
                    pill.classList.remove('open');

                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');

                    hiddenSelect.value = value;
                    hiddenSelect.dispatchEvent(new Event('change'));
                });
            });

            hiddenSelect.addEventListener('change', () => {
                const filterName = hiddenSelect.id.replace('-filter', '');

                if (filterName === 'sortBy') {
                    this.sortBy = hiddenSelect.value;
                } else {
                    this.filters[filterName] = hiddenSelect.value;
                }

                this.onFilterChange();
            });
        });

        const resetBtn = this.container.querySelector('.clear-filters-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    updateDropdownText(filterName, value) {
        const options = this.filterOptions[filterName];
        if (!options) return;

        const selectedText = options.find(opt => opt.value === value)?.text || options[0].text;
        const dropdownSelector = `.${filterName}-dropdown .dropdown-selected`;
        const dropdownSelected = this.container.querySelector(dropdownSelector);

        if (dropdownSelected) {
            dropdownSelected.textContent = selectedText;
        }

        const dropdown = this.container.querySelector(dropdownSelector)?.closest('.filter-pill');
        if (dropdown) {
            dropdown.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === value);
            });
        }
    }

    updateAllDropdownTexts() {
        Object.keys(this.filters).forEach(filter => {
            this.updateDropdownText(filter, this.filters[filter]);
        });
        this.updateDropdownText('sortBy', this.sortBy);
    }

    setupEventListeners() {
        // Configuração do input de busca
        const searchInput = this.container.querySelector('#search-name');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.searchTerm = e.target.value.toLowerCase().trim();
                this.onFilterChange();
            });
        }

        // Mapeamento de eventos genéricos
        const eventMap = {
            '#platform-filter': (e) => {
                this.filters.platform = e.target.value;
                this.onFilterChange();
            },
            '#genre-filter': (e) => {
                this.filters.genre = e.target.value;
                this.onFilterChange();
            },
            '#availability-filter': (e) => {
                this.filters.availability = e.target.value;
                this.onFilterChange();
            },
            '#sort-by': (e) => {
                this.sortBy = e.target.value;
                this.onFilterChange();
            }
        };

        Object.entries(eventMap).forEach(([selector, handler]) => {
            const element = this.container.querySelector(selector);
            if (element) {
                element.addEventListener('change', handler);
            }
        });

        const sortDirectionBtn = this.container.querySelector('.sort-direction-btn');
        if (sortDirectionBtn) {
            sortDirectionBtn.addEventListener('click', () => {
                this.toggleSortDirection();
                this.onFilterChange();
            });
        }

        const clearFiltersBtn = this.container.querySelector('.clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
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
            availability: 'all'
        };
        this.sortBy = 'name';
        this.sortDirection = 'asc';

        // Limpa o input da navbar
        if (this.navbarSearchInput) {
            this.navbarSearchInput.value = '';
        }

        // Atualiza os selects
        const elementsToUpdate = {
            '#platform-filter': 'all',
            '#genre-filter': 'all',
            '#availability-filter': 'all',
            '#sort-by': 'name'
        };

        Object.entries(elementsToUpdate).forEach(([selector, value]) => {
            const element = this.container.querySelector(selector);
            if (element) element.value = value;
        });

        // Atualiza ícone de direção
        const icon = this.container.querySelector('.sort-icon');
        if (icon) icon.textContent = '↑';

        // Atualiza textos dos dropdowns
        this.updateAllDropdownTexts();

        // Trigger filter change
        if (this.isReady) {
            this.onFilterChange();
        }
    }   

    applyFilters(games) {
        if (!games || !Array.isArray(games)) return [];

        return games.filter(game => {
            const nameMatch = this.filters.searchTerm === '' ||
                game.name.toLowerCase().includes(this.filters.searchTerm);
            const platformMatch = this.filters.platform === 'all' ||
                game.platform === this.filters.platform;
            const genreMatch = this.filters.genre === 'all' ||
                (game.category && game.category.includes(this.filters.genre));

            // A disponibilidade não afeta quando estamos pesquisando por nome
            const availabilityMatch = this.filters.searchTerm === ''
                ? (this.filters.availability === 'all' ||
                    (this.filters.availability === 'available' && game.available) ||
                    (this.filters.availability === 'unavailable' && !game.available))
                : true;

            return nameMatch && platformMatch && genreMatch && availabilityMatch;
        }).sort(this.getSortFunction());
    }

    getSortFunction() {
        const directionModifier = this.sortDirection === 'asc' ? 1 : -1;

        switch(this.sortBy) {
            case 'name':
                return (a, b) => a.name.localeCompare(b.name) * directionModifier;
            case 'price':
                return (a, b) => {
                    const priceA = a.originalPrice || 0;
                    const priceB = b.originalPrice || 0;
                    return (priceA - priceB) * directionModifier;
                };
            case 'rating':
                return (a, b) => {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return (ratingA - ratingB) * directionModifier;
                };
            default:
                return (a, b) => a.name.localeCompare(b.name) * directionModifier;
        }
    }
}