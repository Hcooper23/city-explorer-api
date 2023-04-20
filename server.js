'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to my server!');
});

app.get('/movies', async (req, res, next) => {
  try {
    let city = req.query.city;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;
    console.log(url);
    let response = await axios.get(url);
    console.log(response.data);
    let movies = response.data.results.map(movie => new Movie(movie));
    res.status(200).send(movies);
  } catch (error) {
    next(error);
  }
});

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.poster = movieObj.poster_path;
    this.releaseDate = movieObj.release_date;
    this.overview = movieObj.overview;
    this.voteAverage = movieObj.vote_average;
    this.voteCount = movieObj.vote_count;
    this.id = movieObj.id;
  }
}

app.get('/photos', async (req, res, next) => {
  try {
    let cityImg = req.query.city;
    let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=${cityImg}`;
    let imgResponse = await axios.get(url);
    let dataSend = imgResponse.data.results.map(obj => new Photo(obj));
    res.status(200).send(dataSend);
  } catch (error) {
    next(error);
  }
});

class Photo {
  constructor(imgObj) {
    this.src = imgObj.urls.regular;
    this.alt = imgObj.alt_description;
    this.userName = imgObj.user.name;
  }
}

app.get('/weather', async (req, res, next) => {
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
});

class Forecast {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = forecastData.weather.description;
    this.minTemp = forecastData.min_temp;
    this.maxTemp = forecastData.max_temp;
  }
}

app.get('*', (req, res) => {
  res.status(404).send('This page is not available');
});

app.use((error, req, res,) => {
  console.log(error.message);
  res.status(500).send(error.message);
});
