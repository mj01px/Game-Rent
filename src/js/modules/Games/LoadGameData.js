import {games} from "../../data/games.js";

/**
 * Class responsible for loading and rendering game cards
 * into a specified container element in the DOM.
 */
export class LoadGameData {
    /**
     * @param {string} containerSelector - CSS selector of the container where games will be rendered
     */
    constructor(containerSelector) {
        // Find container element by selector
        this.container = document.querySelector(containerSelector);

        // If container doesn't exist, log error and abort
        if (!this.container) {
            console.error('Container not found!');
            return;
        }

        // Trigger initial rendering of game cards
        this.render();
    }

    /**
     * Renders featured games section based on rating filter.
     * Hides the section title and shows a placeholder message when no games meet the criteria.
     * Displays all games with rating >= 4.5 when available.
     */
    render() {
        // Get DOM elements
        const grid = this.container.querySelector('.games-grid');
        const sectionTitle = this.container.querySelector('.section-title');

        // Validate required elements exist
        if (!grid || !sectionTitle) {
            console.error('Required elements not found in container');
            return;
        }

        // Filter games with minimum 4.5 rating
        const featuredGames = games.filter(game => game.rating >= 4.5);

        // Handle empty results
        if (featuredGames.length === 0) {
            // Hide section title and display empty state message
            sectionTitle.style.display = 'none';
            grid.innerHTML = `
            <div class="no-games-message">
                <i class="fas fa-gamepad"></i>
                <strong>No Featured Games Available</strong>
                We couldn't find any games with a rating of 4.5 or higher at the moment. 
                Please check back later or browse our full collection.
            </div>
        `;
            return;
        }

        // Show section title and render game cards
        sectionTitle.style.display = '';
        grid.innerHTML = featuredGames.map(game => this.createCardHTML(game)).join('');
    }

    /**
     * Generates HTML string for a single game card with rating stars and prices
     * @param {Object} game - Single game object from the catalog
     * @returns {string} - HTML markup for the game card
     */
    createCardHTML(game) {
        // Calculate number of full stars and whether to show a half star
        const fullStars = Math.floor(game.rating);
        const halfStar = game.rating % 1 >= 0.5;

        // Build star icons HTML: full stars, optional half star, and empty stars up to 5 total
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>'; // full star icon
        }
        if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>'; // half star icon

        // Count stars added so far (full + half), fill rest with empty stars
        for (let i = starsHTML.match(/fa-star/g)?.length || 0; i < 5; i++) {
            starsHTML += '<i class="far fa-star"></i>'; // empty star icon
        }

        // Return complete card markup with game info, image, rating, prices and description button
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
