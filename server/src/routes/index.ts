import { Router } from 'express';
import weatherRoutes from './api/weatherRoutes.js'; // Ensure this path points to weatherRoutes.js

const router = Router();

// Connect weather routes
router.use('/api/weather', weatherRoutes);

export default router;
