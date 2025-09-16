import { getWeather, getForecast } from "./api.js";
import { getCoords } from "./geolocation.js";
import { renderCurrentWeather, renderForecast } from "./ui.js";
import { initModal } from "./modal.js";

// сразу инициализируем модалку
initModal();

getCoords()
  .then(async ({ latitude, longitude }) => {
    try {
      const weather = await getWeather(latitude, longitude);
      renderCurrentWeather(weather);

      const forecast = await getForecast(latitude, longitude);
      renderForecast(forecast);
    } catch (err) {
      console.error(err);
      alert(err.message || err);
    }
  })
  .catch(err => {
    console.error(err);
    alert(err);
  });
