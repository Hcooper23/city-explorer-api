const axios = require('axios');
let cache = require('./cache.js');

const getMovies = async (req, res, next) => {
  try {
    const city = req.query.city;
    const key = 'movie-' + city;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;

    if (cache[key] && (Date.now() - cache[key].timestamp < 500000)) {
      console.log('Cache Hit');
      res.status(200).send(cache[key].data);
    } else {
      console.log('Cache Missed');
      const response = await axios.get(url);
      const movies = response.data.results.map(movie => new Movie(movie));
      cache[key] = {
        timestamp: Date.now(),
        data: movies
      };
      res.status(200).send(movies);
    }
  } catch (error) {
    next(error);
  }
};

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.poster = movieObj.poster_path ? `https://image.tmdb.org/t/p/w500${movieObj.poster_path}` : 'https://via.placeholder.com/150';
    this.releaseDate = movieObj.release_date;
    this.overview = movieObj.overview;
    this.voteAverage = movieObj.vote_average;
    this.voteCount = movieObj.vote_count;
    this.id = movieObj.id;
  }
}

module.exports = {
  getMovies
};
