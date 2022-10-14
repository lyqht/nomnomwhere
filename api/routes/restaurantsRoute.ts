import { parse } from 'csv-parse';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import os from 'os';
import { finished } from 'stream/promises';
import RestaurantService from '../services/RestaurantService';
import { CSVRecord } from '../../types/Entities';

const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

router.get('/', async (_req, res) => {
    const data = await RestaurantService.getRestaurants();
    res.status(200).json({ data });
});

router.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json('No CSV File given');
    }

    const parser = fs.createReadStream(file.path).pipe(parse());

    const records: CSVRecord[] = [];
    parser.on('readable', function () {
        let record;
        while ((record = parser.read()) !== null) {
            records.push(record);
        }
    });
    await finished(parser);

    console.log('Finished reading CSV');
    const result = await RestaurantService.addRestaurantsFromCSVRecords(records);

    return res.json({ data: result });
});

export default router;
