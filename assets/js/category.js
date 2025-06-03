// Fetch categories from the server
let categories; // Declare a variable to store categories

fetch('/api/categories') 
    .then(response => response.json())
    .then(data => {
        categories = data; // Store the fetched categories in the variable
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
            link.href = `category.html?category=${category.catid}`;
            categoryList.appendChild(nav);
        });

        // Get category ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const cId = urlParams.get('category');

        // Fetch products based on category ID
        if (cId) {
            fetch(`/api/products?category=${cId}`)
                .then(response => response.json())
                .then(products => {
                    const productContainer = document.getElementById('select-product-list');
                    const navContainer = document.getElementById('navi');
                    navContainer.innerHTML = `
                        <nav class="breadcrumb">
                            <a href="../index.html">Home</a>
                            <span> &gt; </span>
                            <a href="category.html?category=${cId}">${categories.find(cat => cat.catid == cId).name}</a>
                            <span> &gt; </span>
                        </nav>
                    `;
                    products.forEach(product => {
                        const productDiv = document.createElement('div');
                        productDiv.classList.add('product');

                        const productLink = document.createElement('a');
                        productLink.href = `product.html?productId=${product.pid}`;

                        const productImage = document.createElement('img');
                        productImage.src = "../assets/" + product.imagePlace;
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
                        addToCartButton.addEventListener('click', function() {
                            addToCart(product.pid); 
                        });
                        productDiv.appendChild(addToCartButton);
                        productContainer.appendChild(productDiv);
                    });
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    document.getElementById('select-product-list').innerHTML = '<p>No products found.</p>';
                });
        } else {
            document.getElementById('category-list').innerHTML = '<p>Category not found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });