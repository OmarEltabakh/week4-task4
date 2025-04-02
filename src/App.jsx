import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Forecast from './Components/Forecast/Forecast';
import SearchBar from './Components/SearchBar/SearchBar';
import WeatherDisplay from './Components/WeatherDisplay/WeatherDisplay';

function App() {
  // State management ===================================================>
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('Cairo');
  // eslint-disable-next-line no-unused-vars
  const [coords, setCoords] = useState({ lat: 30.0444, lon: 31.2357 }); // Default to Cairo coordinates

  // Fetch weather data =================================================>
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First get coordinates from location name
        const geocodeResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1`
        );
        
        if (!geocodeResponse.ok) {
          throw new Error('City not found');
        }
        
        const geocodeData = await geocodeResponse.json();
        if (!geocodeData.results || geocodeData.results.length === 0) {
          throw new Error('Location not found');
        }
        
        const { latitude, longitude } = geocodeData.results[0];
        setCoords({ lat: latitude, lon: longitude });
        
        // Fetch current weather (using Open-Meteo)
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code&hourly=weather_code`
        );
        
        if (!weatherResponse.ok) {
          throw new Error('Weather data unavailable');
        }
        
        const weather = await weatherResponse.json();
        setWeatherData({
          current: {
            temp_c: weather.current.temperature_2m,
            condition: {
              text: getWeatherCondition(weather.current.weather_code),
              icon: getWeatherIcon(weather.current.weather_code),
            },
            humidity: weather.current.relative_humidity_2m,
            wind_kph: weather.current.wind_speed_10m,
            wind_dir: getWindDirection(weather.current.wind_direction_10m),
            feelslike_c: weather.current.apparent_temperature,
          },
          location: {
            name: location,
            country: geocodeData.results[0].country,
          }
        });
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
        );
        
        if (!forecastResponse.ok) {
          throw new Error('Forecast data unavailable');
        }
        
        const forecast = await forecastResponse.json();
        setForecastData(processForecastData(forecast));
        
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  // Helper functions ===================================================>

  // Convert weather code to text description
  const getWeatherCondition = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      56: 'Freezing drizzle',
      61: 'Light rain',
      66: 'Freezing rain',
      80: 'Rain showers',
      85: 'Snow showers',
      95: 'Thunderstorm',
    };
    return weatherCodes[code] || 'Unknown';
  };

  // Get weather icon URL - Using WeatherAPI as a reliable alternative
  const getWeatherIcon = (code) => {
    const iconMap = {
      0: '113',  // Clear sky
      1: '116',  // Mainly clear
      2: '116',  // Partly cloudy
      3: '119',  // Overcast
      45: '248', // Fog
      48: '248', // Fog
      51: '176', // Drizzle
      56: '179', // Freezing drizzle
      61: '176', // Rain
      66: '179', // Freezing rain
      80: '176', // Rain showers
      85: '179', // Snow showers
      95: '200', // Thunderstorm
    };
    return `https://cdn.weatherapi.com/weather/64x64/day/${iconMap[code] || '113'}.png`;
  };

  // Convert wind degrees to direction
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  // Process forecast data for display
  const processForecastData = (data) => {
    return {
      forecastday: data.daily.time.map((time, i) => ({
        date: time,
        day: {
          maxtemp_c: data.daily.temperature_2m_max[i],
          mintemp_c: data.daily.temperature_2m_min[i],
          condition: {
            text: getWeatherCondition(data.daily.weather_code[i]),
            icon: getWeatherIcon(data.daily.weather_code[i]),
          }
        }
      }))
    };
  };

  // Handle search form submission
  const handleSearch = (searchLocation) => {
    if (searchLocation.trim()) {
      setLocation(searchLocation);
    }
  };

  // Render ============================================================>
  return (
    <div className={`${styles.app} `}>
      <div className={`${styles.appContainer} specialContainer`}>
        <h1 className={styles.title}>Weather Forecast</h1>
        
        <SearchBar onSearch={handleSearch} loading={loading} />
        
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            Loading weather data...
          </div>
        )}
        
        {error && (
          <div className={styles.error}>
            <svg className={styles.errorIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z"/>
            </svg>
            Error: {error}. Please try another location.
          </div>
        )}
        
        {weatherData && (
          <WeatherDisplay 
            current={weatherData.current} 
            location={weatherData.location} 
          />
        )}
        
        {forecastData && (
          <Forecast forecastDays={forecastData.forecastday} />
        )}
      </div>
    </div>
  );
}

export default App;