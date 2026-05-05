const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const statusMessage = document.querySelector(".statusMessage");
const submitButton = document.querySelector(".primaryBtn");

const cityDisplay = document.querySelector(".cityDisplay");
const dateDisplay = document.querySelector(".dateDisplay");
const weatherEmoji = document.querySelector(".weatherEmoji");
const tempDisplay = document.querySelector(".tempDisplay");
const descriptionDisplay = document.querySelector(".descriptionDisplay");
const humidityDisplay = document.querySelector(".humidityDisplay");
const feelsLikeDisplay = document.querySelector(".feelsLikeDisplay");
const windDisplay = document.querySelector(".windDisplay");
const pressureDisplay = document.querySelector(".pressureDisplay");

const apiBaseUrl = "/api/weather";

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        showStatus("Please enter a city name.", true);
        card.style.display = "none";
        return;
    }

    setLoadingState(true);

    try {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
        showStatus(`Updated weather for ${weatherData.name}.`, false);
    } catch (error) {
        showStatus(error.message || "Could not fetch weather data.", true);
        card.style.display = "none";
    } finally {
        setLoadingState(false);
    }
});

async function getWeatherData(city) {
    const response = await fetch(`${apiBaseUrl}?q=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error ? toSentenceCase(data.error) : "Could not fetch weather data.");
    }

    return data;
}

function displayWeatherInfo(data) {
    const {
        name: city,
        sys: { country },
        main: { temp, humidity, feels_like: feelsLike, pressure },
        wind: { speed },
        weather: [{ description, id }]
    } = data;

    card.style.display = "flex";
    cityDisplay.textContent = `${city}, ${country}`;
    dateDisplay.textContent = new Date().toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    weatherEmoji.textContent = getWeatherEmoji(id);
    tempDisplay.textContent = `${Math.round(temp)}°C`;
    descriptionDisplay.textContent = description;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    feelsLikeDisplay.textContent = `Feels like: ${Math.round(feelsLike)}°C`;
    windDisplay.textContent = `Wind: ${Math.round(speed * 3.6)} km/h`;
    pressureDisplay.textContent = `Pressure: ${pressure} hPa`;
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId >= 200 && weatherId < 300:
            return "⛈";
        case weatherId >= 300 && weatherId < 500:
            return "🌦";
        case weatherId >= 500 && weatherId < 600:
            return "🌧";
        case weatherId >= 600 && weatherId < 700:
            return "❄";
        case weatherId >= 700 && weatherId < 800:
            return "🌫";
        case weatherId === 800:
            return "☀";
        case weatherId > 800:
            return "☁";
        default:
            return "?";
    }
}

function showStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.classList.toggle("error", Boolean(isError));
}

function setLoadingState(loading) {
    submitButton.disabled = loading;
    submitButton.textContent = loading ? "Fetching..." : "Get Weather";
    if (loading) {
        showStatus("Fetching latest weather data...", false);
    }
}

function toSentenceCase(text) {
    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
}