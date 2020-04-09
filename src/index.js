import "./index.css";

const submitButton = document.getElementById("submitButton");
const temperatureUnitToggleButton = document.getElementById(
  "temperatureUnitToggleButton"
);
const fahrenheitSection = document.getElementById("fahrenheitSection");
const celciusSection = document.getElementById("celciusSection");

submitButton.addEventListener("click", (ev) => {
  // prevent page from refreshing
  ev.preventDefault();

  // gets data from Open Weather API based on input location
  weatherSearch();
});

temperatureUnitToggleButton.addEventListener(
  "click",
  toggleTemperatureUnitDisplay
);

// updates display and toggle button text between fahrenheit and celcius units
function toggleTemperatureUnitDisplay() {
  if (fahrenheitSection.style.display === "none") {
    temperatureUnitToggleButton.innerHTML = "Switch to Celcius";
    fahrenheitSection.style.display = "block";
    celciusSection.style.display = "none";
  } else {
    temperatureUnitToggleButton.innerHTML = "Switch to Fahrenheit";
    fahrenheitSection.style.display = "none";
    celciusSection.style.display = "block";
  }
}

// gets data from Open Weather API
async function weatherSearch() {
  const weatherContent = document.getElementById("weatherContent");
  const location = document.getElementById("searchInput").value;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    const weatherSummary = weatherData.weather[0].main;
    const celciusTemperature = weatherData.main.temp;

    displayWeatherData(weatherSummary, celciusTemperature);
    imageSearch(weatherSummary);
  } catch (error) {
    displayErrorMessage();
    // search for a default image
    imageSearch("earth");
  }

  function displayErrorMessage() {
    const errorMessage = document.getElementById("errorMessage");
    // hide existing weather data that may be displayed
    weatherContent.style.display = "none";
    // display error message
    errorMessage.style.display = "block";
  }

  function displayWeatherData(weatherSummary, celciusTemperature) {
    const weatherSummaryContainer = document.getElementById(
      "weatherSummaryContainer"
    );
    const celciusContainer = document.getElementById("celciusContainer");
    const fahrenheitContainer = document.getElementById("fahrenheitContainer");

    // set celcius temperature
    celciusContainer.innerHTML = celciusTemperature;
    // display celcius temperature by default
    celciusSection.style.display = "block";
    // set default text of temperature unit toggle button
    temperatureUnitToggleButton.innerHTML = "Switch to Fahrenheit";
    // set fahrenheit temperature
    fahrenheitContainer.innerHTML = celciusToFahrenheit(celciusTemperature);
    // hide fahrenehit display by default
    fahrenheitSection.style.display = "none";
    // set the main weather condition: Rain, Clear, Overcast, etc
    weatherSummaryContainer.innerHTML = weatherSummary;
    // display all weather data
    weatherContent.style.display = "block";
    // hide any existing error messages
    errorMessage.style.display = "none";

    // converts celcius to fahrenheit
    function celciusToFahrenheit(celciusTemperature) {
      const fahrenheitTemperature = celciusTemperature * (9 / 5) + 32;
      return Math.round(fahrenheitTemperature * 10) / 10;
    }
  }
}

// gets an image from the Pixabay API
async function imageSearch(searchText) {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${searchText}&image_type=photo`,
      { mode: "cors" }
    );
    const imageData = await response.json();
    displayImageData(imageData);
  } catch (error) {
    // hide the image content section
    imageContent.style.display = "block";
  }

  function displayImageData(imageData) {
    const imageContent = document.getElementById("imageContent");
    const weatherImage = document.getElementById("weatherImage");
    const imageCredit = document.getElementById("imageCredit");
    // set weather image
    weatherImage.src = imageData.hits[0].webformatURL;
    // set credit/source for image
    imageCredit.innerHTML = imageData.hits[0].user;
    imageCredit.href = imageData.hits[0].pageURL;
    // display image content
    imageContent.style.display = "block";
  }
}
