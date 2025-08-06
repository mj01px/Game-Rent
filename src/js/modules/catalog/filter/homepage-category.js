import { redirectToCatalog } from "../catalog.js";

export function setupCategoryFilters() {
    const categoryContainer = document.getElementById('category-container');

    if (!categoryContainer) return;

    // Usamos event delegation para melhor performance
    categoryContainer.addEventListener('click', (e) => {
        // Verifica se o clique foi em um card de categoria
        const categoryCard = e.target.closest('.category-card');
        if (!categoryCard) return;

        // Obtém o gênero do atributo data-genre
        const genre = categoryCard.dataset.genre;
        if (!genre) return;

        // Redireciona para o catálogo com o filtro aplicado
        redirectToCatalog({ genre: genre });
    });
}