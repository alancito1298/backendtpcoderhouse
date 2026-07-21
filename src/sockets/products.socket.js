import ProductManager from '../managers/ProductManager.js';

const manager = new ProductManager();

export default function productsSocket(io) {

    io.on('connection', async (socket) => {

        console.log('Cliente conectado');

        const updateProducts = async () => {

            const { docs: products } = await manager.getProducts({ limit: 100 });

            io.emit('products', products);

        };

        await updateProducts();

        socket.on('newProduct', async (product) => {

            try {
                await manager.addProduct(product);
                await updateProducts();
            } catch (error) {
                socket.emit('errorMessage', error.message);
            }

        });

        socket.on('deleteProduct', async (id) => {

            try {
                await manager.deleteProduct(id);
                await updateProducts();
            } catch (error) {
                socket.emit('errorMessage', error.message);
            }

        });

    });

}