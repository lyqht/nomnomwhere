import express from 'express';
import router from './lib/router';
import path from 'path';

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use('/api', router);
app.use(express.static('dist/app'));
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
