import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// ES module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const historyFilePath = path.resolve(__dirname, '../../../searchHistory.json');

// Ensure the history file exists
if (!fs.existsSync(historyFilePath)) {
  fs.writeFileSync(historyFilePath, JSON.stringify([]));
}

// GET /api/weather/history - Return search history
router.get('/history', (_req, res) => {
  try {
    const history = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
    res.json(history);
  } catch (error) {
    console.error('Error reading search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// DELETE /api/weather/history/:id - Delete a city from search history
router.delete('/history/:id', (req, res) => {
  const { id } = req.params;

  try {
    const history = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
    const updatedHistory = history.filter((entry: any) => entry.id !== id);

    fs.writeFileSync(historyFilePath, JSON.stringify(updatedHistory, null, 2));
    res.json({ message: `City with ID ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
