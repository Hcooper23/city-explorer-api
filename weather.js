const axios = require('axios');
require('dotenv').config();

class Forecast {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = forecastData.weather.description;
    this.minTemp = forecastData.min_temp;
    this.maxTemp = forecastData.max_temp;
  }
}

async function getWeather(req, res, next) {
  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;
    console.log(url);
    let weatherResponse = await axios.get(url);
    let forecasts = weatherResponse.data.data.map(weatherData => new Forecast(weatherData));
    let formattedForecasts = forecasts.map(forecast => {
      return {
        date: forecast.date,
        description: forecast.description,
        temperatures: {
          min: forecast.minTemp,
          max: forecast.maxTemp
        }
      };
    });
    res.status(200).send(formattedForecasts);
  } catch (error) {
    next(error);
  }
}

module.exports = getWeather;
