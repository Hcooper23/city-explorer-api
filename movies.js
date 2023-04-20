const axios = require('axios');

const getMovies = async (req, res, next) => {
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
