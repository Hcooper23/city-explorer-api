'use strict';

const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');
const { handleNotFoundError } = require('./notFoundError');
const { handleServerError } = require('./serverError');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

// app.get('/', (req, res) => {
//   res.send('Hello');
// });

app.get('/weather', (req, res) => {
  const { searchQuery } = req.query;
  const cityData = weatherData.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
  // find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
  // city => city.lat === lat && city.lon === lon && 

  // if (!cityData) {
  //   return handleNotFoundError(req, res);
  // }

  const forecastData = cityData.data.map(day => new Forecast(day));

  res.send(forecastData);
});

class Forecast {
  constructor(dayData) {
    this.date = dayData.valid_date;
    this.description = dayData.weather.description;
    this.minTemp = dayData.min_temp;
    this.maxTemp = dayData.max_temp;
    this.icon = dayData.weather.icon;
  }
}

app.use('*', (req, res) => {
  handleNotFoundError(req, res);
});

app.use(handleServerError);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
