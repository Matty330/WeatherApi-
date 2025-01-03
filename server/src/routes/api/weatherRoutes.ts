import { Router } from 'express';
const router = Router();

import WeatherService from '../../service/weatherService.js';

// POST /api/weather - Fetch weather data for a city
router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch coordinates
    const coordinates = await WeatherService.fetchCoordinates(cityName);

    // Fetch current weather and forecast
    const currentWeather = await WeatherService.fetchCurrentWeather(coordinates);
    const forecast = await WeatherService.fetchForecast(coordinates);

    // Return weather data
    return res.json([currentWeather, ...forecast]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET /api/weather/history - Return search history
router.get('/history', async (_, res) => {
  try {
    // TODO: Implement logic to return search history
    return res.json({ message: 'Search history will be returned here' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// DELETE /api/weather/history/:id - Delete a city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implement logic to delete a city from search history
    return res.json({ message: `City with ID ${id} will be deleted here` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;