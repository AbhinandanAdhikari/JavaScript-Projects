//getting the required elements for api calls
const api ={
    key: "7dbe287cd069c86576d523dbf8d373a3",
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

//function to set the city entered by the user
function setQuery(evt){
    if(evt.keyCode==13)
    {
        getResults(searchBox.value);
        console.log(searchBox.value);
    }
}

//function to get the city name entered by the user and the fetch the api
function getResults(query)
{
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather =>{
        return weather.json();
    }).then(displayResults);
}

//function to display weather temperature,day,max-temp,min-temp
function displayResults(weather){
    //console.log(weather);
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
    
    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText= weather.weather[0].main;

    let hilow=document.querySelector('.hi-low');
    hilow.innerText= `${weather.main.temp_min}°c/${weather.main.temp_max}°c`;
}

//function to set the date
function dateBuilder(d)
{
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date=d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`;
}