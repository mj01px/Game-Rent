import {initializeCart, updateCartUI} from "../modules/homepage/Cart/CartUI.js";
import {openCartModal} from "../modules/homepage/Cart/Cart.js";

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
// Load all page components asynchronously
Promise.all([
    initContainer('navbar-container', 'navbar.html', '../../partials/shared/'),
    initContainer('footer-container', 'footer.html', '../../partials/shared/'),
    initContainer('cart-modal-container', 'cart-modal.html', '../../components/homepage/cart-modal/')

])
    .then(() => {
        initializeCart();
        openCartModal();
        updateCartUI();


    })
    .catch(err => {
        // Handle any errors in loading the partials
        console.error("Error loading components:", err);
    });
