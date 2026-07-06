import ProductManager from '../managers/ProductManager.js';

const manager = new ProductManager('./src/data/products.json');

export default function productsSocket(io) {

    io.on('connection', async (socket) => {

        console.log('Cliente conectado');

        const updateProducts = async () => {

            const products = await manager.getProducts();

            io.emit('products', products);

        };

        await updateProducts();

        socket.on('newProduct', async (product) => {

            await manager.addProduct(product);

            await updateProducts();

        });

        socket.on('deleteProduct', async (id) => {

            await manager.deleteProduct(id);

            await updateProducts();

        });

    });

}