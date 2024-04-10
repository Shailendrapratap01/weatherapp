const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("input");
const weatherImg = document.getElementById("weather-img");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weather-desc");
const cityName = document.getElementById("location");

const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" ;
const apiKey = "82005d27a116c2880c8f0fcb866998a0" ;
let city;

const getWeather = async (city)=>{
    const res = await fetch(url + city +`&appid=${apiKey}`);
    let data = await res.json();

    temperature.innerText = data.main.temp ;
    weatherDesc.innerText = data.weather[0].description ;
    cityName.innerText = data.name + " , " +data.sys.country ;

    console.log(data);
}

searchBtn.addEventListener("click", ()=>{
    city = searchInput.value;
    console.log(searchInput.value)
    getWeather(city);
})