// Get cart from localStorage
let cart = [];
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
}



// DOM Elements
const orderItemsContainer = document.getElementById('order-items');
const orderTotalElement = document.getElementById('order-total');
const checkoutForm = document.getElementById('checkout-form');

// Initialize the page
function initializePage() {
    updateOrderSummary();
    setupFormValidation();
}

// Update order summary
function updateOrderSummary() {
    orderItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>${item.product.name} x ${item.quantity}</span>
            <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
        total += item.product.price * item.quantity;
    });

    orderTotalElement.textContent = total.toFixed(2);
}

// Form validation
function setupFormValidation() {
    // Card number validation
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        e.target.value = value.replace(/(\d{4})/g, '$1 ').trim();
    });

    // Expiry date validation
    const expiryDateInput = document.getElementById('expiryDate');
    expiryDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // CVV validation
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        e.target.value = value;
    });

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    });
}

// Handle form submission
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simulate payment processing
    const loadingButton = e.target.querySelector('button[type="submit"]');
    loadingButton.textContent = 'Processing...';
    loadingButton.disabled = true;

    setTimeout(() => {
       
    
        // Calculate delivery date (7 days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        const formattedDate = deliveryDate.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    
        // Store delivery date in localStorage for the confirmation page
        localStorage.setItem('deliveryDate', deliveryDate.toISOString());
    
        // Show success message with delivery date and redirect
        alert(`Payment successful! Thank you for your purchase. Your order will be delivered by ${formattedDate}.`);
    
        // Redirect to confirmation page
        window.location.href = 'order.html';
    }, 2000);
    
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);