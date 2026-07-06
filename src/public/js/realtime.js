const socket = io();

const form = document.getElementById('productForm');

const productsDiv = document.getElementById('products');

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const product = {

        title: document.getElementById('title').value,

        price: Number(document.getElementById('price').value)

    };

    socket.emit('newProduct', product);

    form.reset();

});

socket.on('products', (products) => {

    productsDiv.innerHTML = '';

    products.forEach(product => {

        productsDiv.innerHTML += `
        <div class="card">
        
            <h2>${product.title}</h2>
        
            <p><strong>Precio:</strong> $${product.price}</p>
        
            <p><strong>ID:</strong> ${product.id}</p>
        
            <button onclick="deleteProduct(${product.id})">
                Eliminar
            </button>
        
        </div>
        `;
    });

    
});


function deleteProduct(id) {

    socket.emit('deleteProduct', id);

}