import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon = document.getElementById('weather-img') as HTMLImageElement;
const tempEl = document.getElementById('temp') as HTMLParagraphElement;
const windEl = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl = document.getElementById('humidity') as HTMLParagraphElement;

/* API Calls */

const fetchWeather = async (cityName: string) => {
  console.log('Fetching weather for:', cityName);
  try {
    const response = await fetch('http://localhost:3001/api/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cityName }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await response.json();
    console.log('Fetched Weather Data:', weatherData);

    renderCurrentWeather(weatherData[0]);
    renderForecast(weatherData.slice(1));
  } catch (error) {
    console.error('Error fetching weather:', error);
    displayError('Failed to fetch weather data. Please try again.');
  }
};

const fetchSearchHistory = async () => {
  console.log('Fetching search history...');
  try {
    const response = await fetch('http://localhost:3001/api/weather/history', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search history');
    }

    const data = await response.json();
    console.log('Fetched Search History:', data);
    return data;
  } catch (error) {
    console.error('Error fetching search history:', error);
    displayError('Failed to fetch search history.');
    return [];
  }
};

const deleteCityFromHistory = async (id: string) => {
  console.log('Deleting city with ID:', id);
  try {
    const response = await fetch(`http://localhost:3001/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete city from history');
    }

    console.log('City deleted successfully.');
  } catch (error) {
    console.error('Error deleting city from history:', error);
    displayError('Failed to delete city from history.');
  }
};

/* Render Functions */

const renderCurrentWeather = (currentWeather: any): void => {
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  heading.textContent = `${city} (${date})`;
  weatherIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
  weatherIcon.alt = iconDescription;
  weatherIcon.classList.add('weather-img');
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any[]): void => {
  console.log('Rendering forecast:', forecast);

  if (forecastContainer) {
    forecastContainer.innerHTML = '<h4>5-Day Forecast:</h4>';
    forecast.forEach(renderForecastCard);
  }
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const card = document.createElement('div');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'mb-3');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const dateEl = document.createElement('h5');
  dateEl.textContent = date;

  const iconEl = document.createElement('img');
  iconEl.src = `https://openweathermap.org/img/w/${icon}.png`;
  iconEl.alt = iconDescription;

  const tempEl = document.createElement('p');
  tempEl.textContent = `Temp: ${tempF} °F`;

  const windEl = document.createElement('p');
  windEl.textContent = `Wind: ${windSpeed} MPH`;

  const humidityEl = document.createElement('p');
  humidityEl.textContent = `Humidity: ${humidity} %`;

  cardBody.append(dateEl, iconEl, tempEl, windEl, humidityEl);
  card.append(cardBody);
  forecastContainer?.append(card);
};

/* Helper Functions */

const displayError = (message: string) => {
  const errorEl = document.createElement('div');
  errorEl.textContent = message;
  errorEl.classList.add('error-message');
  document.body.appendChild(errorEl);

  setTimeout(() => errorEl.remove(), 3000);
};

/* Event Listeners */

const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (!city) {
    displayError('City cannot be blank');
    return;
  }
  fetchWeather(city);
  searchInput.value = '';
};

searchForm?.addEventListener('submit', handleSearchFormSubmit);

/* Initial Render */

const getAndRenderHistory = async () => {
  const history = await fetchSearchHistory();
  renderSearchHistory(history);
};

getAndRenderHistory();
