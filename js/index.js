// JavaScript 

const API_KEY = 'api_key=2c46288716a18fb7aadcc2a801f3fc6b'; 
const BASE_URL = 'https://api.themoviedb.org/3'; 
const API_URL_POPULAR = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY; 
const API_URL_NOW = BASE_URL + '/movie/now_playing?' + API_KEY; 
const IMG_URL = 'https://image.tmdb.org/t/p/w500/'; 

const grid = document.getElementById("moviesGrid"); 

const popularMovies = document.getElementById("popular-movies");
const playingNowMovies = document.getElementById("playing-now-movies");
const favoritesMovies = document.getElementById("favorites-movies"); 

const CardMovie = dataMovies => {
  const {
    id,
    poster_path, 
    title, 
    vote_average, 
    release_date
  } = dataMovies;

  console.log(dataMovies);

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

async function getMovies(url) {
  const response = await fetch(url);
  const movies = await response.json();
  console.log(movies);
  return movies.results;
}

async function getFavoriteMovies(url) {
  const response = await fetch(url);
  const movies = await response.json();
  console.log(movies);
  return movies;
}

const moviesPopular = async () => {
  const movies = await getMovies(API_URL_POPULAR); 
  console.log(movies);

  grid.innerHTML = null; 
  movies.forEach(dataMovies => {
    grid.innerHTML += CardMovie(dataMovies); 
  }); 

  popularMovies.classList.add("selected");
}

const moviesNowPlaying = async () => {
  const movies = await getMovies(API_URL_NOW); 
  console.log(movies);

  grid.innerHTML = null; 
  movies.forEach(dataMovies => {
    grid.innerHTML += CardMovie(dataMovies); 
  }); 
}

const moviesFavorites = async () => {
  var favoritesMovies = JSON.parse(localStorage.getItem("allFavoritesMovies")); 
  console.log(favoritesMovies); 

  grid.innerHTML = null; 
  
  if(favoritesMovies == null){ 
    grid.innerHTML += "<div class='noFavorite'><h2>You don't have favorites movies</h2><h3>Select a movie and add it to Favorites!</h3></div>"
  }

  for(var i = 0; i < favoritesMovies.length; i++){
    console.log("movie " + favoritesMovies[i]); 

    const favoriteMovie = favoritesMovies[i]; 
    const API_URL_FAVORITE_MOVIE = BASE_URL + '/movie/' + favoriteMovie + '?' + API_KEY; 

    const myFavoritesMovies = await getFavoriteMovies(API_URL_FAVORITE_MOVIE); 
    console.log("my favorites movies: " + myFavoritesMovies);
    
    grid.innerHTML += CardMovie(myFavoritesMovies); 
  }
}

moviesPopular();

playingNowMovies.addEventListener('click', function handleClick() {
  console.log("playing now"); 
  moviesNowPlaying();
  playingNowMovies.classList.add("selected");
  popularMovies.classList.remove("selected");
  favoritesMovies.classList.remove("selected");
}); 

popularMovies.addEventListener('click', function handleClick() {
  console.log("popular"); 
  moviesPopular();
  playingNowMovies.classList.remove("selected");
  popularMovies.classList.add("selected");
  favoritesMovies.classList.remove("selected");
}); 

favoritesMovies.addEventListener('click', function handleClick() {
  console.log("favorites"); 
  moviesFavorites();
  favoritesMovies.classList.add("selected");
  popularMovies.classList.remove("selected");
  playingNowMovies.classList.remove("selected");
}); 

const openMovie = (id) => {
  console.log("Open page " + id); 
  localStorage.setItem("openMoviePage", id); 
  console.log(localStorage); 
  window.location = "movie.html";
}