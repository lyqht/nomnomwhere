import express from 'express';
import path from 'path';
import collectionsRoute from './routes/collectionsRoute';
import restaurantsRoute from './routes/restaurantsRoute';

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use('/api/restaurants', restaurantsRoute);
app.use('/api/collections', collectionsRoute);
app.use(express.static('dist/app'));
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
