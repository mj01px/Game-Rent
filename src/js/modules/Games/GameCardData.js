// src/js/modules/GameCard.js
import { games } from './../../data/games.js';

export class GameCard {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.render();
    }

    render() {
        // Limpa o container ANTES de renderizar
        this.container.innerHTML = '';

        // Gera os cards uma única vez
        games.forEach(game => {
            const cardHTML = this.createCardHTML(game);
            this.container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    createCardHTML(game) {
        return `
            <li class="game-card" data-id="${game.id}">
                <img src="./assets/images/games/${game.image}" 
                     alt="${game.name}" 
                     loading="lazy">
                <h3>${game.name}</h3>
                <p>R$ ${game.price.toFixed(2)}</p>
                <button data-action="rent">Alugar</button>
            </li>
        `;
    }
}