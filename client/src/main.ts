import './styles/jass.css';

// Select DOM elements
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const currentWeatherContainer = document.getElementById('current-weather') as HTMLDivElement;
const forecastContainer = document.getElementById('forecast-container') as HTMLDivElement;
const historyContainer = document.getElementById('history-container') as HTMLDivElement;

// Fetch weather data for a city
const fetchWeather = async (cityName: string) => {
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

    const [currentWeather, ...forecast] = weatherData;
    if (!currentWeather) {
      throw new Error('Current weather data is missing');
    }

    renderCurrentWeather(currentWeather);
    renderForecast(forecast);
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

// Fetch search history
const fetchSearchHistory = async () => {
  console.log('Fetching search history...');
  const response = await fetch('http://localhost:3001/api/weather/history');
  if (response.ok) {
    const data = await response.json();
    console.log('Fetched Search History:', data);
    return data;
  }
  console.error('Failed to fetch search history');
  return [];
};

// Render current weather
const renderCurrentWeather = (currentWeather: any) => {
  console.log('Received currentWeather:', currentWeather);
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  const html = `
    <h2>${city} (${date})</h2>
    <img src="https://openweathermap.org/img/w/${icon}.png" alt="${iconDescription}" />
    <p>Temp: ${tempF} °F</p>
    <p>Wind: ${windSpeed} MPH</p>
    <p>Humidity: ${humidity}%</p>
  `;
  currentWeatherContainer.innerHTML = html;
};

// Render 5-day forecast
const renderForecast = (forecast: any[]) => {
  forecastContainer.innerHTML = '<h3>5-Day Forecast:</h3>';
  forecast.forEach((day) => {
    const html = `
      <div>
        <h4>${day.date}</h4>
        <img src="https://openweathermap.org/img/w/${day.icon}.png" alt="${day.iconDescription}" />
        <p>Temp: ${day.tempF} °F</p>
        <p>Wind: ${day.windSpeed} MPH</p>
        <p>Humidity: ${day.humidity}%</p>
      </div>
    `;
    forecastContainer.innerHTML += html;
  });
};

// Render search history
const renderSearchHistory = (history: any[]) => {
  console.log('Rendering search history:', history);
  historyContainer.innerHTML = '';
  history.forEach((entry) => {
    const div = document.createElement('div');
    div.textContent = entry.city;
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
