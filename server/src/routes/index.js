import { Router } from 'express';
const router = Router();
// Example route connections
import apiRoutes from './api/index.js';
router.use('/api', apiRoutes);
export default router;
