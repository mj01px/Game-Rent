export function modalGameDetails(id) {
    const gameCard = document.getElementById(`game-${id}`);
    const modal = document.getElementById('game-modal');
    const closeModal = document.getElementById('close-game-modal');

    if (!gameCard || !modal || !closeModal) {
        return;
    }

    // Pega os dados do card
    const title = gameCard.querySelector('.dashboard__card-name')?.innerText || 'Game';
    const imgSrc = gameCard.querySelector('img')?.getAttribute('src') || 'img/game-placeholder.png';

    // Preenche o modal com os dados
    document.getElementById('modal-game-title').innerText = title;
    document.getElementById('modal-game-desc').innerText = `Game description to game"${title}".`;
    document.querySelector('.modal__game-img').setAttribute('src', imgSrc);

    // Abre o modal
    modal.style.display = 'flex';

    // Fecha ao clicar no X
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Fecha ao clicar fora
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}
