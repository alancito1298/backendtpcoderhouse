const Router = require('express').Router;
const ProductManager = require('../managers/ProductManager');

const router = Router();

const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(
        Number(req.params.pid)
    );

    if (!product) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        });
    }

    res.json(product);
});

router.post('/', async (req, res) => {
    const product = req.body;

    const newProduct =
        await manager.addProduct(product);

    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {

    const product = await manager.updateProduct(
        Number(req.params.pid),
        req.body
    );

    res.json(product);
});

router.delete('/:pid', async (req, res) => {
    await manager.deleteProduct(
        Number(req.params.pid)
    );

    res.json({
        message: 'Producto eliminado'
    });
});

module.exports = router;