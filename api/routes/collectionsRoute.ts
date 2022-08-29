import express from 'express';
import CollectionService from '../services/CollectionService';

const router = express.Router();

router.get('/', async (_req, res) => {
    const data = await CollectionService.getCollections();
    res.status(200).json({ data });
});

router.post('/', async (req, res) => {
    const data = await CollectionService.addCollection(req.body);
    res.status(200).json({ data });
});

router.patch('/', async (req, res) => {
    const data = await CollectionService.addRestaurantToCollection(req.body);
    res.status(200).json({ data });
});

export default router;
