import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: { type: Number, default: 1 }
            }
        ],
        default: []
    }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
