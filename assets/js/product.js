const productId = new URLSearchParams(window.location.search).get('productId');

// 同时发起两个请求，但确保都完成后再处理
Promise.all([
    fetch('/api/categories').then(res => res.json()),
    productId ? fetch(`/api/products?productId=${productId}`).then(res => res.json()) : Promise.resolve(null)
])
.then(([categories, productData]) => {
    // 渲染分类
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


    // 渲染产品
    if (productData) {
        const product = productData[0];
        const categoryIndex = categories.findIndex(cat => cat.catid === product.catid);
        // 渲染产品详情...
           const navContainer = document.getElementById('navig');
                navContainer.innerHTML = `
                    <nav class="breadcrumb">
                        <a href="../index.html">Home</a>
                        <span> &gt; </span>
                        <a href="category.html?category=${product.catid}">${product.catName}</a>
                        <span> &gt; </span>
                        <a href="product.html?productId=${product.pid}">${product.name}</a>
                    </nav>
                `;
                const productContainer = document.getElementById('product-detail');
                productContainer.innerHTML = `
            
                        <h2>${product.name}</h2>
                        <img src="../assets/${product.imagePlace}" alt="${product.name}">
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <button id="addToCart">Add to Cart</button>

                `;

                // Add to cart functionality
                const addToCartButton = document.getElementById('addToCart');
                addToCartButton.addEventListener('click', async function() {
                    addToCart(product.pid);})  
  } else {
        document.getElementById('product-detail').innerHTML = '<p>Product not found.</p>';
    }
})
.catch(error => {
    console.error('Error:', error);
    document.getElementById('product-detail').innerHTML = '<p>Error loading data.</p>';
});
