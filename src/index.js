import "./index.css";

const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", (ev) => {
  // prevent page from refreshing
  ev.preventDefault();

  weatherSearch();
});

async function weatherSearch() {
  const weatherContent = document.getElementById("weatherContent");
  let location = document.getElementById("searchInput").value;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    let weatherSummary = weatherData.weather[0].main;
    let temperature = weatherData.main.temp;
    displayWeatherData(weatherSummary, temperature);
    imageSearch(weatherSummary);
  } catch (error) {
    displayErrorMessage();
    imageSearch("earth");
  }

  function displayErrorMessage() {
    const errorMessage = document.getElementById("errorMessage");
    weatherContent.style.display = "none";
    errorMessage.style.display = "block";
    errorMessage.innerHTML = "Location not found";
  }

  function displayWeatherData(weatherSummary, temperature) {
    const weatherSummaryContainer = document.getElementById(
      "weatherSummaryContainer"
    );
    const temperatureContainer = document.getElementById(
      "temperatureContainer"
    );
    weatherSummaryContainer.innerHTML = weatherSummary;
    temperatureContainer.innerHTML = temperature;
    weatherContent.style.display = "block";
    errorMessage.style.display = "none";
  }
}

async function imageSearch(searchText) {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${searchText}&image_type=photo`,
      { mode: "cors" }
    );
    const imageData = await response.json();
    displayImageData(imageData);
  } catch (error) {
    console.error(error);
  }

  function displayImageData(imageData) {
    const imageContent = document.getElementById("imageContent");
    const weatherImage = document.getElementById("weatherImage");
    const imageCredit = document.getElementById("imageCredit");
    weatherImage.src = imageData.hits[0].webformatURL;
    imageCredit.innerHTML = imageData.hits[0].user;
    imageCredit.href = imageData.hits[0].pageURL;
    imageContent.style.display = "block";
  }
}

