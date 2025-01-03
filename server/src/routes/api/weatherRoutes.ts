import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST /api/weather - Fetch weather data for a city
router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    console.log(`Fetching weather data for city: ${cityName}`);
    const coordinates = await WeatherService.fetchCoordinates(cityName);
    const forecast = await WeatherService.fetchForecast(coordinates);

    console.log('Final Forecast Data:', forecast);
    return res.json(forecast);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
