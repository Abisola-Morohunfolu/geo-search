const DOMStrings = {
	searchInput: document.querySelector('.search__box-input'),
	searchBtn: document.querySelector('.btn-search'),
	resultContainer: document.querySelector('.results'),
	weatherResultContainer: document.querySelector('.weather__results'),
	mapContainer: document.querySelector('.map__container')
};

const key = '1e51f09a2a5cef978fce70506749e63c';
const googleAPI = 'AIzaSyBIJHwQ1v2z24-ETB-Huosk9aVJ_BZrnQY';

/**
 * LOADER
 */

const loader = parent => {
	const markup = `
        <div class='loader-container'>
            <div class="loader"></div>
        </div>
    `;

	parent.insertAdjacentHTML('afterbegin', markup);
};

const clearLoader = () => {
	const element = document.querySelector('.loader');
	element.parentElement.removeChild(element);
};

const clearInput = () => {
	DOMStrings.searchInput.textContent = ' ';
};
/**
 * CLEAR CONTENT
 */

const clearResults = parent => {
	parent.textContent = '';
};

/**
 * GEOCODE SEARCH STRING
 */
const geocodeString = async string => {
	const geocodeString = await fetch(
		`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=${string}&key=${googleAPI}`
	);
	try {
		const geocodeObj = await geocodeString.json();
		const geoCoord = geocodeObj.results[0].geometry.location;
		//console.log(geocodeObj, geoCoord);
		return geoCoord;
	} catch (error) {
		console.log(error);
	}
};

/**
 * NEW WEATHER OBJECT
 */
class weatherQuery {
	constructor(location) {
		this.location = location;
	}

	async getCurrentWeather() {
		console.log(this.location);
		try {
			const response = await fetch(
				`https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=${this.location}&appid=${key}`
			);
			const result = await response.json();
			return result;
		} catch (error) {
			console.log(error);
		}
	}
}

/**
 * RENDER WEATHER RESULT
 */

const formatDate = () => {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'June',
		'July',
		'Aug',
		'Sept',
		'Oct',
		'Nov',
		'Dec'
	];
	const year = new Date().getFullYear();
	const monthIndex = new Date().getMonth();
	const currentMonth = months[monthIndex];
	const day = new Date().getDate();
	return `${currentMonth} ${day}, ${year}`;
};

const renderWeatherResult = result => {
	const markup = `
        <div class="weather__results-details current__city">
            <h2 class="heading__secondary">
                Weather Report for 
                <span class="current__city-name">${result.name}</span>
                <span class="current__city-date">${formatDate()}</span>
            </h2>
        </div>
        <div class="weather__results-details current__weather">
            <h3 class="heading__tertiary">
                Current Weather Condition:
                <span class="current__weather-condition">${
									result.weather[0].main
								}</span>
            </h3>
        </div>
        <div class="weather__results-details current__temp">
            <h4 class="heading__tertiary">
                Current Temperature: 
                <span class="current__temp-value">${
									result.main.temp
								} &#8451;</span>
            </h4>
            <button class="btn-inline btn-convert">Convert Celcius to Fahrenheit</button>
        </div>
        <div class="weather__results-details current__wind">
            <h3 class="heading__tertiary">
                Wind Speed: 
                <span class="current__wind-speed">${result.wind.speed}m/s</span>
            </h3>
        </div>
        <div class="weather__results-details current__humidity">
            <h3 class="heading__tertiary">
                Humidity: 
                <span class="current__humidity-value">${
									result.main.humidity
								}</span>
            </h3>
        </div>
        <div class="weather__results-details current__humidity">
            <button class="btn-share btn-inline">
                Share on Facebook
            </button>
        </div>
    `;

	DOMStrings.weatherResultContainer.insertAdjacentHTML('afterbegin', markup);
};

/**
 * RENDER MAP
 */

const renderMap = geoLocation => {
	const markup = `
        <div class="map__container">
          <img src="https://maps.googleapis.com/maps/api/staticmap?center=${geoLocation.lat},${geoLocation.lng}&zoom=12&size=900x900&scale=2&maptype=roadmap&markers=color:red%7Clabel:L%7C${geoLocation.lat},${geoLocation.lng}&key=${googleAPI}" alt="City Map" class="map">
        </div>
  `;

	DOMStrings.mapContainer.insertAdjacentHTML('afterbegin', markup);
};

/**
 * EVENT LISTENERS
 */

DOMStrings.searchBtn.addEventListener('click', e => {
	e.preventDefault();
	clearInput();
	getMap();
	getWeather();
});

const getWeather = async () => {
	const location = DOMStrings.searchInput.value;

	if (location !== '') {
		DOMStrings.weatherResultContainer.scrollIntoView({
			behavior: 'smooth'
		});

		//render loader
		clearResults(DOMStrings.weatherResultContainer);
		loader(DOMStrings.weatherResultContainer);
		await geocodeString(location);

		try {
			const weather = new weatherQuery(location);
			const result = await weather.getCurrentWeather();
			console.log(result);
			clearLoader();
			renderWeatherResult(result);
		} catch (error) {
			console.log(error);
		}
	}
};

const getMap = async () => {
	const location = DOMStrings.searchInput.value;
	if (location !== '') {
		//prepare UI for result
		clearResults(DOMStrings.mapContainer);
		loader(DOMStrings.mapContainer);

		try {
			const geoLocation = await geocodeString(location);
			clearLoader();
			renderMap(geoLocation);
		} catch (error) {
			console.log(error);
		}
	}
};
