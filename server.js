'use strict';

console.log('My first server');


const express = require('express');
require('dotenv').config();
let weatherData = require('./data/weather.json');

// const cors = require('cors');




const app = express();
// app.use(cors());



const PORT = process.env.PORT || 3001;


app.get('/', (request, response) => {
  response.send('Hello');
});

app.get('/weather', (request, response) => {
  let city_name = request.query.city_name;
  let dataToSend = weatherData.find(city => city.city_name.toLowerCase() === city_name.toLowerCase());

  let cityArr = dataToSend.data.map(cityData => new WeatherForecast(cityData));
  response.send(cityArr);
});


app.get('*', (request, response) => {
  response.send('some message');
});




class WeatherForecast {
  constructor(cityData) {
    this.date = cityData.valid_date;
    this.description = cityData.weather.description;
  }
}


// LISTEN
// start the server

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
