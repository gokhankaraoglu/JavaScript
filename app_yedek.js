//Storage Controller
const StorageController = (function() {
    //private
    function getProductsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    return {
        addProductToLocalStorage: function(product) {
            const products = getProductsFromLocalStorage();
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProductsFromLocalStorage,
    }
})();



//Product Controller
const ProductController = (function(StorageCtrl) {
    //private
    const Product = function(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {
            products: StorageCtrl.getProductsFromLocalStorage() || [],
            selectedProduct: null,
            totalPrice: 0
        }
        //public
    return {
        getProducts: function() {
            return data.products;

        },
        getData: function() {
            return data;
        },
        getProductById: function(id) {
            let product = null;
            data.products.forEach(function(prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },
        setCurrentProduct: function(product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function() {
            return data.selectedProduct;
        },
        addProduct: function(name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }
            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            StorageCtrl.addProductToLocalStorage(newProduct);
            return newProduct;
        },
        updatedProduct: function(name, price) {
            let product = null;

            data.products.forEach(function(prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = price;
                    product = prd
                }
            });
            return product;
        },
        deleteProduct: function(product) {
            data.products.forEach(function(prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
        },
        uptadeProduct: function(name, price) {
            let product = null;
            data.products.forEach(function(prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });
            return product;
        },
        getTotal: function() {
            let total = 0;
            data.products.forEach(function(item) {
                total += item.price;
            });
            data.totalPrice = total;
            return data.totalPrice;
        }

    }
})(StorageController);



//UI Controller

const UIController = (function() {

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        cancelButton: '.cancelBtn',
        deleteButton: '.deleteBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'

    }

    return {
        createProductList: function(products) {
            let html = "";


            products.forEach(prd => {
                html += `<tr>
                            <td>${prd.id}</td>
                            <td>${prd.name}</td>
                            <td>${prd.price}$</td>
                            <td class="text-right">  
                            <i class="far fa-edit edit-product" ></i>

                         </tr>`;

            });




            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function() {
            return Selectors;
        },
        setCurrentProduct: function(product) {
            data.selectedProduct = product;
        },

        addProduct: function(prd) {

            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = `            
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">    
                <i class="far fa-edit edit-product" ></i>        
            </td>
            </tr>              
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function(prd) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if (item.classList.contains("bg-warning")) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + " $ ";
                    updatedItem = item;

                }
            });
            return updatedItem;
        },
        clearInputs: function() {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function() {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if (item.classList.contains("bg-warning")) {
                    item.classList.remove("bg-warning");
                }
            });

        },
        hideCard: function() {
            document.querySelector(Selectors.productCard).style.display = 'none';


        },
        showTotal: function(total) {
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total * 4;

        },
        addProductToForm: function() {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        deleteProduct: function() {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if (item.classList.contains("bg-warning")) {
                    item.remove();
                }
            });
        },
        addingState: function(item) {
            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function(tr) {

            tr.classList.add("bg-warning");
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';

        }

    }

})();


//App Controller
const App = (function(ProductCtrl, UICtrl) {
    const UISelectors = UICtrl.getSelectors();


    //Load Event Listeners
    const loadEventListeners = function() {
        //add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);


        //edit product click
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);

        //edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener("click", editProductSubmit);

        //cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelUpdate);

        //delete button click
        document.querySelector(UISelectors.deleteButton).addEventListener("click", deleteProductSubmit);

    }

    const productAddSubmit = function(e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== "" && productPrice !== "") {
            //add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);
            // add item to list
            UICtrl.addProduct(newProduct);

            //get total
            const total = ProductCtrl.getTotal();

            //show total
            UICtrl.showTotal(total);

            // clear inputs
            UICtrl.clearInputs();



        }

        e.preventDefault();
    }
    const productEditClick = function(e) {
        if (e.target.classList.contains("edit-product")) {

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected
            const product = ProductCtrl.getProductById(id);

            //set current product
            ProductCtrl.setCurrentProduct(product);

            //add product to UI
            UICtrl.addProductToForm();
            UICtrl.clearWarnings();

            UICtrl.editState(e.target.parentNode.parentNode);

        }
        e.preventDefault();
    }
    const editProductSubmit = function(e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if (productName !== "" && productPrice !== "") {
            //update product
            const updatedProduct = ProductCtrl.uptadeProduct(productName, productPrice);
            //update ui
            let item = UICtrl.updateProduct(updatedProduct);
            //get total
            const total = ProductCtrl.getTotal();

            //show total
            UICtrl.showTotal(total);
            UICtrl.addingState();



        }
        e.preventDefault();
    }
    const cancelUpdate = function(e) {
        UICtrl.addingState();
        UICtrl.clearWarnings();


        e.preventDefault();
    }
    const deleteProductSubmit = function(e) {
        //get selected 
        const selectedProduct = ProductCtrl.getCurrentProduct();

        //delete product
        ProductCtrl.deleteProduct(selectedProduct);

        //delete ui
        UICtrl.deleteProduct();
        //get total
        const total = ProductCtrl.getTotal();

        //show total
        UICtrl.showTotal(total);
        UICtrl.addingState();
        if (total == 0) {
            UICtrl.hideCard();
        }

        e.preventDefault();
    }

    return {
        init: function() {

            UICtrl.addingState();
            const products = ProductCtrl.getProducts();
            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }
            // get total
            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

            loadEventListeners()
        }
    }

})(ProductController, UIController);

App.init();