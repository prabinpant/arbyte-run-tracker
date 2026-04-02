import { Router } from 'express';

const router = Router();

// Activity fetching routes
router.get('/', (req, res) => res.json([]));
router.get('/:id', (req, res) => res.json({}));

export default router;
