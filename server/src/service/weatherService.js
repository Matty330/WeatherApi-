import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
class WeatherService {
    constructor() {
        this.baseURL = 'https://api.openweathermap.org';
        this.apiKey = process.env.API_KEY || '';
    }
    // Fetch geographical coordinates for a city
    async fetchCoordinates(city) {
        console.log(`Fetching coordinates for city: ${city}`);
        const response = await axios.get(`${this.baseURL}/geo/1.0/direct`, {
            params: { q: city, limit: 1, appid: this.apiKey },
        });
        if (!response.data.length) {
            throw new Error(`City not found: ${city}`);
        }
        const { lat, lon } = response.data[0];
        console.log('Coordinates fetched:', { lat, lon });
        return { lat, lon };
    }
    // Fetch 5-day forecast data
    async fetchForecast(coordinates) {
        console.log('Fetching 5-day forecast...');
        const url = `${this.baseURL}/data/2.5/forecast`;
        console.log('Forecast API URL:', url);
        const response = await axios.get(url, {
            params: {
                lat: coordinates.lat,
                lon: coordinates.lon,
                units: 'imperial',
                appid: this.apiKey,
            },
        });
        console.log('Forecast API Response:', response.data);
        const forecastData = response.data.list.filter((_, index) => index % 8 === 0);
        console.log('Processed Forecast Data:', forecastData);
        return forecastData.map((item) => ({
            date: new Date(item.dt * 1000).toLocaleDateString(),
            icon: item.weather[0].icon,
            iconDescription: item.weather[0].description,
            tempF: item.main.temp,
            windSpeed: item.wind.speed,
            humidity: item.main.humidity,
        }));
    }
}
export default new WeatherService();
