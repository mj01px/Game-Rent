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

                // Atualiza o texto visível do dropdown
                this.updateDropdownText(key, filters[key]);
            }

            // Handle sort options
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

        // Só dispara onFilterChange se estiver pronto
        if (this.isReady) {
            this.onFilterChange();
        }
    }

// Novo método auxiliar para atualizar o texto de um dropdown específico
    updateDropdownText(filterName, value) {
        const options = this.getOptionsForFilter(filterName);
        if (!options) return;

        const selectedText = options.find(opt => opt.value === value)?.text || options[0].text;

        let dropdownSelector;
        switch(filterName) {
            case 'platform':
                dropdownSelector = '.platform-dropdown .dropdown-selected';
                break;
            case 'genre':
                dropdownSelector = '.genre-dropdown .dropdown-selected';
                break;
            case 'availability':
                dropdownSelector = '.availability-dropdown .dropdown-selected';
                break;
            case 'sortBy':
                dropdownSelector = '.sort-dropdown .dropdown-selected';
                break;
            default:
                return;
        }

        const dropdownSelected = this.container.querySelector(dropdownSelector);
        if (dropdownSelected) {
            dropdownSelected.textContent = selectedText;
        }

        // Atualiza a seleção visual das opções
        const dropdown = this.container.querySelector(dropdownSelector)?.closest('.filter-pill');
        if (dropdown) {
            dropdown.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === value);
            });
        }
    }

// Método auxiliar para obter as opções de um filtro
    getOptionsForFilter(filterName) {
        switch(filterName) {
            case 'platform':
                return [
                    { value: 'all', text: 'All Platforms' },
                    { value: 'playstation', text: 'PlayStation' },
                    { value: 'xbox', text: 'Xbox' },
                    { value: 'switch', text: 'Switch' },
                    { value: 'pc', text: 'PC' }
                ];
            case 'genre':
                return [
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
                ];
            case 'availability':
                return [
                    { value: 'available', text: 'Available Now' },
                    { value: 'all', text: 'All' },
                    { value: 'unavailable', text: 'Unavailable' }
                ];
            case 'sortBy':
                return [
                    { value: 'name', text: 'Name' },
                    { value: 'price', text: 'Price' },
                    { value: 'rating', text: 'Rating' },
                ];
            default:
                return null;
        }
    }

    renderControls() {
        const controlsContainer = this.container.querySelector('.catalog-controls');
        if (!controlsContainer) return;

        // Helper para criar texto selecionado
        const getSelectedText = (value, options) => {
            const option = options.find(opt => opt.value === value);
            return option ? option.text : options[0].text;
        };

        // Opções para cada dropdown
        const platformOptions = [
            { value: 'all', text: 'All Platforms' },
            { value: 'playstation', text: 'PlayStation' },
            { value: 'xbox', text: 'Xbox' },
            { value: 'switch', text: 'Switch' },
            { value: 'pc', text: 'PC' }
        ];

        const genreOptions = [
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
        ];

        const availabilityOptions = [
            { value: 'available', text: 'Available Now' },
            { value: 'all', text: 'All' },
            { value: 'unavailable', text: 'Unavailable' }
        ];

        const sortOptions = [
            { value: 'name', text: 'Name' },
            { value: 'price', text: 'Price' },
            { value: 'rating', text: 'Rating' },
        ];

        controlsContainer.innerHTML = `
    <div class="filter-row">
        <!-- Platform Dropdown -->
        <div class="filter-pill platform-dropdown">
            <label>Platform:</label>
            <div class="dropdown-header">
                <span class="dropdown-selected">${getSelectedText(this.filters.platform, platformOptions)}</span>
                <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
            </div>
            <div class="dropdown-options">
                ${platformOptions.map(opt => `
                    <div class="dropdown-option ${this.filters.platform === opt.value ? 'selected' : ''}" 
                         data-value="${opt.value}">
                        ${opt.text}
                    </div>
                `).join('')}
            </div>
            <select id="platform-filter" style="display: none;">
                ${platformOptions.map(opt => `
                    <option value="${opt.value}" ${this.filters.platform === opt.value ? 'selected' : ''}>
                        ${opt.text}
                    </option>
                `).join('')}
            </select>
        </div>
        
        <!-- Genre Dropdown -->
        <div class="filter-pill genre-dropdown">
            <label>Game:</label>
            <div class="dropdown-header">
                <span class="dropdown-selected">${getSelectedText(this.filters.genre, genreOptions)}</span>
                <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
            </div>
            <div class="dropdown-options">
                ${genreOptions.map(opt => `
                    <div class="dropdown-option ${this.filters.genre === opt.value ? 'selected' : ''}" 
                         data-value="${opt.value}">
                        ${opt.text}
                    </div>
                `).join('')}
            </div>
            <select id="genre-filter" style="display: none;">
                ${genreOptions.map(opt => `
                    <option value="${opt.value}" ${this.filters.genre === opt.value ? 'selected' : ''}>
                        ${opt.text}
                    </option>
                `).join('')}
            </select>
        </div>
        
        <!-- Availability Dropdown -->
        <div class="filter-pill availability-dropdown">
            <label>Availability:</label>
            <div class="dropdown-header">
                <span class="dropdown-selected">${getSelectedText(this.filters.availability, availabilityOptions)}</span>
                <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
            </div>
            <div class="dropdown-options">
                ${availabilityOptions.map(opt => `
                    <div class="dropdown-option ${this.filters.availability === opt.value ? 'selected' : ''}" 
                         data-value="${opt.value}">
                        ${opt.text}
                    </div>
                `).join('')}
            </div>
            <select id="availability-filter" style="display: none;">
                ${availabilityOptions.map(opt => `
                    <option value="${opt.value}" ${this.filters.availability === opt.value ? 'selected' : ''}>
                        ${opt.text}
                    </option>
                `).join('')}
            </select>
        </div>
        
        <!-- Sort By Dropdown -->
        <div class="filter-pill sort-dropdown sort-group">
            <label>Sort By:</label>
            <div class="dropdown-header">
                <span class="dropdown-selected">${getSelectedText(this.sortBy, sortOptions)}</span>
                <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
            </div>
            <div class="dropdown-options">
                ${sortOptions.map(opt => `
                    <div class="dropdown-option ${this.sortBy === opt.value ? 'selected' : ''}" 
                         data-value="${opt.value}">
                        ${opt.text}
                    </div>
                `).join('')}
            </div>
            <select id="sort-by" style="display: none;">
                ${sortOptions.map(opt => `
                    <option value="${opt.value}" ${this.sortBy === opt.value ? 'selected' : ''}>
                        ${opt.text}
                    </option>
                `).join('')}
            </select>
        </div>
        
        <!-- Sort Direction Button -->
        <button class="sort-direction-btn" aria-label="Toggle sort direction">
            <span class="sort-icon">${this.sortDirection === 'asc' ? '↑' : '↓'}</span>
        </button>
        
        <!-- Reset Button -->
        <button class="clear-filters-btn">Reset Filters</button>
    </div>
`;

        this.setupDropdowns();
    }

    setupDropdowns() {
        // Fecha dropdowns ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-pill')) {
                document.querySelectorAll('.filter-pill').forEach(pill => {
                    pill.classList.remove('open');
                });
            }
        });

        // Configura cada dropdown
        document.querySelectorAll('.filter-pill').forEach(pill => {
            const header = pill.querySelector('.dropdown-header');
            const options = pill.querySelectorAll('.dropdown-option');
            const hiddenSelect = pill.querySelector('select');

            header.addEventListener('click', (e) => {
                e.stopPropagation();

                // Fecha outros dropdowns abertos
                document.querySelectorAll('.filter-pill').forEach(p => {
                    if (p !== pill) p.classList.remove('open');
                });

                // Abre/fecha o atual
                pill.classList.toggle('open');
            });

            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = option.dataset.value;
                    const text = option.textContent;

                    // Atualiza visual
                    pill.querySelector('.dropdown-selected').textContent = text;
                    pill.classList.remove('open');

                    // Atualiza seleção
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');

                    // Atualiza o select hidden
                    hiddenSelect.value = value;

                    // Dispara evento de change
                    const event = new Event('change');
                    hiddenSelect.dispatchEvent(event);
                });
            });

            // Mantém sincronizado com eventos do select original
            hiddenSelect.addEventListener('change', () => {
                if (hiddenSelect.id === 'platform-filter') {
                    this.filters.platform = hiddenSelect.value;
                } else if (hiddenSelect.id === 'genre-filter') {
                    this.filters.genre = hiddenSelect.value;
                } else if (hiddenSelect.id === 'availability-filter') {
                    this.filters.availability = hiddenSelect.value;
                } else if (hiddenSelect.id === 'sort-by') {
                    this.sortBy = hiddenSelect.value;
                }
                this.onFilterChange();
            });
        });

        // Configura o botão Reset
        const resetBtn = this.container.querySelector('.clear-filters-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reseta os valores internos
                this.filters = {
                    platform: 'all',
                    genre: 'all',
                    availability: 'available'
                };
                this.sortBy = 'name';
                this.sortDirection = 'asc';

                // Atualiza os textos dos dropdowns
                this.updateDropdownTexts();

                // Dispara a atualização
                this.onFilterChange();
            });
        }
    }

// Novo método para atualizar os textos dos dropdowns
    updateDropdownTexts() {
        const platformOptions = [
            { value: 'all', text: 'All Platforms' },
            // ... outras opções
        ];

        const genreOptions = [
            { value: 'all', text: 'All Games' },
            // ... outras opções
        ];

        const availabilityOptions = [
            { value: 'available', text: 'Available Now' },
            // ... outras opções
        ];

        const sortOptions = [
            { value: 'name', text: 'Name' },
            // ... outras opções
        ];

        // Atualiza os textos visíveis
        const platformSelected = this.container.querySelector('.platform-dropdown .dropdown-selected');
        if (platformSelected) platformSelected.textContent = 'All Platforms';

        const genreSelected = this.container.querySelector('.genre-dropdown .dropdown-selected');
        if (genreSelected) genreSelected.textContent = 'All Games';

        const availabilitySelected = this.container.querySelector('.availability-dropdown .dropdown-selected');
        if (availabilitySelected) availabilitySelected.textContent = 'Available Now';

        const sortSelected = this.container.querySelector('.sort-dropdown .dropdown-selected');
        if (sortSelected) sortSelected.textContent = 'Name';

        const sortIcon = this.container.querySelector('.sort-icon');
        if (sortIcon) sortIcon.textContent = '↑';

        // Atualiza as seleções internas
        document.querySelectorAll('.dropdown-option.selected').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Marca as opções padrão como selecionadas
        document.querySelectorAll('.dropdown-option').forEach(opt => {
            if (opt.dataset.value === 'all' ||
                (opt.closest('.sort-dropdown') && opt.dataset.value === 'name')) {
                opt.classList.add('selected');
            }
        });
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