import {addToCart} from "./AddToCart.js";

export function openDescriptionModal(games) {
    const modal = document.getElementById('game-description-modal');
    if (!modal) return;

    let currentGame = null; // Armazena o jogo atual

    // Event delegation para abrir o modal
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('show-description')) {
            event.preventDefault();
            const gameId = parseInt(event.target.getAttribute('data-id'));
            currentGame = games.find(g => g.id === gameId);

            if (currentGame) {
                updateModalContent(currentGame);
                showModal();
            }
        }
    });

    // Configura o botão de adicionar ao carrinho
    document.getElementById('modal-cart-btn').addEventListener('click', () => {
        if (currentGame) {
            addToCart(currentGame);
        }
        hideModal();
    });

    // Fechar modal
    const closeModal = document.getElementById('close-game-modal');
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    function updateModalContent(game) {
        document.getElementById('modalGameTitle').textContent = game.name;
        document.getElementById('modalGameDescription').textContent = game.description;
        document.getElementById('modalGameImage').src = `../assets/images/games/${game.image}`;
        document.getElementById('modalPlatform').textContent = game.platformName;
        document.getElementById('modalPlatform').className = `platform ${game.platform}`;
        document.getElementById('modalOriginalPrice').textContent = `$${game.originalPrice.toFixed(2)}`;
        document.getElementById('modalRentalPrice').textContent = `$${game.rentalPrice.toFixed(2)}/Week`;

        const rating = game.rating;
        const fullStars = '★'.repeat(Math.floor(rating));
        const emptyStars = '☆'.repeat(5 - Math.floor(rating));
        document.getElementById('modalGameRating').innerHTML = `${fullStars}${emptyStars} <span>${rating.toFixed(1)}</span>`;
    }

    function showModal() {
        modal.classList.add('active'); // ativa o CSS
        document.body.style.overflow = 'hidden';
    }


    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    document.getElementById('modal-cart-btn').addEventListener('click', () => {
        hideModal(); // fecha o modal atual
    });
}