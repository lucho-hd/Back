import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';

dotenv.config();

import GamesApiRouter from './api/routes/games.api.routes.js';
import SubscriptionsApiRouter from './api/routes/subscriptions.api.routes.js';
import GenresApiRouter from './api/routes/genres.api.routes.js';
import PlataformsApiRouter from './api/routes/plataforms.api.routes.js';
import AdminApiRouter from './api/routes/admin.api.routes.js';
import UserApiRouter from './api/routes/users.api.routes.js';
import OrderApiRouter from './api/routes/orders.api.routes.js';

const app = express();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/', GamesApiRouter)
app.use('/', SubscriptionsApiRouter)
app.use('/', GenresApiRouter)
app.use('/', PlataformsApiRouter)
app.use('/', AdminApiRouter)
app.use('/', UserApiRouter)
app.use('/', OrderApiRouter)


app.listen(3000, () => {
    console.log('Servidor en ejecución en http://localhost:3000/api/games');	
});

