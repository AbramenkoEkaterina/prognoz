export function initModal() {
  const modal = document.getElementById("weatherModal");
  const btnClose = document.getElementById("closeModal");
  const moreDetails = document.querySelector(".mini_weather");

  if (!modal || !btnClose || !moreDetails) {
    console.error("❌ Элементы модалки не найдены в DOM");
    return;
  }

  function openModal() {
    if (!window.currentWeather) {
      console.warn("⚠️ Нет данных для отображения в модалке");
      return;
    }

    const w = window.currentWeather;

    // Заполняем модалку
    document.getElementById("modal-temp").textContent = `${Math.round(w.main.temp)}°C`;
    document.getElementById("modal-feels").textContent = `${Math.round(w.main.feels_like)}°C`;
    document.getElementById("modal-wind").textContent = `${w.wind.speed} м/с`;
    document.getElementById("modal-humidity").textContent = `${w.main.humidity}%`;
    document.getElementById("modal-pressure").textContent = `${w.main.pressure} гПа`;

    // Почасовой прогноз (если есть forecastData)
    const hourlyContainer = document.getElementById("modal-hourly");
    hourlyContainer.innerHTML = "";

    if (window.forecastData) {
      const today = new Date().getDate();

      const hours = window.forecastData.list.filter(item => {
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

   // modal.style.display = "block";
   modal.classList.add('show');
  }

  function closeModal() {
   // modal.style.display = "none";
   modal.classList.remove('show')
  }

  moreDetails.addEventListener("click", openModal);
  btnClose.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
