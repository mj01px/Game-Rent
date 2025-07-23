import {LoadGameData} from "./modules/Games/LoadGameData.js";

export function initContainer(containerId, filePath, basePath) {
    return fetch(`${basePath}${filePath}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error loading ${filePath}`);
            return res.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        });
}

Promise.all([
    initContainer('head-container', 'head.html', 'partials/shared/'),
    initContainer('navbar-container', 'navbar.html', 'partials/shared/'),
    initContainer('banner-container', 'banner.html', 'partials/shared/'),
    initContainer('games-container', 'game-card.html', 'components/game-card/'),
    initContainer('category-container', 'game-category.html', 'components/game-category/'),
    initContainer('workflow-container', 'workflow.html', 'partials/workflow/'),
    initContainer('footer-container', 'footer.html', 'partials/shared/'),
])
    .then(() => {
        new LoadGameData('.featured'); // ou outro seletor que funcione pra ti
    })
    .catch(err => {
        console.error("Error loading navbar:", err);
    });
