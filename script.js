const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("input");
const weatherIcon = document.getElementById("weather-icon");
const weatherInfo = document.getElementById("weather-info");
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
    navigator.geolocation.getCurrentPosition(gotLocation, failedToGetLocation)
});

const gotLocation = async (location)=>{
    lat = location.coords.latitude;
    lon = location.coords.longitude;
    console.log(lat, lon);
    city =  await getCurrentLocationWeather();
    getWeather(city);
}

const failedToGetLocation = ()=>{
    console.log("there was some issue");
}

const getCurrentLocationWeather = async ()=>{
    const res = await fetch(url + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`);
    let data = await res.json();
    console.log(data.name)
    return data.name;
}

let getWeather = async (city)=>{
    const res = await fetch(url + `&q=${city}` +`&appid=${apiKey}`);
    let data = await res.json();

    if(res.status == 200){
        weatherInfo.style.display = "flex";
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
        weatherInfo.style.display = "none";
        displayError.style.display = "flex";
    }
    console.log(data);
    console.log(res.status);
}

searchBtn.addEventListener("click", ()=>{
    city = searchInput.value;
    console.log(searchInput.value)
    getWeather(city);
})