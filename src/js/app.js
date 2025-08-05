// Verifica qual página está sendo carregada
const loadPageScripts = () => {
    // Verifica se é a página de catálogo
    if (document.getElementById('catalog-container')) {
        import('./config/initCatalogPage.js')
            .catch(err => console.error('Failed to load catalog page scripts:', err));
    }
    // Verifica se é a homepage
    else if (document.getElementById('banner-container')) {
        import('./config/initHomePage.js')
            .catch(err => console.error('Failed to load homepage scripts:', err));
    }
};

// Carrega os scripts apropriados quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPageScripts);
} else {
    loadPageScripts();
}

// Exporta a função initContainer para uso global (se necessário)
export function initContainer(containerId, filePath, basePath) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found, skipping ${filePath}`);
        return Promise.resolve();
    }

    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
        });
}

window.initContainer = initContainer;