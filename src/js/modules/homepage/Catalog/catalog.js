
export function initCatalog() {
const button = document.querySelector('.cta-btn');

button.addEventListener('click', () => {
    redirectToCatalog();
});
}

function redirectToCatalog() {
    window.location.href = '/src/html/components/catalog/catalog.html';
}