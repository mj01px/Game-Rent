import {games} from "../../data/games.js";

export class LoadGameData {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('Container não encontrado!');
            return;
        }
        this.render();
    }

    render() {
        const grid = this.container.querySelector('.games-grid');
        if (!grid) {
            console.error('games-grid não encontrado dentro do container');
            return;
        }

        grid.innerHTML = games.map(game => this.createCardHTML(game)).join('');
    }

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
        <div class="game-card">
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
                <button class="add-to-cart" data-id="${game.id}">Show Description</button>
            </div>
        </div>
    `;
    }
}
