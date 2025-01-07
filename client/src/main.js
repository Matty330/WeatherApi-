import './styles/jass.css';
// Select DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-container');
const historyContainer = document.getElementById('history-container');
// Fetch weather data for a city
const fetchWeather = async (cityName) => {
    console.log('Fetching weather for:', cityName);
    try {
        const response = await fetch('http://localhost:3001/api/weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cityName }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();
        console.log('Fetched Weather Data:', weatherData);
        if (weatherData.length === 0) {
            throw new Error('No weather data received');
        }
        const [currentWeather, ...forecast] = weatherData;
        renderCurrentWeather(currentWeather);
        renderForecast(forecast);
    }
    catch (error) {
        console.error('Error fetching weather:', error);
        currentWeatherContainer.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
    }
};
// Fetch search history
const fetchSearchHistory = async () => {
    console.log('Fetching search history...');
    try {
        const response = await fetch('http://localhost:3001/api/weather/history');
        if (!response.ok) {
            throw new Error('Failed to fetch search history');
        }
        const data = await response.json();
        console.log('Fetched Search History:', data);
        return data;
    }
    catch (error) {
        console.error('Error fetching search history:', error);
        return [];
    }
};
// Render current weather
const renderCurrentWeather = (currentWeather) => {
    console.log('Rendering current weather:', currentWeather);
    if (!currentWeather || !currentWeather.city) {
        console.error('Invalid current weather data:', currentWeather);
        currentWeatherContainer.innerHTML = '<p>Unable to fetch current weather data.</p>';
        return;
    }
    const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;
    const html = `
    <h2>${city} (${date})</h2>
    <img src="https://openweathermap.org/img/w/${icon}.png" alt="${iconDescription}" />
    <p>Temp: ${tempF ?? 'N/A'} °F</p>
    <p>Wind: ${windSpeed ?? 'N/A'} MPH</p>
    <p>Humidity: ${humidity ?? 'N/A'}%</p>
  `;
    currentWeatherContainer.innerHTML = html;
};
// Render 5-day forecast
const renderForecast = (forecast) => {
    forecastContainer.innerHTML = '<h3>5-Day Forecast:</h3>';
    forecast.forEach((day) => {
        const html = `
      <div class="forecast-card">
        <h4>${day.date}</h4>
        <img src="https://openweathermap.org/img/w/${day.icon}.png" alt="${day.iconDescription}" />
        <p>Temp: ${day.tempF ?? 'N/A'} °F</p>
        <p>Wind: ${day.windSpeed ?? 'N/A'} MPH</p>
        <p>Humidity: ${day.humidity ?? 'N/A'}%</p>
      </div>
    `;
        forecastContainer.innerHTML += html;
    });
};
// Render search history
const renderSearchHistory = (history) => {
    console.log('Rendering search history:', history);
    historyContainer.innerHTML = ''; // Clear the container first
    if (!history.length) {
        historyContainer.innerHTML = '<p>No search history available.</p>';
        return;
    }
    history.forEach((entry) => {
        const div = document.createElement('button');
        div.textContent = entry.city;
        div.classList.add('history-btn');
        div.addEventListener('click', () => {
            fetchWeather(entry.city);
        });
        historyContainer.appendChild(div);
    });
};
// Get and render search history
const getAndRenderHistory = async () => {
    const history = await fetchSearchHistory();
    renderSearchHistory(history);
};
// Handle form submission
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = searchInput.value.trim();
    if (!cityName) {
        alert('City name cannot be blank');
        return;
    }
    fetchWeather(cityName);
    searchInput.value = '';
    getAndRenderHistory();
});
// Initial render
getAndRenderHistory();
