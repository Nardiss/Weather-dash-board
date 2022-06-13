// variables for dom elements
var searchInput = document.getElementById("search-city")
var searchBtn   = document.getElementById("search-btn")

// variable for API key 
var apiKey = "6e12c07334cbea48614359b986f64d12"

// function to get info about the search city
function getCity(event){
    event.preventDefault();
    var searchCity = searchInput.value
    console.log(searchCity);
    // use the fetch method to get info about the city
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => getWeather(data));
}

// function to get weather for the city
function getWeather(cityInfo){
    console.log(cityInfo);
    // create a variable for lon & lat
    var lat = cityInfo[0].lat
    console.log(lat);
    var lon = cityInfo[0].lon
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => renderWeather(data));

}

function renderWeather(forecast){
    console.log(forecast);

}

// trying to use from module 6.2.5

// var displayRepos = function(repos, searchTerm){
//     console.log(repos);
//     console.log(searchTerm)
//     // clear old content
//     repoContainerEl.textContent = "";
//     repoSearchTerm.textContent = searchTerm;

//     // loop over repos
//     for (var i = 0; i < repos.length; i++) {
//         // format repo name
//         var repoName = repos[i].owner.login + "/" + repos[i].name;

//         // create a container for each repo
//         var repoEl = document.createElement("div");
//         repoEl.classList = "list-item flex-row justify-space-between align-center";

//         // create a span element to hold repository name
//         var titleEl = document.createElement("span");
//         titleEl.textContent = repoName;

//         // append to container
//         repoEl.appendChild(titleEl);

//         // append container to the dom
//         repoContainerEl.appendChild(repoEl);   
//     }
// };


searchBtn.addEventListener("click", getCity);
