/* eslint-disable react/prop-types */
import styles from './WeatherDisplay.module.css';



const WeatherDisplay = ({ current, location }) => {




  return (
    // weatherContainer
    <div className={`${styles.weatherContainer}`}>

      {/* currentWeather */}
      <div className={styles.currentWeather}>

        <h2 className={styles.location}>
          {location.name}, {location.country}
        </h2>

        {/* weatherMain */}
        <div className={`${styles.weatherMain}`}>

          {/* temperature */}
          <div className={styles.temperature}>
            <span className={styles.tempValue}>{current.temp_c}</span>
            <span className={styles.tempUnit}>°C</span>
          </div>

          {/* weatherIcon */}
          <div className={styles.weatherIcon}>
            <img
              src={current.condition.icon}
              alt={current.condition.text}
            />
            <p className={styles.condition}>{current.condition.text}</p>
          </div>

        </div>

        {/* weatherDetails */}
        <div className={styles.weatherDetails}>

          {/* detailItem */}
          <div className={styles.detailItem}>
            <span>Humidity:</span>
            <span>{current.humidity}%</span>
          </div>

          {/* detailItem */}
          <div className={styles.detailItem}>
            <span>Wind:</span>
            <span>{current.wind_kph} km/h</span>
          </div>

          {/* detailItem */}
          <div className={styles.detailItem}>
            <span>Feels like:</span>
            <span>{current.feelslike_c}°C</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default WeatherDisplay;