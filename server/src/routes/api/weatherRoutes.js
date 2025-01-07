import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import WeatherService from '../../service/weatherService.js';
const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    }
    catch (error) {
        console.error('Error reading search history:', error);
        res.status(500).json({ error: 'Failed to fetch search history' });
    }
});
// DELETE /api/weather/history/:id - Delete a city from search history
router.delete('/history/:id', (req, res) => {
    const { id } = req.params;
    try {
        const history = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
        const updatedHistory = history.filter((entry) => entry.id !== id);
        fs.writeFileSync(historyFilePath, JSON.stringify(updatedHistory, null, 2));
        res.json({ message: `City with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting city from search history:', error);
        res.status(500).json({ error: 'Failed to delete city from search history' });
    }
});
// POST /api/weather - Fetch weather data for a city
router.post('/', async (req, res) => {
    const { cityName } = req.body;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const coordinates = await WeatherService.fetchCoordinates(cityName);
        const forecast = await WeatherService.fetchForecast(coordinates);
        const history = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
        const newEntry = { id: uuidv4(), city: cityName };
        history.push(newEntry);
        fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
        res.json([forecast[0], ...forecast]); // Return current and 5-day forecast
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
export default router;
