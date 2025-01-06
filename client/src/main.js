import './styles/jass.css';
// * All necessary DOM elements selected
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const todayContainer = document.querySelector('#today');
const forecastContainer = document.querySelector('#forecast');
const searchHistoryContainer = document.getElementById('history');
const heading = document.getElementById('search-title');
const weatherIcon = document.getElementById('weather-img');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
/*

API Calls

*/
const fetchWeather = async (cityName) => {
    console.log('Fetching weather for:', cityName);
    try {
        const response = await fetch('http://localhost:3001/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cityName }),
        });
        console.log('Weather API response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();
        console.log('Fetched Weather Data:', weatherData);
        renderCurrentWeather(weatherData[0]);
        renderForecast(weatherData.slice(1));
    }
    catch (error) {
        console.error('Error fetching weather:', error);
        displayError('Failed to fetch weather data. Please try again.');
    }
};
const fetchSearchHistory = async () => {
    console.log('Fetching search history...');
    try {
        const response = await fetch('http://localhost:3001/api/weather/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Search history API response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to fetch search history');
        }
        const data = await response.json();
        console.log('Fetched Search History:', data);
        return data;
    }
    catch (error) {
        console.error('Error fetching search history:', error);
        displayError('Failed to fetch search history.');
        return [];
    }
};
const deleteCityFromHistory = async (id) => {
    console.log('Deleting city with ID:', id);
    try {
        const response = await fetch(`http://localhost:3001/api/weather/history/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Delete response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to delete city from history');
        }
    }
    catch (error) {
        console.error('Error deleting city from history:', error);
        displayError('Failed to delete city from history.');
    }
};
/*

Render Functions

*/
const renderCurrentWeather = (currentWeather) => {
    const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;
    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    if (todayContainer) {
        todayContainer.innerHTML = '';
        todayContainer.append(heading, tempEl, windEl, humidityEl);
    }
};
const renderForecast = (forecast) => {
    const headingCol = document.createElement('div');
    const heading = document.createElement('h4');
    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);
    if (forecastContainer) {
        forecastContainer.innerHTML = '';
        forecastContainer.append(headingCol);
    }
    for (let i = 0; i < forecast.length; i++) {
        renderForecastCard(forecast[i]);
    }
};
const renderForecastCard = (forecast) => {
    const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;
    const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();
    cardTitle.textContent = date;
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    if (forecastContainer) {
        forecastContainer.append(col);
    }
};
const renderSearchHistory = async (searchHistory) => {
    const historyList = await searchHistory.json();
    if (searchHistoryContainer) {
        searchHistoryContainer.innerHTML = '';
        if (!historyList.length) {
            searchHistoryContainer.innerHTML =
                '<p class="text-center">No Previous Search History</p>';
        }
        for (let i = historyList.length - 1; i >= 0; i--) {
            const historyItem = buildHistoryListItem(historyList[i]);
            searchHistoryContainer.append(historyItem);
        }
    }
};
/*

Helper Functions

*/
const displayError = (message) => {
    const errorEl = document.createElement('div');
    errorEl.textContent = message;
    errorEl.classList.add('error-message');
    document.body.appendChild(errorEl);
    setTimeout(() => errorEl.remove(), 3000);
};
// Remaining helper functions like createForecastCard, createHistoryButton, etc.
// No changes made to these.
const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    if (!searchInput.value) {
        displayError('City cannot be blank');
        return;
    }
    const search = searchInput.value.trim();
    fetchWeather(search).then(() => {
        getAndRenderHistory();
    });
    searchInput.value = '';
};
/*

Initial Render

*/
const getAndRenderHistory = () => fetchSearchHistory().then(renderSearchHistory);
searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);
getAndRenderHistory();
