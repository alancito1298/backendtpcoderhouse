import Product from '../models/product.model.js';

class ProductManager {

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {

        const filter = {};

        if (query) {
            if (query === 'available') {
                filter.status = true;
            } else if (query === 'unavailable') {
                filter.status = false;
            } else {
                filter.category = { $regex: query, $options: 'i' };
            }
        }

        const options = {
            limit: Number(limit),
            page: Number(page),
            lean: true
        };

        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        return Product.paginate(filter, options);
    }

    async getProductById(id) {
        return Product.findById(id).lean();
    }

    async addProduct(product) {
        return Product.create(product);
    }

    async updateProduct(id, updatedFields) {

        delete updatedFields._id;

        return Product.findByIdAndUpdate(id, updatedFields, {
            new: true
        });
    }

    async deleteProduct(id) {
        await Product.findByIdAndDelete(id);
    }
}

export default ProductManager;
