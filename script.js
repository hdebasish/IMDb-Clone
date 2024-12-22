const movieSearchBar = document.querySelector("#searchbar");
const hompage = document.getElementsByClassName("homepage")[0];
const movieDetails = document.getElementsByClassName("movie-details")[0];
const favPage = document.getElementsByClassName("fav-page")[0];
const homepageTitle = document.getElementsByClassName("home-page")[0];
const favourite = document.getElementsByClassName("favourite")[0];
const favList = document.getElementsByClassName("fav-list")[0];
let searchBar = document.getElementById('searchbar');
let list = document.getElementById("search-list");
let favCard = document.getElementsByClassName("fav-card")[0];
let favouriteList = [];
let filmList;
let film;

// localStorage.clear()

// Input keystroke event listener

movieSearchBar.addEventListener("keyup", (e) => {
    let searchString = searchBar.value;
    if (searchString == "") {
        list.innerHTML = "";
    } else {
        getMovies(searchString);
    }

});

// Searching the input by making API call

async function getMovies(searchString) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchString.trim()}&apikey=b6bf5319`);
        var data = await response.json();
        renderMovies(data.Search);
    } catch (error) {
        console.error(error);
    }

}

async function getMovieDetails(movieID) {

    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${movieID.trim()}&apikey=b6bf5319`);
        var data = await response.json();
        renderMovieDetails(data);
    } catch (error) {
        console.error(error)
    }

}

// Populating the search results in list


function renderMovies(movieList) {
    filmList = movieList;
    if (movieList) {
        list.innerHTML = "";
        for (i = 0; i < movieList.length; ++i) {

            const serializedObj = localStorage.getItem(movieList[i].imdbID);
            const obj = JSON.parse(serializedObj);

            if (serializedObj) {
                let li = document.createElement('li');
                li.classList.add("movie-list-item");
                li.setAttribute('data-id', obj[0].imdbID);
                li.innerHTML = `
                <div>
                <div class="list-image-holder">
                    <img src="${obj[0].Poster}" alt="">
                </div>
                <div class="movie-info">
                    <spam><b>${obj[0].Title}</b></span>
                    <span>${obj[0].Year}</span>
                </div>
                    </div>
                        <span class="like" data-id="${obj[0].imdbID}"><i class="fa-solid fa-heart" style="color: #e81828;"></i></span>`;
                list.appendChild(li);


            } else {

                let li = document.createElement('li');
                li.classList.add("movie-list-item");
                li.setAttribute('data-id', movieList[i].imdbID);
                li.innerHTML = `
            <div>
                <div class="list-image-holder">
                    <img src="${movieList[i].Poster}" alt="">
                </div>
                <div class="movie-info">
                    <spam><b>${movieList[i].Title}</b></span>
                    <span>${movieList[i].Year}</span>
                </div>
            </div>
            <span class="like" data-id="${movieList[i].imdbID}"><i class="fa-regular fa-heart fa-lg"></i></span>`;
                list.appendChild(li);

            }

        }

    } else {
        list.innerHTML = "";
        let li = document.createElement('li');
        li.classList.add("no-result");
        li.innerHTML = `<h2>No Result found</h2>`;
        list.appendChild(li);


    }

}


// Populating the movie details page



function renderMovieDetails(movie) {

    film = movie;

    const serializedObj = localStorage.getItem(movie.imdbID);
    const obj = JSON.parse(serializedObj);

    hompage.classList.add("hide");
    movieDetails.innerHTML = `
    <div class="movie-details-wrapper">
    <div>
        <h1 class="movie-style" style="text-shadow: 5px 5px 2px black;">${movie.Title}</h1>
        <div class="movie-date"><span>${movie.Year}</span>&nbsp;<span>&#183;</span>&nbsp;<span>${movie.Rated}</span>&nbsp;<span>&#183;</span>&nbsp;<span>${movie.Runtime}</span></div>
    </div>

    <div>
        <p class="imdb-rating-title">IMDb RATING</p>
        <div class="rating">
            <div><i class="fa-solid fa-star fa-xl"></i></div>
            <div><span class="rating-number"><b>${movie.imdbRating}</b></span><span class="rating-number-dino">/10</span></div>
        </div>
    </div>

</div>

<div class="movie-poster">
    <img src="${movie.Poster}" alt="">
    <div class="movie-poster-details">
        <div class="genre"></div>
        <div class="movie-bio">${movie.Plot}</div>
        <hr>
        <div class="movie-bio"><span><b>Director</b></span><span class="color-blue">${movie.Director}</span></div>
        <hr>
        <div class="movie-bio"><span><b>Writers</b></span><span class="color-blue">${movie.Writer}</span></div>
        <hr>
        <div class="movie-bio"><span><b>Stars</b></span><span class="color-blue">${movie.Actors}</span></div>
        <hr>
        <div class="movie-bio"><button class="button-1" id="markFavBtn" role="button" onClick="markAsFavourite('${movie.imdbID}')">${obj ? "Remove From Favorite" : "Mark As Favorite"}</button></div>
    </div>
</div>
</div>
    `;

    let genre = movie.Genre.split(",");
    let genreDiv = document.getElementsByClassName("genre")[0];

    for (let i = 0; i < genre.length; i++) {
        let span = document.createElement('span');
        span.innerText = genre[i];
        genreDiv.appendChild(span);
    }

    movieDetails.classList.remove("hide");

}


// Populating the favourite page

function renderFavouritePage() {


    let favDiv = document.getElementsByClassName("fav-list")[0];

    favList.innerHTML = "";

    for (let i = 0; i < favouriteList.length; i++) {
        let div = document.createElement('div');
        div.classList.add("fav-card");
        div.setAttribute("data-id", favouriteList[i][0].imdbID);
        div.innerHTML = `
                    <div class="fav-poster">
                        <img src="${favouriteList[i][0].Poster}" alt="">
                    </div>
                <div class="card-text"><span class="color-lightgrey">${favouriteList[i][0].Year}</span><div class="dislike" data-id="${favouriteList[i][0].imdbID}"><i class="fa-solid fa-thumbs-down" style="color: #ff0000;"></i></div></div>
            <p class="card-text extra-padding">${favouriteList[i][0].Title}</p>
        `;
        favDiv.appendChild(div);
    }

    favourite.classList.remove("hide");


}

// Adding items to favourite list

function markAsFavourite(id) {

    const markFavBtn = document.getElementById("markFavBtn");

    markFavBtn.innerText = ""; 

    const serializedObj = localStorage.getItem(id);
    const obj = JSON.parse(serializedObj);

    if (obj) {

        favouriteList = favouriteList.filter((film) => {
            return film[0].imdbID != id;
        });

        localStorage.removeItem(id);

        markFavBtn.innerText = "Mark As Favourite";

        Toastify({
            text: "Removed from favourites!",
            duration: 2000,
            className: "info",
            position: "center",
            style: {
                background: "linear-gradient(to right, #FD2626, #FFED50)"
            }
        }).showToast();

    }else{

        const serializedNewFavMovie = JSON.stringify([film]);
        localStorage.setItem(id, serializedNewFavMovie);

        favouriteList.push([film]);

        markFavBtn.innerText = "Remove From Favourite";

        Toastify({
            text: "Added to favourites!",
            duration: 2000,
            className: "info",
            position: "center",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            }
        }).showToast();

    }

}

function addToFavourite(id) {
    let likesList = document.getElementsByClassName("like");
    let like;
    for (let i = 0; i < likesList.length; i++) {
        if (likesList[i].dataset.id === id) {
            like = likesList[i];
            break;
        }
    }

    like.innerHTML = "";

    const serializedFavMovie = localStorage.getItem(id);

    if (serializedFavMovie) {

        favouriteList = favouriteList.filter((film) => {
            return film[0].imdbID != id;
        });

        localStorage.removeItem(id);

        like.innerHTML = `<i class="fa-regular fa-heart fa-lg"></i>`;

        Toastify({
            text: "Removed from favourites!",
            duration: 2000,
            className: "info",
            position: "center",
            style: {
                background: "linear-gradient(to right, #FD2626, #FFED50)"
            }
        }).showToast();

    } else {

        let newFavMovie = filmList.filter((film) => {
            return film.imdbID == id;
        });

        const serializedNewFavMovie = JSON.stringify(newFavMovie);
        localStorage.setItem(id, serializedNewFavMovie);

        favouriteList.push(newFavMovie);
        like.innerHTML = `<i class="fa-solid fa-heart" style="color: #e81828;"></i>`;
        Toastify({
            text: "Added to favourites!",
            duration: 2000,
            className: "info",
            position: "center",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            }
        }).showToast();
    }

}


// Remove from favourite list


function removeToFavourite(id) {
    favouriteList = favouriteList.filter((film) => {
        return film[0].imdbID != id;
    });

    localStorage.removeItem(id);
    Toastify({
        text: "Removed from favourites!",
        duration: 2000,
        className: "info",
        position: "center",
        style: {
            background: "linear-gradient(to right, #FD2626, #FFED50)"
        }
    }).showToast();
}

// Tracking mouse clicks and handling functions 


function handleClickListner(e) {
    const target = e.target;
    let dataId;
    if (target.closest("[data-id]")) {
        dataId = target.closest("[data-id]");
    }

    if (target?.parentElement?.className === 'like') {

        const taskid = target.parentElement.dataset.id;
        addToFavourite(taskid);

    } else if (target?.className === 'fav-page') {

        homepageTitle.style.color = "#FFFFFF";
        favPage.style.color = "#e2b616";
        hompage.classList.add("hide");
        searchBar.value = "";
        list.innerHTML = "";
        movieDetails.classList.add("hide");
        favourite.classList.remove("hide");
        renderFavouritePage();

    } else if (target?.className === 'home-page') {

        favPage.style.color = "#FFFFFF";
        homepageTitle.style.color = "#e2b616";
        movieDetails.classList.add("hide");
        favourite.classList.add("hide");
        hompage.classList.remove("hide");
        searchBar.value = "";
        list.innerHTML = "";

    } else if (dataId) {

        if (dataId?.className === 'fav-card') {

            const taskid = dataId.dataset.id;
            favourite.classList.add("hide");
            favPage.style.color = "#FFFFFF";
            getMovieDetails(taskid);

        } else if (dataId?.className === 'movie-list-item') {

            const taskid = dataId.dataset.id;
            homepageTitle.style.color = "#FFFFFF";
            getMovieDetails(taskid);

        } else if (dataId?.className === 'dislike') {

            const taskid = dataId.dataset.id;
            removeToFavourite(taskid);
            renderFavouritePage();

        }

    } else {

        list.innerHTML = "";
        searchBar.value = "";
    }



}

// When Page is loaded

window.onload = (event) => {

    // Setting event listener to the entire document

    document.addEventListener('click', handleClickListner);
    searchBar.value = "";
    homepageTitle.style.color = "#e2b616";


    // Getting items from local storage

    let serializedObj = localStorage.getItem('favouriteList');
    let obj = JSON.parse(serializedObj);

    if (obj) {

        for (let i = 0; i < obj.length; i++) {
            favouriteList.push(obj[i]);
        }
    }

};


window.addEventListener('beforeunload', function (e) {
    let serializedfavouriteList = JSON.stringify(favouriteList);
    localStorage.setItem('favouriteList', serializedfavouriteList);
});