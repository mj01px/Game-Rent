import {games} from "../../data/games.js";

/**
 * Class responsible for loading and rendering a carousel of featured games
 */
export class LoadGameData {
    constructor(containerSelector) {
        // Selects the container for the game section
        this.container = document.querySelector(containerSelector);
        this.currentIndex = 0;       // Current scroll index
        this.cardsPerView = 4;       // Number of cards visible at once

        if (!this.container) {
            console.error('Container not found!');
            return;
        }

        // Initial render and event setup
        this.render();
        this.setupEventListeners();
    }

    /**
     * Renders the featured games into the carousel
     */
    render() {
        const carouselContainer = this.container.querySelector('.carousel-container');
        const carousel = this.container.querySelector('.games-carousel');
        const sectionTitle = this.container.querySelector('.section-title');

        if (!carouselContainer || !carousel || !sectionTitle) {
            console.error('Required elements not found in container');
            return;
        }

        // Filter games by rating (only 4.5+)
        const featuredGames = games.filter(game => game.rating >= 4.5);

        if (featuredGames.length === 0) {
            // Hide section if no featured games are available
            sectionTitle.style.display = 'none';
            carouselContainer.style.display = 'none';

            // Show a message inside the container
            this.container.innerHTML += `
            <div class="no-games-message">
                <i class="fas fa-gamepad"></i>
                <strong>No Featured Games Available</strong>
                We couldn't find any games with a rating of 4.5 or higher.
            </div>
            `;
            return;
        }

        // Show the section and render the game cards
        sectionTitle.style.display = '';
        carouselContainer.style.display = 'flex';
        carousel.innerHTML = featuredGames.map(game => this.createCardHTML(game)).join('');

        this.updateControls(featuredGames.length);
        this.setupDescriptionButtons();
    }

    /**
     * Binds event listeners to carousel navigation buttons
     */
    setupEventListeners() {
        const prevBtn = this.container.querySelector('.carousel-control.prev');
        const nextBtn = this.container.querySelector('.carousel-control.next');

        prevBtn?.addEventListener('click', () => {
            this.currentIndex = Math.max(this.currentIndex - 1, 0);
            this.scrollCarousel();
        });

        nextBtn?.addEventListener('click', () => {
            const carousel = this.container.querySelector('.games-carousel');
            const maxIndex = Math.ceil(carousel.children.length / this.cardsPerView) - 1;
            this.currentIndex = Math.min(this.currentIndex + 1, maxIndex);
            this.scrollCarousel();
        });
    }

    /**
     * Enables or disables navigation buttons based on current index
     * @param {number} totalCards - Total number of cards in the carousel
     */
    updateControls(totalCards) {
        const prevBtn = this.container.querySelector('.carousel-control.prev');
        const nextBtn = this.container.querySelector('.carousel-control.next');

        if (prevBtn && nextBtn) {
            prevBtn.disabled = this.currentIndex <= 0;
            nextBtn.disabled = this.currentIndex >= Math.ceil(totalCards / this.cardsPerView) - 1;
        }
    }

    /**
     * Scrolls the carousel based on current index
     */
    scrollCarousel() {
        const carousel = this.container.querySelector('.games-carousel');
        const card = carousel.querySelector('.game-card');
        if (!card) return;

        const cardWidth = card.offsetWidth + 30; // Add margin/gap
        carousel.scrollTo({
            left: this.currentIndex * this.cardsPerView * cardWidth,
            behavior: 'smooth'
        });

        this.updateControls(carousel.children.length);
    }

    /**
     * Attaches click events to description buttons on each game card
     */
    setupDescriptionButtons() {
        const buttons = this.container.querySelectorAll('.show-description');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.dataset.id;
                this.showGameDescription(gameId);
            });
        });
    }

    /**
     * Displays game description (placeholder - customize as needed)
     * @param {string} gameId - ID of the game to show description for
     */
    showGameDescription(gameId) {
        console.log(`Showing description for game ${gameId}`);
        // TODO: Implement modal or tooltip behavior
    }

    /**
     * Generates the HTML structure for a single game card
     * @param {Object} game - Game data object
     * @returns {string} - HTML string of the card
     */
    createCardHTML(game) {
        const fullStars = Math.floor(game.rating);
        const halfStar = game.rating % 1 >= 0.5;

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';

        for (let i = starsHTML.match(/fa-star/g)?.length || 0; i < 5; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return `
        <div class="game-card" id="game-${game.id}">
            <div class="game-image">
                <img src="../assets/images/games/${game.image}" alt="${game.name}" loading="lazy">
                <span class="platform ${game.platform}">${game.platformName}</span>
            </div>
            <div class="game-info">
                <h3>${game.name}</h3>
                <div class="game-rating">
                    ${starsHTML}
                    <span>${game.rating.toFixed(1)}</span>
                </div>
                <div class="game-price">
                    <span class="original-price">$${game.originalPrice.toFixed(2)}</span>
                    <span class="rental-price">$${game.rentalPrice.toFixed(2)}/Week</span>
                </div>
                <button class="show-description" data-id="${game.id}">Show Description</button>
            </div>
        </div>
        `;
    }
}
