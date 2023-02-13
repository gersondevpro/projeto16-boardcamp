import express from 'express';
import gamesRoutes from '../routes/games-routes.js';
import clientsRoutes from '../routes/custormes-routes.js';
import rentalsRoutes from '../routes/rentals-routes.js';

const app = express();
app.use(express.json());
app.use(gamesRoutes);
app.use(clientsRoutes);
app.use(rentalsRoutes);

app.listen(5000, () => console.log(`Server running in port 5000`));