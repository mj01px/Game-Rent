export class PaginationManager {
    constructor({ container, itemsPerPage = 12, onPageChange }) {
        this.container = container;
        this.itemsPerPage = itemsPerPage;
        this.onPageChange = onPageChange;
        this.currentPage = 1;
        this.totalItems = 0;
        this.totalPages = 0;

        this.init();
    }

    init() {
        this.renderPagination();
        this.setupEventListeners();
    }

    renderPagination() {
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';
        paginationContainer.innerHTML = `
            <button class="prev-page" disabled>Previous</button>
            <span class="page-info">Page 1 of 1</span>
            <button class="next-page" disabled>Next</button>
        `;

        this.container.querySelector('.featured').appendChild(paginationContainer);

        this.prevBtn = paginationContainer.querySelector('.prev-page');
        this.nextBtn = paginationContainer.querySelector('.next-page');
        this.pageInfo = paginationContainer.querySelector('.page-info');
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;

        this.currentPage = page;
        this.updateControls();
        this.onPageChange(this.currentPage);
    }

    getPaginatedItems(items) {
        this.totalItems = items.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return items.slice(startIndex, endIndex);
    }

    update(totalItems, currentPage = 1) {
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = Math.min(currentPage, this.totalPages);
        this.updateControls();
    }

    reset() {
        this.currentPage = 1;
    }

    updateControls() {
        this.prevBtn.disabled = this.currentPage <= 1;
        this.nextBtn.disabled = this.currentPage >= this.totalPages;

        const startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);

        this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    }
}