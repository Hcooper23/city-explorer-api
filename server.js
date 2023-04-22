'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const getWeather = require('./weather.js');
const { getMovies } = require('./movies.js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/weather', weatherHandler);
function weatherHandler(req, res) {
  const {lat, lon} = req.query;
  getWeather (lat, lon)
    .then (summary => res.send(summary))
    .catch ((err)=> {
      console.error (err);
      res.status (200).send(err.message);
    });
}

app.get('/movies', getMovies);

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

app.get('*', (req, res) => {
  res.status(404).send('This page is not available');
});

app.use((error, req, res) => {
  console.log(error.message);
  res.status(500).send(error.message);
});
