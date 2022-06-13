////////// VARIABLES ///////////

// element selectors for search input form event handler
var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");

// element selectors for search list event handler
var searchListEl = document.querySelector("#city-search-list");
var cityBtnEl = document.querySelector(".city-btn");

// element selectors for clear search history event handler
var clearHistoryEl = document.querySelector("#clear-btn-section");
var clearBtnEl = document.querySelector(".clear-btn");

// element selectors for weather overview section
var overviewContainerEl = document.querySelector("#weather-overview");

// element selectors for forecast section
var forecastSectionEl = document.querySelector(".forecast");
var forecastTitleEl = document.querySelector(".forecast-title");
var forecastContainerEl = document.querySelector("#forecast-cards");

// empty array to store all search inputs
var searchHistory = []


////////// EVENT HANDLERS ///////////

// event handler that will display weather data for a city when the form submit icon is clicked with a search value
var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    //if a city name is entered, run functions. Otherwise, prompt user to enter a city name
    if (city) {
        // run function to get city latitude and longitude data
        getCityCoords(city);
        cityInputEl.value = "";

        // run function to add city input to search list
        createSearchList(city);
    }
    // prompt user to enter an input if no input exists
    else {
    alert("Please enter a city name");
    }
};

// event handler that will display weather data for a city when a search history button is clicked
var buttonClickHandler = function(event) {
    // get value from input element
    var city = event.target.getAttribute("data-city");

    // run value through function to display related weather info
    getCityCoords(city);
};

// event handler that will clear search history list when clear history button is clicked
var clearHistoryHandler = function(event) {
    // clear search list HTML element
    searchListEl.innerHTML = null;

    // clear search items from array
    searchHistory = [];

    // hide clear button
    clearBtnEl.setAttribute("style", "display: none");
}


////////// GENERAL FUNCTIONS ///////////

// Runs within formSubmitHandler function after search submit button is pressed. Takes searched city as its argument. This function adds each searched city to the searchHistory array, which is then modified to not include any duplicates.
var createSearchList = function(city) {
    // clear search list and display 'clear search history' button by removing display:none style
    searchListEl.innerHTML = null;
    clearBtnEl.removeAttribute("style");

    // add new search input to start of search history list
    searchHistory.unshift(city);

    // create search history array variable with no duplicate values
    uniqueSearchHistory = Array.from(new Set(searchHistory));
    console.log(uniqueSearchHistory);

    for (i = 0; i < uniqueSearchHistory.length; i++) {

        // create list item elements
        listItemEl = document.createElement("li");

        // create button elements, each with city name added as data attribute to be used with button handler
        searchHistoryBtnEl = document.createElement("button");
        searchHistoryBtnEl.setAttribute("class", "btn city-btn");
        searchHistoryBtnEl.setAttribute("data-city", uniqueSearchHistory[i]);
        searchHistoryBtnEl.textContent = uniqueSearchHistory[i];
        listItemEl.appendChild(searchHistoryBtnEl);

        searchListEl.appendChild(listItemEl);
    }

    saveSearchList(uniqueSearchHistory);
}


////////// STORAGE FUNCTIONS ///////////

// save updated uniqueSearchHistory array to localStorage
var saveSearchList = function(uniqueSearchHistory) {
    localStorage.setItem("cities", JSON.stringify(uniqueSearchHistory));

    var storedCities = JSON.parse(localStorage.getItem("cities"));
}

// get saved search array from localStorage and display to page as buttons
var loadSearchList = function() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    console.log(storedCities);

    // for (i = 0; 0 < storedCities.length; i++) {
    //     createSearchList(storedCities[i]);
    // }
}


////////// DATA RETRIEVAL FUNCTIONS ///////////
var getCityCoords = function(city) {
    // format the OpenWeather api url for city name
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=f1861af816f9e98e7d029ccebf696d61";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                var cityLat = data.coord.lat;
                var cityLon = data.coord.lon;

                getCityData(cityLat, cityLon, city);
            });
        }

        else {
            alert("Error: " + response.statusText);
          }
    });
}

var getCityData = function(cityLat, cityLon, city) {
    // format the OpenWeather api url for lat & lon
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&appid=f1861af816f9e98e7d029ccebf696d61";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
        console.log(data);

        displayOverview(data, city);
        });
    });
}

////////// HTML/CSS DISPLAY FUNCTIONS ///////////

var displayOverview = function(data, city) {
    // clear old content from overview container and display it by removing display:none style
    overviewContainerEl.innerHTML = null;
    overviewContainerEl.removeAttribute("style");

    // Create and append a title element
    overviewTitleEl = document.createElement("h2");
    overviewTitleEl.setAttribute("class", "overview-title");
    overviewTitleEl.textContent = city;
    overviewContainerEl.appendChild(overviewTitleEl);

    // Create and append current date
    var currentDate = new Date();
    var month = currentDate.getMonth()+1;
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();
    var fullDate0 = month + "/" + day + "/" + year;

    dateEl = document.createElement("span");
    dateEl.textContent = " (" + fullDate0 + ") ";
    overviewTitleEl.appendChild(dateEl);

    // Create and append an icon image
    var iconID = data.daily[0].weather[0].icon;
    overviewTitleIconEl = document.createElement("img");
    overviewTitleIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + iconID + "@2x.png");
    overviewTitleIconEl.setAttribute("class", "overview-icon");
    overviewTitleEl.appendChild(overviewTitleIconEl);

    // Create and append a p element for temperature
    var temperature = "Temperature: " + data.daily[0].temp.day + " °F";
    temperatureEl = document.createElement("p");
    temperatureEl.innerText = temperature;
    overviewContainerEl.appendChild(temperatureEl);

    // Create and append a p element for humidity
    var humidity = "Humidity: " + data.daily[0].humidity + "%";
    humidityEl = document.createElement("p");
    humidityEl.innerText = humidity;
    overviewContainerEl.appendChild(humidityEl);

    // Create and append a p element for wind speed
    var windSpeed = "Wind Speed: " + data.daily[0].wind_speed + " MPH";
    windSpeedEl = document.createElement("p");
    windSpeedEl.innerText = windSpeed;
    overviewContainerEl.appendChild(windSpeedEl);

    // Create and append a p element for UV Index
    var uvIndex = data.daily[0].uvi;
    uvIndexEl = document.createElement("p");

    // evaluate and style uv index
    if (uvIndex <= 2) {
        uvIndexEl.innerHTML = "UV Index: <span class='uvi uvi-low'>" + uvIndex + "</span>";
    }
    else if (uvIndex > 2 && uvIndex <= 6) {
        uvIndexEl.innerHTML = "UV Index: <span class='uvi uvi-moderate'>" + uvIndex + "</span>";
    }
    else if (uvIndex > 6) {
        uvIndexEl.innerHTML = "UV Index: <span class='uvi uvi-high'>" + uvIndex + "</span>";
    }

    overviewContainerEl.appendChild(uvIndexEl);

    displayForecast(data);
}

var displayForecast = function(data) {
    // clear old content
    forecastContainerEl.innerHTML = null;

    // add forecast section title
    forecastTitleEl.textContent = "5-Day Forecast";

    // Create and display forecast cards for each of the five forecast days
    for (var i = 1; i < 6; i++) {

        // Create forecast card div element
        var forecastCardEl = document.createElement("div");
        forecastCardEl.setAttribute("class", "forecast-card");

        // Create date element for each forecast day
        var currentDate = new Date();
        var month = currentDate.getMonth()+1;
        var day = currentDate.getDate() + parseInt([i]);
        var year = currentDate.getFullYear();
        var fullDate = month + "/" + day + "/" + year;

        dateEl = document.createElement("h4");
        dateEl.textContent = fullDate;

        forecastCardEl.appendChild(dateEl);

        // Create and append an icon image
        var iconID = data.daily[i].weather[0].icon;
        forecastIconEl = document.createElement("img");
        forecastIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + iconID + "@2x.png");
        forecastIconEl.setAttribute("class", "forecast-icon");
        forecastCardEl.appendChild(forecastIconEl);

        // Create and append a p element for temperature
        var temperature = "Temp: " + data.daily[i].temp.day + " °F";
        temperatureEl = document.createElement("p");
        temperatureEl.innerText = temperature;
        forecastCardEl.appendChild(temperatureEl);

        // Create and append a p element for humidity
        var humidity = "Humidity: " + data.daily[i].humidity + "%";
        humidityEl = document.createElement("p");
        humidityEl.innerText = humidity;
        forecastCardEl.appendChild(humidityEl);

        forecastContainerEl.appendChild(forecastCardEl);
    }
}


////////// EVENT LISTENERS ///////////

searchFormEl.addEventListener("submit", formSubmitHandler);
searchListEl.addEventListener("click", buttonClickHandler);
clearHistoryEl.addEventListener("click", clearHistoryHandler);

// loadSearchList();