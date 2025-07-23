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
    initContainer('head-container', 'head.html', 'partials/'),
    initContainer('navbar-container', 'navbar.html', 'partials/'),
    initContainer('banner-container', 'banner.html', 'partials/'),
    initContainer('games-container', 'game-card.html', 'components/game-card/'),
    initContainer('category-container', 'game-category.html', 'components/game-category/'),
    initContainer('how-it-works-container', 'how-it-works.html', 'partials/'),
    initContainer('footer-container', 'footer.html', 'partials/'),
])
    .then(() => {
    })
    .catch(err => {
        console.error("Error loading navbar:", err);
    });
