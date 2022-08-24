import { parse } from 'csv-parse';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import os from 'os';

const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

router.get('/hello', async (_req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});

router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (file) {
        const data = fs.readFileSync(file.path);

        parse(data, (err, records) => {
            if (err) {
                console.error(err);
                return res
                    .status(400)
                    .json({ success: false, message: 'An error occurred' });
            }

            return res.json({ data: records });
        });
    }

    res.status(400).json('No CSV File given');
});

export default router;
