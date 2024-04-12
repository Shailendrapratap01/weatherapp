const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("input");
const weatherIcon = document.getElementById("weather-icon");
const weatherCard = document.getElementById("weather-info");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weather-desc");
const cityName = document.getElementById("location");
const error = document.getElementById("not-found");
const loader = document.getElementById("loader");
const bodyContainer = document.getElementById("main-container");

const apiKey = "82005d27a116c2880c8f0fcb866998a0";
let city;

window.addEventListener("load", async () => {
  navigator.geolocation.getCurrentPosition(getLocation, failedToGetLocation);
});

const getLocation = async (location) => {
  const currentLat = location.coords.latitude;
  const currentlLon = location.coords.longitude;
  getWeather(currentLat, currentlLon);
};

const failedToGetLocation = () => {
  Dispalay("none", "none", "flex");
};

const fetchData = async (url) => {
  const res = await fetch(url);
  let data = await res.json();
  return { res, data };
};

const Dispalay = (loaderDisplay, weatherCardDisplay, errorDisplay) => {
  loader.style.display = loaderDisplay;
  weatherCard.style.display = weatherCardDisplay;
  error.style.display = errorDisplay;
};

const getCoordinates = async (city) => {
  const { res, data } = await fetchData(
    `http://api.openweathermap.org/geo/1.0/direct?limit=1&q=${city}&appid=${apiKey}`
  );
  if (data.length > 0) {
    const lat = data[0].lat;
    const lon = data[0].lon;
    return { lat, lon };
  } else {
    Dispalay("none", "none", "flex");
    bodyContainer.style.backgroundImage = "url(./images/default.png)";
  }
};

searchBtn.addEventListener("click", async () => {
  if (searchInput.value == "") {
    Dispalay("none", "none", "flex");
  } else {
    city = searchInput.value;
    searchInput.value = "";
    const getCoordinatesData = await getCoordinates(city);
    const lat = getCoordinatesData?.lat;
    const lon = getCoordinatesData?.lon;
    if (lat && lon) {
      getWeather(lat, lon);
    }
  }
});

const getWeather = async (lat, lon) => {
  Dispalay("block", "none", "none");
  const { res, data } = await fetchData(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  Dispalay("none", "flex", "none");

  if (res.status == 200) {
    Dispalay("none", "flex", "none");

    const temp = Math.floor(data.main.temp);
    temperature.innerText = temp + "° c";
    weatherDesc.innerText = data.weather[0].description;
    cityName.innerText = data.name + " , " + data.sys.country;

    const iconId = data.weather[0].icon;
    weatherIcon.src = `images/${iconId}.png`;

    const imgId = data.weather[0].description;
    const imgName = imgId.split(" ").join("_");
    bodyContainer.style.backgroundImage = `url(./images/${imgName}.jpg)`;
  } else {
    Dispalay("none", "none", "flex");
    bodyContainer.style.backgroundImage = "url(./images/default.png)";
  }
};
