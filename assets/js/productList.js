// Fetch categories from the server
fetch('/api/categories') // Ensure your server is running on this URL
    .then(response => response.json())
    .then(categories => {
        const categoryList = document.getElementById("category-list");
        categories.forEach((category) => {
            const nav = document.createElement('nav');
            const ul = document.createElement('ul');
            nav.appendChild(ul);
            const li = document.createElement('li');
            ul.appendChild(li);
            const link = document.createElement('a');
            li.appendChild(link);
            link.textContent = category.name;
            link.href = `templates/category.html?category=${category.catid}`;
            categoryList.appendChild(nav);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));

// Fetch products from the server
const productList = document.getElementById('product-list');

fetch('/api/products') // Ensure your server is running on this URL
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const productLink = document.createElement('a');
            productLink.href = `templates/product.html?productId=${product.pid}`;

            const productImage = document.createElement('img');
            productImage.src = "./assets/"+product.imagePlace; // Adjust based on your response
            productImage.alt = product.name;

            productLink.appendChild(productImage);
            productDiv.appendChild(productLink);

            const productName = document.createElement('h2');
            productName.textContent = product.name;
            productDiv.appendChild(productName);

            const productPrice = document.createElement('p');
            productPrice.textContent = `$${product.price}`;
            productDiv.appendChild(productPrice);

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener('click', async function() {
                addToCart(product.pid);
            });
            productDiv.appendChild(addToCartButton);

            productList.appendChild(productDiv);
        });
    })
    .catch(error => console.error('Error fetching products:', error));
