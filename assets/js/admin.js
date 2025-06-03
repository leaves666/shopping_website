// public/admin.js
async function fetchAdminData() {
    try {
        const response = await fetch("/api/admin/data");
        
        if (!response.ok) {
            if (response.status === 403) {
                alert("You are not an admin");
                window.location.href = "./login.html"; // 跳转到登录页
            }
            throw new Error("请求失败");
        }


    } catch (error) {
        console.error("Error:", error);
    }
}

// 页面加载时获取数据
fetchAdminData();

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
        colors: {
            primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
        }
        },
        fontFamily: {
        "body": ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        "sans": ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
        }
    }
    }
    
    const categoryColors = {}; // Stores category-to-color mappings
    const colorRange = ["#F98080", "#76A9FA",  "#AC94FA", "#F8B4D9","#93c5fd","#E02424"]; // Define your color options
    let colorIndex = 0; // Tracks the next color to assign
    const getCategoryColor = (category) => {
        if (!categoryColors[category]) {
            categoryColors[category] = colorRange[colorIndex % colorRange.length];
            colorIndex++; // Move to the next color
        }
        return categoryColors[category];
    };
    
  
    document.addEventListener("DOMContentLoaded", function(event) {
        document.getElementById('createProductBtn').click();
        document.getElementById('createCategoryBtn').click();
       
    }
        
    );

    document.getElementById('add-category-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        const formData = new FormData(this);
        const categoryName = formData.get('name');

        fetch(this.action, {
            method: 'POST',
            body: JSON.stringify({ name: categoryName }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            
            this.reset(); // Clear form fields
            const alertDiv = document.getElementById('alert');
            alertDiv.classList.remove('hidden');

            document.getElementById('alert-message').textContent = data.message;

        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
  // Function to preview images from file input
function previewImage(event, containerId) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById(containerId);
    // if(previewContainer){
    //     previewContainer.innerHTML = ""; // Clear previous preview

    // }
  
    const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/svg+xml"];
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes

    if (file) {
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type. Only JPG, PNG, GIF, or SVG files are allowed.");
            event.target.value = "";
            return;
        }
        if (file.size > maxFileSize) {
            alert("File size exceeds 10MB.");
            event.target.value = "";
            return;
        }


        // if(e.target.result)
        const reader = new FileReader();
        reader.onload = function(e) {
            // Constrain image within the element
            if(previewContainer){
                previewContainer.innerHTML = `<img src="${e.target.result}" alt="Image Preview" style="width: 100%; height: auto; max-height: 150px;">`;
        };

            }
            
        reader.readAsDataURL(file);
    }
}

// Add event listeners for both file inputs
document.getElementById("dropzone-file").addEventListener("change", function(event) {
    previewImage(event, "preview-container"); // Change to the correct preview container ID
});

function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(callback, file.type, 0.8); // Adjust quality if needed
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById('create-product-form').addEventListener("submit", async function (event) {
    const formData = new FormData(this);
    const selectElement = document.getElementById('category-select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const catName = selectedOption.textContent; // Get the text content   
    formData.set('catName', catName); 

    const imageInput = document.getElementById("dropzone-file");
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        resizeImage(file, 800, 600, async function(resizedBlob) {
            formData.append("image", resizedBlob, file.name); // Append resized image
            formData.delete("inputFile");
            try {
                const response = await fetch("/add-product", {
                    method: "POST",
                    body: formData
                });
        
                const result = await response.json();
                if (response.ok) {
                    window.location.reload(); 
                    const alertDiv = document.getElementById('alert');
                    alertDiv.classList.remove('hidden');    
                    document.getElementById('alert-message').textContent = response.data.message;
                } else {
                    alert("Error: " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
        event.preventDefault(); // Prevent form submission until resizing is complete
    } else {
        alert("Choose a picture. The picture field is empty");
        event.preventDefault(); // Prevent form submission
        return;
    }
});

function toggleDropdown(productId) {
    const dropdown = document.getElementById(`${productId}-dropdown`);
    dropdown.classList.toggle('hidden');
    const updateProduct=document.getElementById("updateProduct")
    const updateModal=document.createElement("div");
    updateModal.innerHTML="";
    updateProduct.innerHTML="";
    fetch(`/api/products?productId=${productId}`) // Update URL if 
 
    .then(response => response.json())
    .then(product => {
        if (product) {
            product = product[0];
            updateModal.innerHTML=`<div id="updateProductModal" tabindex="-1" aria-hidden="true" class="bg-black bg-opacity-50 hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
            <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Update Product
                    </h3>
                    <button id="closeUpdateBtn"type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form id="edit-product-form">
                    <div class="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" name="name"  
                            value="${product.name}" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ex. Apple iMac 27&ldquo;">
                        </div>
                        <div>
                                    <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                    <input type="number" step="0.01" name="price"  value=${product.price} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$29" required="">
                                </div>
                        <div>
                                         <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                            <select id="categories" value=${product.catid} name="catid" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                            </select>
                        </div>
                        <div class="sm:col-span-2">
                                            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                            <textarea name="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"> ${product.description} </textarea>                    
                                        </div>
                    <div class="kqgYncRJQ7spwKfig6It _WclR59Ji8jwfmjPtOei neyUwteEn7DOg9pBSJJE jCISvWkW5oStPH6Wrb_H">
                                            <label for="previewer" class="kqgYncRJQ7spwKfig6It BrSO24r_jx46AXZOyBJR _WclR59Ji8jwfmjPtOei neyUwteEn7DOg9pBSJJE jCISvWkW5oStPH6Wrb_H TTHKzTGysuSDVgqduagg jCHKuJ3G7rklx_LiAfbf _Qk4_E9_iLqcHsRZZ4ge bQPRusdUv2Wr50Lq2KOG T_tFENbpK8DMDNjQRyQa _aogeNsMdM_urLDNFElr avTmsFU5TwHXQh07Ji35 dark:hover:bg-bray-800 _t2wg7hRcyKsNN8CSSeU DpMPWwlSESiYA8EE1xKM _BIVSYBXQUqEf_ltPrSk M8MVO3Wk4V6jCw0WpZs5 xotVay0PVtR3gElm6ql5">
                                                <!-- Preview container: initially displays SVG and text -->
                                                <div id="Pcontainer">
                                                <img   class="preview" src="../assets/${product.imagePlace}" alt="Image Preview" style="width: 100%; height: auto; max-height: 150px;">
                                                 
                                                    <p class="rD4HtsUG_hahmbh2Kj09 MxG1ClE4KPrIvlL5_Q5x K1PPCJwslha8GUIvV_Cr eCx_6PNzncAD5yo7Qcic">
                                                        <span class="LYMps1kO2vF8HBymW3az">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p class="XklWzT8y98pp042XEQp4 K1PPCJwslha8GUIvV_Cr eCx_6PNzncAD5yo7Qcic">
                                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                                    </p>
                                                </div>
                                                <input 
                                                    id="previewer"
                                                    name="inputFile"
                                                    type="file" 
                                                    class="j2x7_17hqRVmwte_tWFa" 
                                                    accept="image/png, image/jpeg, image/gif, image/svg+xml" 
                                                   >
                                            </label>
                                        </div> 
                    <div class="flex items-center space-x-4">
                        <button type="submit" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Update product
                        </button>
                        
                    </div>
                </form>
            </div>
        </div>
     </div>`;
    
        }})
   
       updateProduct.appendChild(updateModal);
       

        
}


function editProduct(catId,pid){
    // Close modal when clicking the close button
    fetch('/api/categories')
    .then(response => response.json())
    .then(categories => {
       
       const categorySelect= document.getElementById("categories"); //\
       categorySelect.innerHTML = '';
       categories.forEach(category => {
             const option = document.createElement('option');
             option.value = category.catid;
             option.textContent = category.name;
             categorySelect.appendChild(option);
             categorySelect.value=catId;
            
           });
         
       })
    .catch(error => console.error('Error fetching categories:', error));
    const modal = document.getElementById("updateProductModal");
    document.addEventListener("click", function (event) {
        if (event.target.matches("[data-modal-open]")) {
            modal.classList.add("flex"); // Ensures it uses flexbox for centering
            modal.classList.remove("hidden");
        }
    });
    document.getElementById("previewer").addEventListener("change", function(event) {
        
        previewImage(event, "Pcontainer"); // Change to the correct preview container ID
    });
    const closeUpdateBtn = document.getElementById("closeUpdateBtn");
       
    if (modal && closeUpdateBtn) {
        // close modal when clicking the corresponding button
       
    closeUpdateBtn.addEventListener("click", function () {
        modal.classList.add("hidden");
    });

    // Close modal when clicking outside the modal content
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });
    document.getElementById('edit-product-form').addEventListener("submit", async function (event) {

        const form = event.target; 
        const formData = new FormData(form);
        const changedData = new FormData();
    
        // Track only changed fields
        for (let [key, value] of formData.entries()) {
            if (value !== form.elements[key]?.defaultValue) {
                changedData.append(key, value);
            }
        }
    
        // Get selected category name
        const selectElement = document.getElementById('categories');
        if (selectElement) {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            console.log(selectedOption)
            changedData.set('catName', selectedOption.textContent); // Add category name
        }
    
        //                                                                           duct ID
        changedData.set('pid', pid);
    
        console.log("Changed FormData:", Object.fromEntries(changedData.entries()));
        
        const imageInput = document.getElementById("previewer");
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            resizeImage(file, 800, 600, async function(resizedBlob) {
                changedData.append("image", resizedBlob, file.name); // Append resized image
                changedData.delete("inputFile");
                try {
                    const response = await fetch("/edit-product", {
                        method: "POST",
                        body: changedData
                    });
            
                    const result = await response.json();
                    if (response.ok) {
                        window.location.reload(); 
                        const alertDiv = document.getElementById('alert');
                        alertDiv.classList.remove('hidden');    
                        document.getElementById('alert-message').textContent = response.data.message;
                    } else {
                        alert("Error: " + result.message);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            });
            event.preventDefault(); // Prevent form submission until resizing is complete
        } else {
            // ...existing code...
        }
    });

  
}
    

}

function deleteProduct(productId){
    if (confirm("Are you sure you want to delete this product?")) {
        fetch(`/delete-product?productId=${productId}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show success message
            location.reload(); // Refresh the page to update the product list
        })
        .catch(error => {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        });
    }

}

// Optional: Close the dropdown if clicking outside of it
window.onclick = function(event) {
    const dropdowns = document.querySelectorAll('[id$="-dropdown"]');
    dropdowns.forEach(dropdown => {
        const button = document.getElementById(dropdown.id.replace('-dropdown', '-dropdown-button'));
        if (!button.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
};
// Fetch categories for dropdowns
fetch('/api/categories')
.then(response => response.json())
.then(categories => {
   
   const categorySelect= document.getElementById('category-select'); // Target the specific select element
   categorySelect.innerHTML = '';
   categories.forEach(category => {
         const option = document.createElement('option');
         option.value = category.catid;
         option.textContent = category.name;
         categorySelect.appendChild(option);
       });
     
   })
.catch(error => console.error('Error fetching categories:', error));
 fetch('/api/products') // Ensure your server is running on this URL
 .then(response => response.json())
 .then(products => {
     const productList = document.getElementById('product-list'); // Reference to tbody
     productList.innerHTML = '';
     products.forEach(product => {
         const row = document.createElement('tr');

         row.className = "border-b dark:border-gray-700";

         row.innerHTML = `
          <tr class="border-b dark:border-gray-700">
               <th scope="row" class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
           <div class="flex items-center space-x-3 h-20">
            <img src="../assets/${product.imagePlace}" alt="${product.name}" class="h-full w-auto object-cover">
            <span class="h-full flex items-center">${product.name}</span>
           </div>
    </th>
             <td class="px-4 py-2">
               <span class="text-xs font-medium px-2 py-0.5 rounded"
              style="background-color: ${getCategoryColor(product.catName)}; color: white;">
            ${product.catName}
        </span>
             </td>
             <td class="px-4 py-2">$${product.price}</td>
             <td class="px-4 py-2">
                 <a href="product.html?productId=${product.pid}" class="text-primary-600 dark:text-primary-500">website</a>
             </td>
             <td class="px-4 py-3">${product.imagePlace}</td>
             <td class="px-4 py-3">
               <span data-fulltext="${product.description}">
            ${product.description.length > 200 ? product.description.substring(0,200) + '...' : product.description}
             </span>
            </td>             
            <td class="px-4 py-3 flex items-center justify-end relative">
                                <button id="${product.pid}-dropdown-button" 
                                  onclick="toggleDropdown(${product.pid})"
                                 class=" inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 flex-shrink-0" type="button">
                                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </button>
                                <div id="${product.pid}-dropdown"  class="absolute right-0  hidden top-2 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" >
                                       
                                        <li>
                                        <a href="#" 
                                        data-modal-open="updateProductModal"
                                        id="${product.pid}-updateProductButton"
                                        class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                      
                                        onclick="editProduct('${product.catid}',${product.pid})">
                                        Edit
                                        </a>
                                        </li>
                                    </ul>
                                    <div class="py-1">
                                        <a 
                                        onclick="deleteProduct('${product.pid}')"
                                         href="#" class="delete-link block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                                    </div>
                                </div>
                            </td>
                             </tr>
          
         `;

        
         productList.appendChild(row);


     });




 })
 .catch(error => console.error('Error fetching products:', error));
