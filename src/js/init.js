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
    initContainer('navbar-container', 'navbar.html', 'partials/')
])
    .then(() => {
        // Initialize any additional components or functionality here
        console.log("Navbar loaded successfully");
    })
    .catch(err => {
        console.error("Error loading navbar:", err);
    });
