
// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutButton = document.getElementById('checkout-button');
// Toggle cart overlay visibility
cartIcon.addEventListener('mouseenter', () => {
    renderCart();
    cartOverlay.style.display = 'flex';
});


// Function to toggle cart visibility when click
function toggleCart() {
    renderCart();
    cartOverlay.style.display = (cartOverlay.style.display === 'flex') ? 'none' : 'flex';
}

// Close the cart when clicking  it
function closeCartIfClickedOutside(event) {
    if (!cartOverlay.contains(event.target) && event.target !== cartIcon) {
        cartOverlay.style.display = 'none';
    }
}

// Add product to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
       // Find the existing item in the cart
       const existingItemIndex = cart.findIndex(item => item.id === productId);
       
       if (existingItemIndex !== -1) {
           // If found, increment the quantity
           cart[existingItemIndex].quantity++;
           alert("added")
           localStorage.setItem('cart', JSON.stringify(cart)); 

       } 
       else {
        fetch(`/api/products?productId=${productId}`) // Update URL if needed
            .then(response => response.json())
            .then(product => {
                if (product && product.length > 0) {
                    product = product[0];
                    cart.push({ id: productId, name: product.name, quantity: 1, price: product.price});
                  
                   
                }
                alert("added")
                localStorage.setItem('cart', JSON.stringify(cart)); 
               
            
            })
            .catch(error => {
               alert('Error fetching product:', error);
            });
    }


     // Call renderCart after updating the cart
}
// Render cart items in the overlay
function renderCart() {
    const cart=JSON.parse(localStorage.getItem("cart"))
    cartItemsContainer.innerHTML = '';  // Clear current items
    let total=0;
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <span>${item.name} - $${item.price}</span>
            <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        total+=item.price * item.quantity
        cartItemsContainer.appendChild(cartItemDiv);
    });
    const totalNumber=document.createElement('div');
    totalNumber.innerHTML=`<span>$${(total).toFixed(2)}</span>`
    cartItemsContainer.appendChild(totalNumber);
}

// Update quantity in the cart
cartItemsContainer.addEventListener('input', (event) => {
    if (event.target.classList.contains('quantity-input')) {
        const productId = parseInt(event.target.getAttribute('data-id'));
        const quantity = parseInt(event.target.value);
        const cart=JSON.parse(localStorage.getItem('cart'))
        const cartIndex = cart.findIndex(item => item.id === productId);
        if (cartIndex!==-1) {
            cart[cartIndex].quantity = quantity;
          
            localStorage.setItem("cart",JSON.stringify(cart))
            // renderCart();
        }
        renderCart();
    }
});

// Checkout button click event
checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        alert('Proceeding to checkout...');
        // Implement checkout process here
    } else {
        alert('Your cart is empty.');
    }
});


// Event listeners
cartIcon.addEventListener('click', toggleCart);  // Toggle cart on icon click
document.addEventListener('click', closeCartIfClickedOutside);  // Close cart when clicking outside