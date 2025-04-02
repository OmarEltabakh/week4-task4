/* eslint-disable react/prop-types */
import styles from './Forecast.module.css';

const Forecast = ({ forecastDays }) => {
  const formatDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    // forecastContainer
    <div className={`${styles.forecastContainer} `}>

      <h3 className={styles.forecastTitle}>5-Day Forecast</h3>

      {/* forecastDays */}
      <div className={styles.forecastDays}>
        {forecastDays?.map((day, index) => (

          // forecastDay
          <div key={index} className={styles.forecastDay}>
            <p className={styles.dayName}>{formatDay(day.date)}</p>
            <img
              src={day.day.condition.icon}
              alt={day.day.condition.text}
              className={styles.forecastIcon}
            />

            {/* temps */}
            <div className={styles.temps}>
              <span className={styles.maxTemp}>{day.day.maxtemp_c}°</span>
              <span className={styles.minTemp}>{day.day.mintemp_c}°</span>
            </div>

            <p className={`${styles.condition} `}>{day.day.condition.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;