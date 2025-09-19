export function initModal() {
  const modal = document.getElementById("weatherModal");
  const btnClose = document.getElementById("closeModal");
  const moreDetails = document.querySelector(".mini_weather");

  if (!modal || !btnClose || !moreDetails) {
    console.error("❌ Элементы модалки не найдены в DOM");
    return;
  }

  // функция открытия с передачей данных
  function openModal(weather, forecast) {
    if (!weather) {
      console.warn("⚠️ Нет данных для отображения в модалке");
      return;
    }

    // Заполняем модалку
    document.getElementById("modal-temp").textContent = `${Math.round(weather.main.temp)}°C`;
    document.getElementById("modal-feels").textContent = `${Math.round(weather.main.feels_like)}°C`;
    document.getElementById("modal-wind").textContent = `${weather.wind.speed} м/с`;
    document.getElementById("modal-humidity").textContent = `${weather.main.humidity}%`;
    document.getElementById("modal-pressure").textContent = `${weather.main.pressure} гПа`;

    // Почасовой прогноз
    const hourlyContainer = document.getElementById("modal-hourly");
    hourlyContainer.innerHTML = "";

    if (forecast) {
      const today = new Date().getDate();
      const hours = forecast.list.filter(item => {
        const itemDate = new Date(item.dt_txt);
        return itemDate.getDate() === today;
      });

      hours.forEach(hour => {
        const hourEl = document.createElement("div");
        hourEl.classList.add("hour");
        hourEl.innerHTML = `
          <span>${new Date(hour.dt_txt).getHours()}:00</span>
          <span>${Math.round(hour.main.temp)}°C</span>
          <span>${hour.weather[0].description}</span>
        `;
        hourlyContainer.appendChild(hourEl);
      });
    }

    modal.classList.add("show");
  }

  function closeModal() {
    modal.classList.remove("show");
  }

  btnClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Возвращаем функцию, чтобы index.js мог открывать модалку с данными
  return openModal;
}
