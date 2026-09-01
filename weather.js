(function () {
  'use strict';

  // 1. 📡 DOM ELEMENT SELECTORS
  const searchForm = document.querySelector('.search-container');
  const searchInput = document.getElementById('citySearch');
  const cityName = document.querySelector('.location-info h2');
  const currentDate = document.querySelector('.location-info p');
  const currentTemp = document.querySelector('.temperature');
  const detailValues = document.querySelectorAll('.weather-details .detail-value');
  const dailyGrid = document.querySelector('.daily-grid');
  const hourlyWrapper = document.querySelector('.hourly-list-wrapper');
  const daySelector = document.getElementById('daySelector');

  // Shared application memory backpack
  let globalWeatherData = null;

  // 2. 🌤️ MAP WEATHER CODES TO VISUAL IMAGES
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

  // 3. 🚀 MASTER FETCH LOCATION REVOLVER
  async function getLiveWeather(city) {
    try {
      // ✅ DEFINING GEOURL CLEANLY WITH BACKTICKS
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        alert("Location name not found! Please check your spelling.");
        return;
      }

      const firstResult = geoData.results[0];
      const { latitude, longitude, name, country } = firstResult;

      // ✅ DEFINING WEATHERURL CLEANLY WITH BACKTICKS
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();
      
      // Save data bundle safely into global cache backpack memory
      globalWeatherData = weatherData; 

      // Update Card Header UI Text Elements
      if (cityName) cityName.textContent = `${name}, ${country}`;
      if (currentTemp) currentTemp.textContent = `${Math.round(weatherData.current.temperature_2m)}°`;
      if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('en-US', { 
          weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' 
        });
      }

      // Update Core Details Grid Matrix Items (Fixed NodeList Bracket Bug)
      if (detailValues && detailValues.length >= 4) {
        const cur = weatherData.current;
        detailValues[0].textContent = `${Math.round(cur.apparent_temperature)}°`;
        detailValues[1].textContent = `${Math.round(cur.relative_humidity_2m)}%`;
        detailValues[2].textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
        detailValues[3].textContent = `${cur.precipitation} mm`;
      }

      // DYNAMIC REBUILD: 7-Day Extended Forecast Outlook Grid Lists
      if (dailyGrid) {
        dailyGrid.innerHTML = ''; 
        const dailyData = weatherData.daily;
        let dailyHTML = '';

        dailyData.time.forEach((dateString, index) => {
          dailyHTML += `
            <div class="day-card">
              <span>${formatDayName(dateString)}</span>
              <img src="${getWeatherIcon(dailyData.weather_code[index])}" alt="">
              <div class="temp-range">
                <span>${Math.round(dailyData.temperature_2m_min[index])}°</span>
                <span>${Math.round(dailyData.temperature_2m_max[index])}°</span>
              </div>
            </div>
          `;
        });
        dailyGrid.insertAdjacentHTML('beforeend', dailyHTML);
      }

      // DYNAMIC REBUILD: Hourly Forecast Timelines
      if (daySelector) daySelector.value = "0"; 
      updateHourlyUI(0);

    } catch (err) {
      console.error("API Fetch Error:", err);
    }
  }

  // 4. 🎛️ DYNAMIC TIMELINE GENERATION LOGIC ENGINE
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
          <img src="${getWeatherIcon(hourlyData.weather_code[i])}" alt="">
          <span>${formatHourString(hourlyData.time[i])}</span>
          <span>${Math.round(hourlyData.temperature_2m[i])}°</span>
        </div>
      `;
    }
    hourlyWrapper.insertAdjacentHTML('beforeend', hourlyHTML);
  }

  // 5. 👂 GLOBAL APPLICATION CONTROL ACTION LISTENERS
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

  // Initial automatic background boot default request call
  getLiveWeather('Berlin');
})();
