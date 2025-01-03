import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import WeatherService from './service/weatherService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the client/dist folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes
app.use(routes);

// Test WeatherService
async function testWeatherService() {
  try {
    const city = 'San Diego';

    // Fetch coordinates
    const coordinates = await WeatherService.fetchCoordinates(city);
    console.log('Coordinates:', coordinates);

    // Fetch current weather
    const currentWeather = await WeatherService.fetchCurrentWeather(coordinates);
    console.log('Current Weather:', currentWeather);

    // Fetch 5-day forecast
    const forecast = await WeatherService.fetchForecast(coordinates);
    console.log('5-Day Forecast:', forecast);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

testWeatherService();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});