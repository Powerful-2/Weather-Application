(function () {
  'use strict';

  const searchForm = document.querySelector('.search-container');
  const searchInput = document.getElementById('citySearch');
  const cityName = document.querySelector('.location-info h2');
  const currentDate = document.querySelector('.location-info p');
  const currentTemp = document.querySelector('.temperature');
  const detailValues = document.querySelectorAll('.weather-details .detail-value');
  const dailyGrid = document.querySelector('.daily-grid');
  const hourlyWrapper = document.querySelector('.hourly-list-wrapper');
  const daySelector = document.getElementById('daySelector');

  let globalWeatherData = null;

  function getWeatherIcon(code) {
    if (code === 0) return './assets/images/icon-sunny.webp';
    if (code >= 1 && code <= 3) return './assets/images/icon-partly-cloudy.webp';
    if (code >= 45 && code <= 48) return './assets/images/icon-fog.webp';
    if (code >= 51 && code <= 67) return './assets/images/icon-rain.webp';
    if (code >= 71 && code <= 77) return './assets/images/icon-snow.webp';
    return './assets/images/icon-overcast.webp';
  }

  function formatDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  function formatHourString(timeString) {
    const date = new Date(timeString);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    return `${hours} ${ampm}`;
  }

  async function getLiveWeather(city) {
    try {
      // 🚀 FIXED: Clean Geocoding Address Structure Route
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        alert("Location not found! Try another city name.");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 🚀 FIXED: Clean Forecast Data Synchronization Track
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();
      
      globalWeatherData = weatherData; 

      if (cityName) cityName.textContent = `${name}, ${country}`;
      if (currentTemp) currentTemp.textContent = `${Math.round(weatherData.current.temperature_2m)}°`;
      if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('en-US', { 
          weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' 
        });
      }

      if (detailValues && detailValues.length >= 4) {
        const cur = weatherData.current;
        detailValues[0].textContent = `${Math.round(cur.apparent_temperature)}°`; // Card 1
        detailValues[1].textContent = `${Math.round(cur.relative_humidity_2m)}%`;  // Card 2
        detailValues[2].textContent = `${Math.round(cur.wind_speed_10m)} km/h`;   // Card 3
        detailValues[3].textContent = `${cur.precipitation} mm`;                // Card 4
      }

      if (dailyGrid) {
        dailyGrid.innerHTML = ''; 
        const dailyData = weatherData.daily;
        let dailyHTML = '';

        dailyData.time.forEach((dateString, index) => {
          dailyHTML += `
            <div class="day-card">
              <span>${formatDayName(dateString)}</span>
              <img src="${getWeatherIcon(dailyData.weather_code[index])}" alt="Condition">
              <div class="temp-range">
                <span>${Math.round(dailyData.temperature_2m_min[index])}°</span>
                <span>${Math.round(dailyData.temperature_2m_max[index])}°</span>
              </div>
            </div>
          `;
        });
        dailyGrid.insertAdjacentHTML('beforeend', dailyHTML);
      }

      if (daySelector) daySelector.value = "0"; 
      updateHourlyUI(0);

    } catch (err) {
      console.error("API Error Workflow Stalled:", err);
    }
  }

  function updateHourlyUI(dayOffset) {
    if (!hourlyWrapper || !globalWeatherData) return;
    
    hourlyWrapper.innerHTML = ''; 
    const hourlyData = globalWeatherData.hourly;
    let startIdx = dayOffset * 24;
    
    if (dayOffset === 0) {
      startIdx += new Date().getHours();
    }

    let hourlyHTML = '';
    for (let i = startIdx; i < startIdx + 6; i++) {
      if (!hourlyData.time[i]) break;

      hourlyHTML += `
        <div class="hourly-card">
          <img src="${getWeatherIcon(hourlyData.weather_code[i])}" alt="Icon">
          <span>${formatHourString(hourlyData.time[i])}</span>
          <span>${Math.round(hourlyData.temperature_2m[i])}°</span>
        </div>
      `;
    }
    hourlyWrapper.insertAdjacentHTML('beforeend', hourlyHTML);
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        getLiveWeather(query);
        searchInput.value = '';
      }
    });
  }

  if (daySelector) {
    daySelector.addEventListener('change', (event) => {
      const selectedDayOffset = parseInt(event.target.value, 10);
      updateHourlyUI(selectedDayOffset);
    });
  }

  getLiveWeather('Berlin');
})();
