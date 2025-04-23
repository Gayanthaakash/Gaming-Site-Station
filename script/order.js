let products = {}; // will be filled from JSON
// Cart state
let cart = [];
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
}



document.addEventListener('DOMContentLoaded', () => {
    fetch('script/product.json') // Update path accordingly
      .then(res => res.json())
      .then(data => {
        products = data;
        initializePage();
      })
      .catch(err => console.error('Failed to load products:', err));
  });




// DOM Elements
const checkoutBtn = document.getElementById('checkout-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const saveFavoritesBtn = document.getElementById('save-favorites');
const loadFavoritesBtn = document.getElementById('load-favorites');

// Initialize the page
function initializePage() {
    // Load products for each category
    Object.keys(products).forEach(category => {
        const gridElement = document.getElementById(`${category}-grid`);
        if (gridElement) {
            products[category].forEach(product => {
                gridElement.appendChild(createProductCard(product));
            });
        }
    });

   
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
    `;
    return card;
}

// Add to cart
function addToCart(productId) {
    let product;
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }

    if (!product) return;

    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Reduce quantity in cart
function reduceQuantity(productId) {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Clear entire cart
function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.product.name} x ${item.quantity}</span>
                <div class="cart-item-controls">
                    <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button onclick="reduceQuantity('${item.product.id}')" class="quantity-btn">-</button>
                    <button onclick="addToCart('${item.product.id}')" class="quantity-btn">+</button>
                    <button onclick="removeFromCart('${item.product.id}')" class="remove-btn">×</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.product.price * item.quantity;
        });

        // Add clear cart button
        const clearCartBtn = document.createElement('button');
        clearCartBtn.className = 'clear-cart-btn';
        clearCartBtn.textContent = 'Clear Cart';
        clearCartBtn.onclick = clearCart;
        cartItemsContainer.appendChild(clearCartBtn);
    }

    cartTotalElement.textContent = total.toFixed(2);
    checkoutBtn.disabled = cart.length === 0;
}

// Save favorites
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(cart));
    alert('Cart saved to favorites!');
}

// Load favorites
function loadFavorites() {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
        const favoriteItems = JSON.parse(favorites);

        // Merge favorites with current cart
        favoriteItems.forEach(favItem => {
            const existingItem = cart.find(item => item.product.id === favItem.product.id);
            if (existingItem) {
                existingItem.quantity += favItem.quantity;
            } else {
                cart.push(favItem);
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        alert('Favorites added to cart!');
}}

// Event listeners
checkoutBtn.addEventListener('click', () => {
    window.location.href = 'checkout.html';
});

saveFavoritesBtn.addEventListener('click', saveFavorites);
loadFavoritesBtn.addEventListener('click', loadFavorites);

