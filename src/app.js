import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

import productsSocket from './sockets/products.socket.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Configuración de Handlebars
const CATEGORY_ICONS = {
    perifericos: '🖱️',
    utiles: '✏️'
};

app.engine('handlebars', engine({
    helpers: {
        eq: (a, b) => a === b,
        formatPrice: (price) => new Intl.NumberFormat('es-AR').format(price),
        categoryIcon: (category) =>
            CATEGORY_ICONS[category?.toLowerCase()] ?? '📦'
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

await connectDB();

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Socket.IO
const io = new Server(httpServer);

productsSocket(io);