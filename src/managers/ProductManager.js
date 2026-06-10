const fs = require('fs/promises');

class ProductManager {

    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();

        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();

        const newId =
            products.length > 0
                ? products[products.length - 1].id + 1
                : 1;

        const newProduct = {
            id: newId,
            ...product
        };

        products.push(newProduct);

        await fs.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
        );

        return newProduct;
    }

    async updateProduct(id, updatedFields) {
    
            console.log("ID:", id);
            console.log("UPDATED:", updatedFields);
        
            
      
        const products = await this.getProducts();

        const index = products.findIndex(
            product => product.id === id
        );

        if (index === -1) return null;

        delete updatedFields.id;

        products[index] = {
            ...products[index],
            ...updatedFields
        };

        await fs.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
        );

        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();

        const filtered = products.filter(
            product => product.id !== id
        );

        await fs.writeFile(
            this.path,
            JSON.stringify(filtered, null, 2)
        );
    }
}

module.exports = ProductManager;