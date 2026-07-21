import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const manager = new ProductManager();

const buildLink = (req, page) => {

    if (!page) return null;

    const params = new URLSearchParams(req.query);
    params.set('page', page);

    return `${req.baseUrl}?${params.toString()}`;
};

router.get('/', async (req, res) => {

    try {
        const { limit, page, sort, query } = req.query;

        const result = await manager.getProducts({ limit, page, sort, query });

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: buildLink(req, result.prevPage),
            nextLink: buildLink(req, result.nextPage)
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {

    const product = await manager.getProductById(req.params.pid);

    if (!product) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        });
    }

    res.json(product);
});

router.post('/', async (req, res) => {

    try {
        const product = req.body;

        const newProduct =
            await manager.addProduct(product);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.put('/:pid', async (req, res) => {

    try {
        const product = await manager.updateProduct(
            req.params.pid,
            req.body
        );

        res.json(product);
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {

    await manager.deleteProduct(
        req.params.pid
    );

    res.json({
        message: 'Producto eliminado'
    });
});

export default router;
