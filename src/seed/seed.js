import 'dotenv/config';
import fs from 'fs/promises';
import { connectDB } from '../config/db.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

const seedProducts = async () => {
    await connectDB();

    const raw = await fs.readFile(
        new URL('./products.seed.json', import.meta.url),
        'utf-8'
    );
    const products = JSON.parse(raw);

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Se cargaron ${products.length} productos de ejemplo.`);

    await mongoose.disconnect();
};

seedProducts().catch((error) => {
    console.error('Error al cargar el seed:', error);
    process.exit(1);
});
