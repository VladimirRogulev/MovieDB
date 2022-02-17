const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=ebea8cfca72fdff8d2624ad7bbf78e4c&language=en-US&page=';
const list = document.querySelector('.list');
const single = document.querySelector('.single');
const article = document.querySelector('.main');
const logo = document.querySelector('.logo');
const favoritePage = document.querySelector('.favorite-page');
const prevPageButton = document.querySelector('.prev-page');
const nextPageButton = document.querySelector('.next-page');
const firstPageButton = document.querySelector('.first-page');
const lastPageButton = document.querySelector('.last-page');
const addFavoriteButton = document.querySelector('.add-favorite-button');
const unfavoriteButton = document.querySelector('.unfavorite-button');
const getFavorite = document.querySelector('.my-favorite');
const favoriteList = document.querySelector('.favorite-list');
const next = document.querySelector('.next');
const pages = document.querySelector('.pages');
let id;
let movie;
let movies = [];
let page = 1;
let totalPages = 0;
let favorite = [];

const checkPage = () => {
    if (page === 1){
        prevPageButton.disabled = true;
        firstPageButton.disabled = true;
        nextPageButton.disabled = false;
        lastPageButton.disabled = false;
    } else if (page === totalPages) {
        prevPageButton.disabled = false;
        firstPageButton.disabled = false;
        nextPageButton.disabled = true;
        lastPageButton.disabled = true;
    } else {
        prevPageButton.disabled = false;
        firstPageButton.disabled = false;
        nextPageButton.disabled = false;
        lastPageButton.disabled = false;
    }
};

const getData = async (pageNumber) => {
     await fetch(url + pageNumber)
        .then(response => response.json())
        .then(movieList  => displayMovies(movieList));
        page = pageNumber;
        pagination(page);
};

getData(page);

const displayMovies = (movieList) => {
    totalPages = movieList.total_pages;
    list.innerHTML = '';
    movies = movieList.results;
    movies.forEach((item, id) => {
        let img = document.createElement('img');
        if (item.poster_path === null) {
            img.src = 'img/photo.jpg';
        } else {
            img.src = `http://image.tmdb.org/t/p/w342${item.poster_path}`;
        }
        img.id = id;
        img.addEventListener('click', getMovie);
        list.append(img);
    });
    checkPage();
};

const displayFavorites = () => {
    if (favorite.length === 0) {
        favoriteList.innerHTML = `<h1 class='message'>You don't have any favorite films yet!</h1>`;
    } else {
        favoriteList.innerHTML = favorite.reduce( (acc, {poster_path, title, overview}, i ) => acc + `
        <div class='favorite-item' id='${i}'>
            <img class='favorite-poster' onclick='getFavoriteMovie()' id='${i}' src='http://image.tmdb.org/t/p/w342${poster_path}'>
            <div class='favorite-info'>
                <div class='header-favorite-info'>
                    <h1>${title}</h1>
                        <button class='unfavorite' id='${i}' onclick='removeFavorite()'>Unfavorite</button>
                </div>
                <div class='overview-favorite'>
                    ${overview}
                </div>
            </div>
        </div>
    `
    ,'')
    }
};

const removeFavorite = () => {
    const id = event.target.getAttribute('id');
    favorite.splice(id, 1);
    displayFavorites();
};

const checkFavorite = (id) => {
    let check = favorite.find(item => item.id == id);
    return check;
};

const getInfoMovie = (movie) => {
    let releaseDate = new Date(Date.parse(movie.release_date));
    let dateString = (releaseDate.toLocaleString('en-US', { month: 'long' })) + ' ' + releaseDate.getDate()  + ', ' + releaseDate.getFullYear();
    document.querySelector('.modal-poster').src = (movie.poster_path === null) ? 'img/photo.jpg' : `http://image.tmdb.org/t/p/w342${movie.poster_path}`;
    document.querySelector('.title-movie').innerHTML = movie.title + '(' + releaseDate.getFullYear() + ')';
    document.querySelector('.score').innerHTML = 'Score: ' + movie.vote_average;
    document.querySelector('.rating').innerHTML = 'Rating: ' + (movie.adult ? 'R' : 'G');
    document.querySelector('.release-date').innerHTML = 'Release Date: ' + dateString;
    document.querySelector('.overview').innerHTML = movie.overview;
    single.style.display = 'flex';
    article.style.display = 'none';
    favoritePage.style.display = 'none';
    if(!checkFavorite(movie.id)){
        addFavoriteButton.style.visibility = 'visible';
        unfavoriteButton.style.visibility = 'hidden';
    }
    if(page == totalPages && movies.length - 1 == id){
        next.style.visibility = 'hidden';
    } else {
        next.style.visibility = 'visible';
    }

    single.style.background = `url(http://image.tmdb.org/t/p/original${movie.backdrop_path}) no-repeat`;
    single.style.backgroundSize = 'cover';
    // single.style.filter = 'blur(5px)';
}

const getFavoriteMovie = () => {
    id = event.target.id;
    movie = favorite[id];
    getInfoMovie(movie);
};

const getMovie = (event) => {
    console.log(movies[event.target.id]);
    id = event.target.id;
    movie = movies[id];
    getInfoMovie(movie);
};

const nextMovie = async () => {
    id++;
    if(id > 19){
        page++;
        await getData(page);
        id = 0;
    }  
    getInfoMovie(movies[id]);
    movie = movies[id];
};

const backToList = () => {
    single.style.display = 'none';
    article.style.display = 'block';
    favoritePage.style.display = 'none';
    addFavoriteButton.style.visibility = 'hidden';
};

prevPageButton.addEventListener('click', () => {
    page--;
    list.innerHTML = '';
    getData(page);
    checkPage();
});

nextPageButton.addEventListener('click', () => {
    page++;
    list.innerHTML = '';
    getData(page);
    checkPage();
});

firstPageButton.addEventListener('click', () => {
    page = 1;
    list.innerHTML = '';
    getData(page);
    checkPage();
});

lastPageButton.addEventListener('click', () => {
    page = totalPages;
    list.innerHTML = '';
    getData(page);
    checkPage();
});

const pagination = (page) => {
    if (page == 1){
        pages.innerHTML = `
            <button class='active-page'>${page}</button>
            <button class='page' onclick='getData(page+1)'>${page+1}</button>
            <button class='page' onclick='getData(page+2)'>${page+2}</button>
            <button class='ellipsis' disabled>...</button>`
    } else if (page == 2) {
        pages.innerHTML = `
            <button class='page' onclick='getData(page - 1)'>${page-1}</button>
            <button class='active-page' onclick='getData(page)'>${page}</button>
            <button class='page' onclick='getData(page+1)'>${page+1}</button>
            <button class='page' onclick='getData(page+2)'>${page+2}</button>
            <button class='ellipsis' disabled>...</button>`
    } else if (page == 3) {
        pages.innerHTML = `
            <button class='page' onclick='getData(page-2)'>${page-2}</button>
            <button class='page' onclick='getData(page-1)'>${page-1}</button>
            <button class='active-page' onclick='getData(page)'>${page}</button>
            <button class='page' onclick='getData(page+1)'>${page+1}</button>
            <button class='page' onclick='getData(page+2)'>${page+2}</button>
            <button class='ellipsis' disabled>...</button>`
    } else if (page > 3 && page < totalPages - 2){
        pages.innerHTML = `
            <button class='ellipsis' disabled>...</button>
            <button class='page' onclick='getData(page-2)'>${page-2}</button>
            <button class='page' onclick='getData(page-1)'>${page-1}</button>
            <button class='active-page' onclick='getData(page)'>${page}</button>
            <button class='page' onclick='getData(page+1)'>${page+1}</button>
            <button class='page' onclick='getData(page+2)'>${page+2}</button>
            <button class='ellipsis' disabled>...</button>`
    } else if (page == totalPages - 2) {
        pages.innerHTML = `
            <button class='ellipsis' disabled>...</button>
            <button class='page' onclick='getData(page-2)'>${page-2}</button>
            <button class='page' onclick='getData(page-1)'>${page-1}</button>
            <button class='active-page' onclick='getData(page)'>${page}</button>
            <button class='page' onclick='getData(page+1)'>${page+1}</button>
            <button class='page' onclick='getData(page+2)'>${page+2}</button>`
    } else if (page == totalPages - 1) {
        pages.innerHTML = `
            <button class='ellipsis' disabled>...</button>
            <button class='page' onclick='getData(page-2)'>${page-2}</button>
            <button class='page' onclick='getData(page-1)'>${page-1}</button>
            <button class='active-page' onclick='getData(page)'>${page}</button>
            <button class='page' onclick='getData(page+1)'>${page+1}</button>`
    } else if (page == totalPages) {
        pages.innerHTML = `
            <button class='ellipsis' disabled>...</button>
            <button class='page' onclick='getData(page-2)'>${page-2}</button>
            <button class='page' onclick='getData(page-1)'>${page-1}</button>
            <button class='active-page' onclick='getData(page)'>${page}</button>`
    } 
    checkPage();
};

addFavoriteButton.addEventListener('click', () => {
   
    favorite.push(movie);
    addFavoriteButton.style.visibility = 'hidden';
    unfavoriteButton.style.visibility = 'visible';
});

logo.addEventListener('click', () => {
    single.style.display = 'none';
    article.style.display = 'block';
    favoritePage.style.display = 'none';
    addFavoriteButton.style.visibility = 'hidden';
});

getFavorite.addEventListener('click', () => {
    single.style.display = 'none';
    article.style.display = 'none';
    favoritePage.style.display = 'flex';
    displayFavorites();
    addFavoriteButton.style.visibility = 'hidden';
});

unfavoriteButton.addEventListener('click', () => {
    removeMovie = favorite.findIndex(item => item.id == movie.id);
    favorite.splice(removeMovie, 1);
    addFavoriteButton.style.visibility = 'visible';
    unfavoriteButton.style.visibility = 'hidden';
});
