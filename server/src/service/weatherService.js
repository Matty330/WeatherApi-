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
        try {
            const response = await axios.get(`${this.baseURL}/geo/1.0/direct`, {
                params: {
                    q: city,
                    limit: 1,
                    appid: this.apiKey,
                },
            });
            if (response.data.length === 0) {
                throw new Error('City not found');
            }
            const { lat, lon } = response.data[0];
            return { lat, lon };
        }
        catch (error) {
            throw new Error(`Failed to fetch coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Fetch current weather data
    async fetchCurrentWeather(coordinates) {
        try {
            const response = await axios.get(`${this.baseURL}/data/2.5/weather`, {
                params: {
                    lat: coordinates.lat,
                    lon: coordinates.lon,
                    units: 'imperial', // Use Fahrenheit
                    appid: this.apiKey,
                },
            });
            const { name: city, dt } = response.data;
            const { icon, description: iconDescription } = response.data.weather[0];
            const { temp: tempF, humidity } = response.data.main;
            const { speed: windSpeed } = response.data.wind;
            return {
                city,
                date: new Date(dt * 1000).toLocaleDateString(),
                icon,
                iconDescription,
                tempF,
                windSpeed,
                humidity,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch current weather: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Fetch 5-day forecast data
    async fetchForecast(coordinates) {
        try {
            const response = await axios.get(`${this.baseURL}/data/2.5/forecast`, {
                params: {
                    lat: coordinates.lat,
                    lon: coordinates.lon,
                    units: 'imperial', // Use Fahrenheit
                    appid: this.apiKey,
                },
            });
            // Extract daily forecast data (one entry per day)
            const forecastData = response.data.list.filter((_, index) => index % 8 === 0);
            return forecastData.map((item) => ({
                date: new Date(item.dt * 1000).toLocaleDateString(),
                icon: item.weather[0].icon,
                iconDescription: item.weather[0].description,
                tempF: item.main.temp,
                windSpeed: item.wind.speed,
                humidity: item.main.humidity,
            }));
        }
        catch (error) {
            throw new Error(`Failed to fetch forecast: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
export default new WeatherService();
