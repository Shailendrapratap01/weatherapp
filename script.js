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
const weatherForecastContainer = document.getElementById("weather-cards-div");
const weatherContainer = document.getElementById("#weather-container");
const validationError = document.getElementById("error");

const apiKey = "82005d27a116c2880c8f0fcb866998a0";
let city;
const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsArr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

window.addEventListener("load", async () => {
  navigator.geolocation.getCurrentPosition(getLocation, failedToGetLocation);
});

const getLocation = async (location) => {
  const currentLatitude = location.coords.latitude;
  const currentLongitude = location.coords.longitude;
  getWeather(currentLatitude, currentLongitude);
  getForcastWeather(currentLatitude, currentLongitude);
};

const failedToGetLocation = () => {
  showOrHideContent("none", "none", "flex", "none");
};

const fetchData = async (url) => {
  const res = await fetch(url);
  let data = await res.json();
  return { res, data };
};

const showOrHideContent = (
  loaderDisplay,
  weatherCardDisplay,
  errorDisplay,
  weatherForecastContainerDisplay
) => {
  loader.style.display = loaderDisplay;
  weatherCard.style.display = weatherCardDisplay;
  error.style.display = errorDisplay;
  weatherForecastContainer.style.display = weatherForecastContainerDisplay;
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
    showOrHideContent("none", "none", "flex", "none");
    bodyContainer.style.backgroundImage = "url(./images/default.png)";
    validationError.style.display = "none";
  }
};

searchBtn.addEventListener("click", async () => {
  showOrHideContent("block", "none", "none", "none");
  if (searchInput.value.trim() === "") {
    validationError.style.display = "block";
    showOrHideContent("none", "none", "flex", "none");
    searchInput.value = "";
    return;
  } else {
    city = searchInput.value;
    searchInput.value = "";
    const getCoordinatesData = await getCoordinates(city);
    const lat = getCoordinatesData?.lat;
    const lon = getCoordinatesData?.lon;
    if (lat && lon) {
      getWeather(lat, lon);
      getForcastWeather(lat, lon);
    }
  }
});

const getWeather = async (lat, lon) => {
  const { res, data } = await fetchData(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
  );

  if (res.status === 200) {
    showOrHideContent("none", "flex", "none");
    validationError.style.display = "none";

    const temp = Math.floor(data.main.temp);
    temperature.innerText = temp + "° c";
    weatherDesc.innerText = data.weather[0].description;
    cityName.innerText = data.name + " , " + data.sys.country;

    const iconId = data.weather[0].icon;
    weatherIcon.src = `images/${iconId}.png`;

    const imgId = data.weather[0].description;
    const imgName = imgId.split(" ").join("_");
    bodyContainer.style.backgroundImage = `url(./images/${imgName}.jpg)`;
    weatherForecastContainer.style.display = "block";
  } else {
    showOrHideContent("none", "none", "flex", "none");
    bodyContainer.style.backgroundImage = "url(./images/default.png)";
    validationError.style.display = "none";
  }
};

const createForecastDiv = (date, imgSrc, temp, desc) => {
  return `<div class="weather-forecast-div">
                <div class="weather-forecast-date">
                    <p>${date}</p>
                </div>
                <div class="weather-forecast-descandtemp">
                    <div class="weather-forecast-imgandtemp">
                        <div class="weather-forecast-img">
                            <img src="images/${imgSrc}.png" alt="">
                        </div>
                        <p class="weather-forecast-temp">${temp}° c</p>
                    </div>
                    <p class="weather-forecast-desc">${desc}</p>
                </div>
            </div>`;
};

const getForcastWeather = async (lat, lon) => {
  let card = `<p class="forecast-heading">4-day forecast</p>`;
  let n = 8;
  const { res, data } = await fetchData(
    `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  for (let i = 0; i < 4; i++) {
    const temp = Math.floor(data.list[n].main.temp);

    const unixDate = data.list[n].dt * 1000;
    const dateObj = new Date(unixDate);
    const day = daysArr[dateObj.getDay()];
    const month = monthsArr[dateObj.getMonth()];
    const date = dateObj.getDate();
    const fullDate = `${day}, ${month} ${date}`;

    const forecastImg = data.list[n].weather[0].icon;
    const forecastDesc = data.list[n].weather[0].description;

    n += 8;
    card += createForecastDiv(fullDate, forecastImg, temp, forecastDesc);
  }
  weatherForecastContainer.classList.add("weatherForecastDiv");
  weatherForecastContainer.innerHTML = card;
};
