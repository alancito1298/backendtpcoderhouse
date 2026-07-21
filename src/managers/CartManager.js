import Cart from '../models/cart.model.js';

class CartManager {

    async getCarts() {
        return Cart.find().lean();
    }

    async createCart() {
        return Cart.create({ products: [] });
    }

    async getCartById(id, { populate = false } = {}) {

        const query = Cart.findById(id).lean();

        if (populate) {
            query.populate('products.product');
        }

        return query.exec();
    }

    async addProductToCart(cartId, productId) {

        const cart = await Cart.findById(cartId);

        if (!cart) return null;

        const item = cart.products.find(
            p => p.product.toString() === productId
        );

        if (item) {
            item.quantity++;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await cart.save();

        return cart;
    }

    async removeProductFromCart(cartId, productId) {

        const cart = await Cart.findById(cartId);

        if (!cart) return null;

        cart.products = cart.products.filter(
            p => p.product.toString() !== productId
        );

        await cart.save();

        return cart;
    }

    async updateCartProducts(cartId, products) {

        const cart = await Cart.findById(cartId);

        if (!cart) return null;

        cart.products = products.map(({ product, quantity }) => ({
            product,
            quantity: quantity ?? 1
        }));

        await cart.save();

        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {

        const cart = await Cart.findById(cartId);

        if (!cart) return null;

        const item = cart.products.find(
            p => p.product.toString() === productId
        );

        if (!item) return null;

        item.quantity = quantity;

        await cart.save();

        return cart;
    }

    async clearCart(cartId) {

        const cart = await Cart.findById(cartId);

        if (!cart) return null;

        cart.products = [];

        await cart.save();

        return cart;
    }
}

export default CartManager;
