const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection=document.querySelector('.weather-info')
const countryTxt = document.querySelector('.country-txt')
const textTemp = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValuetxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImage = document.querySelector('.weather-summary-image')

const currentDataTxt = document.querySelector('.current-date-txt')
const forecastItemsContainer= document.querySelector('.forecast-item-container')
const apikey = "dc8a3e1d616cbc115cf12a4631759bdd"

searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim() !=''){
       updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
    
})
cityInput.addEventListener('keydown',(event)=>{
    if(event.key=='Enter' && 
        cityInput.value.trim() !=''
    ){
       updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }

})
async function getfetchData(endPoint,city){
     const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
     const response = await fetch(apiUrl)
     return response.json()
}
function getWeatherIcon(id) {
    if (id >= 200 && id <= 232) return 'thunderstorm.svg'; // Thunderstorm
    if (id >= 300 && id <= 321) return 'drizzle.svg';      // Drizzle
    if (id >= 500 && id <= 531) return 'rain.svg';         // Rain
    if (id >= 600 && id <= 622) return 'snow.svg';         // Snow
    if (id >= 701 && id <= 781) return 'atmosphere.svg';   // Atmosphere
    if (id === 800) return 'clear.svg';                   // Clear
    if (id >= 801 && id <= 804) return 'clouds.svg';       // Clouds
    return 'default.svg'; // Default icon for unknown IDs
}

function getCurrentDate() {
      const currentDate = new Date()
      console.log(currentDate)
      const options = {
        weekday:'short',
        day:'2-digit',
        month:'short'
      }
      return currentDate.toLocaleDateString('en-GB',options)
}
 async function updateWeatherInfo(city) {
    const weatherData =  await getfetchData('weather',city)
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)
const {
    name:country,
    main:{temp,humidity},
    weather:[{id, main}],
    wind:{speed},
}=weatherData
   countryTxt.textContent = country
   textTemp.textContent = Math.round(temp) +' ℃'
conditionTxt.textContent = main
humidityValuetxt.textContent = humidity+'%'
windValueTxt.textContent=speed + ' m/s'
currentDataTxt.textContent = getCurrentDate()
// console.log(getCurrentDate())
weatherSummaryImage.src = `weather/${getWeatherIcon(id)}`

    showDisplaySection(weatherInfoSection)
}
async function updateForecastsInfo(city) {
    const forecastsData = await getfetchData('forecast',city)
    const timeTaken = '12:00:00'
    const todayData = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML =''

    forecastsData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken)&& !forecastWeather.dt_txt.includes(todayData))
    updateForecastsItems(forecastWeather)
    })

}
function updateForecastsItems(weatherData){
  console.log(weatherData)
  const {
    dt_txt: date,
    weather:[{id}],
    main:{temp}

  }= weatherData

  const dateTaken = new Date(date)
  const dateOption = {
    day:'2-digit',
    month:'short'
  }
  const dateResult = dateTaken.toLocaleDateString('en-us',dateOption)
  const forecastItem = `
                <div class="forecast-item">
                    <h5 class="fore-cast-item-date regular-txt">${dateResult}</h5>
                    <img src="weather/${getWeatherIcon(id)}" alt="" class="forecast-item-image">
                    <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
                </div>
  `
  forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)
}
function showDisplaySection(section){
[weatherInfoSection,searchCitySection,notFoundSection].forEach(s => s.style.display="none");
section.style.display = 'flex'
}
      