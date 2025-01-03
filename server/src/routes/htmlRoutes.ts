import path from 'node:path';
import { Router } from 'express';
const router = Router();

// Serve the index.html file
router.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

export default router;