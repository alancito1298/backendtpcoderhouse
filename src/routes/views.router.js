import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

let demoCartId = null;

const getDemoCartId = async () => {

    if (demoCartId) return demoCartId;

    const [existingCart] = await cartManager.getCarts();

    const cart = existingCart ?? await cartManager.createCart();

    demoCartId = cart._id.toString();

    return demoCartId;
};

router.use(async (req, res, next) => {

    const cartId = await getDemoCartId();
    const cart = await cartManager.getCartById(cartId);

    res.locals.navCartId = cartId;
    res.locals.navCartCount = cart.products.reduce(
        (total, item) => total + item.quantity,
        0
    );

    next();
});

router.get(['/', '/home'], async (req, res) => {

    const { docs: products } = await productManager.getProducts({ limit: 6 });
    const cartId = await getDemoCartId();

    res.render('home', {
        products,
        cartId
    });

});

router.get('/realtimeproducts', async (req, res) => {

    const { docs: products } = await productManager.getProducts({ limit: 100 });

    res.render('realTimeProducts', {
        products
    });

});

router.get('/products', async (req, res) => {

    const { limit, page, sort, query } = req.query;

    const result = await productManager.getProducts({ limit, page, sort, query });
    const cartId = await getDemoCartId();

    res.render('index', {
        products: result.docs,
        cartId,
        limit: result.limit,
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        sort,
        query
    });

});

router.get('/products/:pid', async (req, res) => {

    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
        return res.status(404).render('product-detail', { notFound: true });
    }

    const cartId = await getDemoCartId();

    res.render('product-detail', {
        product,
        cartId
    });

});

router.get('/carts/:cid', async (req, res) => {

    const cart = await cartManager.getCartById(req.params.cid, { populate: true });

    if (!cart) {
        return res.status(404).render('cart', { notFound: true });
    }

    res.render('cart', {
        cartId: cart._id.toString(),
        products: cart.products
    });

});

export default router;
