import { getWeather, getForecast, getCoordsByCity } from "./api.js";
import { getCoords } from "./geolocation.js";
import { renderCurrentWeather, renderForecast } from "./ui.js";
import { initModal } from "./modal.js";

const openModal = initModal(); // теперь есть функция открытия

// включаем поиск по городу СРАЗУ
enableCitySearch();

// пробуем геолокацию
getCoords()
  .then(async ({ latitude, longitude }) => {
    const weather = await getWeather(latitude, longitude);
    renderCurrentWeather(weather);

    const forecast = await getForecast(latitude, longitude);
    renderForecast(forecast);

    // теперь кнопка "Подробнее" открывает модалку с актуальными данными
    document.querySelector(".mini_weather")
      .addEventListener("click", () => openModal(weather, forecast));
  })
  .catch(err => {
    console.warn("❌ Геолокация недоступна:", err);
    enableCitySearch();
  });

// ручной поиск города
function enableCitySearch() {
  const input = document.getElementById("city-input");
  const btn = document.getElementById("search-btn");

  btn.addEventListener("click", async () => {
    const city = input.value.trim();
    if (!city) return;

    try {
      const { lat, lon } = await getCoordsByCity(city);

      const weather = await getWeather(lat, lon);
      renderCurrentWeather(weather);

      const forecast = await getForecast(lat, lon);
      renderForecast(forecast);
      
      input.value = "";
      // снова вешаем открытие модалки, но уже для нового города
      document.querySelector(".mini_weather")
        .addEventListener("click", () => openModal(weather, forecast));
    } catch (err) {
      alert(err.message);
    }
  });
}
