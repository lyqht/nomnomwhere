import express from 'express';
import collectionsRoute from './routes/collectionsRoute';
import restaurantsRoute from './routes/restaurantsRoute';

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use('/api/restaurants', restaurantsRoute);
app.use('/api/collections', collectionsRoute);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
