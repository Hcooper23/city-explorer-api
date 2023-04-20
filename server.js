'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
let weatherData = require('./data/weather.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to my server!');
});

app.get('/weather', (req, res, next) => {
  console.log('Weather endpoint hit');
  console.log('All weather data:', weatherData);
  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    let searchQuery = req.query.searchQuery;
    console.log('lat:', lat, 'lon:', lon, 'searchQuery:', searchQuery);

    let foundWeather = weatherData.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase() ||
      Math.abs(parseFloat(city.lat) - parseFloat(lat)) < 0.01 &&
      Math.abs(parseFloat(city.lon) - parseFloat(lon)) < 0.01);

    if (!foundWeather) {
      return res.status(404).send('No weather found');
    }
    let forecasts = foundWeather.data.map(weatherData => new Forecast(weatherData));
    res.status(200).send(forecasts);
  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = forecastData.weather.description;
  }
}

app.get('*', (req, res) => {
  res.status(404).send('This page is not available');
});

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(500).send(error.message);
});