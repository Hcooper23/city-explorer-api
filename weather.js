const axios = require('axios');
require('dotenv').config();
let cache = require('./cache.js');

class Forecasts {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = forecastData.weather.description;
    this.minTemp = forecastData.min_temp;
    this.maxTemp = forecastData.max_temp;
  }
}

async function getWeather(lat, lon) {
  console.log ('this is get weather',lat, lon);
  const key = 'weather-' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;
  if (cache[key] && (Date.now() - cache[key].timestamp < 500000)) {
    console.log ('Cache Hit');
    return cache[key].data;
  } else {
    console.log ('Cache missed');
    const response = await axios.get(url);
    const data = parseWeather(response.data);
    cache[key] = {
      timestamp: Date.now(),
      data: data
    };
    return data;
  }
}

function parseWeather(weatherData) {
  try {
    const weather = weatherData.data.map(day => {
      return new Forecasts(day);
    });
    return Promise.resolve(weather);
  }
  catch (error) {
    return Promise.reject(error);
  }
}

module.exports = getWeather;
