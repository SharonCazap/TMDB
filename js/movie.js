// GET MOVIE // 
var movie = localStorage.getItem("openMoviePage"); 

const API_KEY = 'api_key=2c46288716a18fb7aadcc2a801f3fc6b'; 
const BASE_URL = 'https://api.themoviedb.org/3'; 
const API_URL_MOVIE = BASE_URL + '/movie/' + movie + '?' + API_KEY; 
const API_URL_MOVIE_CREDITS = BASE_URL + '/movie/' + movie + '/credits?' + API_KEY; 
const API_URL_MOVIE_SIMILAR = BASE_URL + '/movie/' + movie + '/similar?' + API_KEY; 
const IMG_URL = 'https://image.tmdb.org/t/p/w500/'; 


const CardMovie = dataMovie => {
  const { 
      id, 
      overview, 
      poster_path, 
      title, 
      vote_average, 
      release_date, 
      runtime
  } = dataMovie;

  console.log(dataMovie);

  return `
    <div class="movie" id="${id}">
      <figure class="image">
        <img src="${IMG_URL + poster_path}" alt="${title}">
      </figure>
      <div class="movie-info">
        <h2>${title}</h2>
        <span>Overview</span>
        <p>${overview}</p>
        <div id="movie-genres"> 
          // Logic 
        </div>
        <div class="dateTime">
          <p>${dateFormat(release_date)}</p>
          <p>• ${runtime} min</p>
        </div>
        <div class="vote-average">
          <p><span>&#11088;</span> ${vote_average}</p>
        </div>
        <div class="add-favorite">
          <span>&#128153;</span>
          <a id="addFavorite" href="#" onclick="AddFavorite(${id})">Add to favorites</a>
        </div>
      </div>
    </div>
  `
}

const CardMovieCast = dataMovieCast => {
  const {
    id,
    name, 
    character, 
    profile_path
  } = dataMovieCast;

  console.log(dataMovieCast);

  return `
    <div class="card-cast" id="${id}">
      <figure class="image">
        <img src="${IMG_URL + profile_path}" alt="${name}">
      </figure>
      <div class="cast-info">
        <h2>${name}</h2>
        <p>${character}</p>
      </div>
    </div>
  `
} 

const CardMovieSimilar = dataMovieSimilar => {
  const {
    id,
    poster_path, 
    title, 
    vote_average, 
    release_date, 
  } = dataMovieSimilar;

  console.log(dataMovieSimilar);

  return `
    <div class="card-movie" id="${id}" onclick='openMovie(${id})'>
      <figure class="image">
        <img src="${IMG_URL + poster_path}" alt="${title}">
      </figure>
      <div class="movie-info">
        <h2>${title}</h2>
        <p><span>&#11088;</span> ${vote_average}</p>
        <p>${dateFormat(release_date)}</p> 
      </div>
    </div>
  `
}

const dateFormat = (date) => {
  var dateFormat = new Date(date);
  console.log("date: " + dateFormat);
  const days = dateFormat.getDay();
  const day = (days <= 9) ? ("0" + days) : day;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateFormat.getMonth()];
  const year = dateFormat.getFullYear(); 

  const datePrint = month + " " + day + ", " + year;
  
  return datePrint;
}

const Genres = (arr) => {
  const movieGenres = document.getElementById("movie-genres"); 
  movieGenres.innerHTML = null;
  for(var i = 0; i < arr.length; i++) {
    console.log(arr[i].name);
    movieGenres.innerHTML += "<p>" + arr[i].name + "</p>";
  }
}

const AddFavorite = (id) => {
  console.log("add favorite");

  var favoritesMovies = JSON.parse(localStorage.getItem("allFavoritesMovies"));
  console.log(favoritesMovies);

  if(favoritesMovies == null) favoritesMovies = [];
  var movie = id;
  localStorage.setItem("movie", JSON.stringify(movie));
  // Save allEntries back to local storage
  favoritesMovies.push(movie);
  localStorage.setItem("allFavoritesMovies", JSON.stringify(favoritesMovies));

  document.getElementById("addFavorite").classList.add("added-favorites");
  document.getElementById("addFavorite").innerHTML = '';
}

async function getMovie(url) {
  const response = await fetch(url);
  const movie = await response.json();
  console.log(movie);
  return movie;
}

async function getMovieCast(url) {
  const response = await fetch(url);
  const cast = await response.json();
  console.log(cast);
  return cast.cast;
}

async function getSimilarMovies(url) {
  const response = await fetch(url);
  const movies = await response.json();
  console.log(movies);
  return movies.results;
}

const movieData = async () => {
  const movie = await getMovie(API_URL_MOVIE); 
  console.log(movie);

  const movieInfo = document.getElementById("movieInfo"); 
  movieInfo.innerHTML = null; 
  movieInfo.innerHTML += CardMovie(movie); 
  Genres(movie.genres);
}

const movieCast = async () => {
  const movieCast = await getMovieCast(API_URL_MOVIE_CREDITS);
  console.log(movieCast); 

  const movieInfoCast = document.getElementById("castMovieData");
  movieInfoCast.innerHTML = null;
  movieCast.forEach(dataMovieCast => {
    movieInfoCast.innerHTML += CardMovieCast(dataMovieCast); 
  }); 
} 

const movieDataSimilar = async () => {
  const moviesSimilar = await getSimilarMovies(API_URL_MOVIE_SIMILAR);
  console.log(movie); 

  const moviesInfo = document.getElementById("similarMoviesData");
  moviesInfo.innerHTML = null;
  moviesSimilar.forEach(dataMovies => {
    moviesInfo.innerHTML += CardMovieSimilar(dataMovies); 
  }); 
}

const openMovie = (id) => {
  console.log("Open page " + id); 
  localStorage.setItem("openMoviePage", id); 
  console.log(localStorage); 
  window.location = "movie.html";
}

movieData(); 
movieCast(); 
movieDataSimilar(); 