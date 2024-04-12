const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("input");
const weatherIcon = document.getElementById("weather-icon");
const weatherCard = document.getElementById("weather-info");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weather-desc");
const cityName = document.getElementById("location");
const displayError = document.getElementById("not-found");
const loader = document.getElementById("loader")
const parentContainer = document.getElementById("main-container")

const url = "https://api.openweathermap.org/data/2.5/weather?units=metric" ;
const apiKey = "82005d27a116c2880c8f0fcb866998a0" ;
let city;

window.addEventListener("load", async () => {
    console.log("page is fully loaded");
    navigator.geolocation.getCurrentPosition(getLocation, failedToGetLocation)
});

const getLocation = async (location)=>{
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    getWeather(lat, lon);
}

const failedToGetLocation = ()=>{
    console.log("there was some issue");
    displayError.style.display = "flex";
    loader.style.display = "none";
}

const getCoordinates = async ()=>{
    const url = "http://api.openweathermap.org/geo/1.0/direct?limit=1";

    const res = await fetch(url + `&q=${city}` +`&appid=${apiKey}`);
    let data = await res.json();

    if(data.length > 0){
        const lat = data[0].lat;
        const lon = data[0].lon;
        return {lat, lon};
    }
    else{
        weatherCard.style.display = "none";
        displayError.style.display = "flex";
        parentContainer.style.backgroundImage = "url(./images/default.png)";
    }
}

searchBtn.addEventListener("click", async ()=>{
    city = searchInput.value;
    searchInput.value = "";
    const {lat, lon} = await getCoordinates(city);
    getWeather(lat, lon);
})

let getWeather = async (lat, lon)=>{
    loader.style.display = "block";
    weatherCard.style.display = "none";
    const res = await fetch(url + `&lat=${lat}` + `&lon=${lon}` +`&appid=${apiKey}`);
    let data = await res.json();
    loader.style.display = "block";
    weatherCard.style.display = "flex";

    if(res.status == 200){
        weatherCard.style.display = "flex";
        displayError.style.display = "none";
        loader.style.display = "none";

        const temp = Math.floor(data.main.temp)
        temperature.innerText = temp + "° c";
        weatherDesc.innerText = data.weather[0].description ;
        cityName.innerText = data.name + " , " +data.sys.country ;

        const iconId = data.weather[0].icon;
        weatherIcon.src = `images/${iconId}.png`;

        const imgId = data.weather[0].description;
        const imgName = imgId.split(" ").join("_")
        parentContainer.style.backgroundImage = `url(./images/${imgName}.jpg)`;
    }
    else{
        weatherCard.style.display = "none";
        displayError.style.display = "flex";
        loader.style.display = "none";
        parentContainer.style.backgroundImage = "url(./images/default.png)";
    }
    console.log(res.status);
}
