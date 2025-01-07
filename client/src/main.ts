import './styles/jass.css';

// Select DOM elements
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const currentWeatherContainer = document.getElementById('current-weather') as HTMLDivElement;
const forecastContainer = document.getElementById('forecast-container') as HTMLDivElement;
const historyContainer = document.getElementById('history-container') as HTMLDivElement;

// Dropdown container for search history
const dropdownHistory = document.createElement('div');
dropdownHistory.className = 'dropdown-history';
document.body.appendChild(dropdownHistory);

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
    alert('Failed to fetch weather data. Please try again.');
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

// Render search history dropdown
const renderSearchHistoryDropdown = (history: any[]) => {
  console.log('Rendering search history dropdown:', history);
  dropdownHistory.innerHTML = '';
  history.forEach((entry) => {
    const historyItem = document.createElement('div');
    historyItem.textContent = entry.city;
    historyItem.addEventListener('click', () => {
      fetchWeather(entry.city);
      dropdownHistory.classList.remove('show');
    });
    dropdownHistory.appendChild(historyItem);
  });
};

// Get and render search history
const getAndRenderHistory = async () => {
  const history = await fetchSearchHistory();
  renderSearchHistoryDropdown(history);
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

// Show/hide dropdown history on input focus
searchInput.addEventListener('focus', async () => {
  const history = await fetchSearchHistory();
  renderSearchHistoryDropdown(history);
  dropdownHistory.style.left = `${searchInput.getBoundingClientRect().left}px`;
  dropdownHistory.style.top = `${searchInput.getBoundingClientRect().bottom}px`;
  dropdownHistory.style.width = `${searchInput.offsetWidth}px`;
  dropdownHistory.classList.add('show');
});

searchInput.addEventListener('blur', () => {
  setTimeout(() => dropdownHistory.classList.remove('show'), 200);
});

// Initial render
getAndRenderHistory();
