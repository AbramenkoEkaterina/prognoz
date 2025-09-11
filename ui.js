//обновление DOM (отрисовка)

// Универсальная функция для установки иконки
export function setWeatherIcon(main, element = null) {
  const iconEl = element || document.getElementById("weather_icon");
  iconEl.className = "icon"; // сброс классов

  const iconMap = {
  Clear: "clear",
  Clouds: "clouds",
  Rain: "rain",
  Snow: "snow",
  Thunderstorm: "thunderstorm",
  Drizzle: "drizzle",
  Mist: "mist",
  Fog: "fog",
  Haze: "mist", // можешь оставить mist
  Smoke: "smoke",
  Dust: "mist", // или завести отдельный класс
  Sand: "sunny",
  Ash: "mist", // или завести .ash
  Squall: "squall",
  Tornado: "tornado",
};

  const iconClass = iconMap[main] || "default";
  iconEl.classList.add(iconClass);
}


// Текущая погода
export function renderCurrentWeather(data) {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("date").textContent = formattedDate;
  document.getElementById("time").textContent = formattedTime;
  document.getElementById("city-data").textContent = data.name;
  document.getElementById("weather_temp").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("weather_feels_like").textContent = `Ощущается как: ${Math.round(data.main.feels_like)}°C`;
  document.getElementById("weather_description").textContent = data.weather[0].description;

  setWeatherIcon(data.weather[0].main);
}

// Пагинация для мобильного свайпа
let currentPage = 0;
let totalPages = 0;

// Отображение прогноза на 5 дней
export function renderForecast(data) {
  const daily = data.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  const container = document.getElementById("forecast");
  container.innerHTML = ""; // очищаем старый прогноз

  daily.forEach((day) => {
    const date = new Date(day.dt_txt).toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    // карточка дня
    const dayEl = document.createElement("div");
    dayEl.classList.add("forecast-day");

    // дата
    const dateEl = document.createElement("div");
    dateEl.classList.add("forecast-date");
    dateEl.textContent = date;

    // иконка
    const iconEl = document.createElement("div");
    iconEl.classList.add("icon");
    setWeatherIcon(day.weather[0].main, iconEl);

    // температура
    const tempEl = document.createElement("div");
    tempEl.classList.add("forecast-temp");
    tempEl.textContent = `${Math.round(day.main.temp)}°C`;

    // описание
    const descEl = document.createElement("div");
    descEl.classList.add("forecast-desc");
    descEl.textContent = day.weather[0].description;

    // собираем карточку
    dayEl.appendChild(dateEl);
    dayEl.appendChild(iconEl);
    dayEl.appendChild(tempEl);
    dayEl.appendChild(descEl);

    container.appendChild(dayEl);
  });

// Мобильная версия: свайп по 2 карточки в колонку
  if (window.innerWidth <= 768) {
    totalPages = Math.ceil(daily.length / 2); // 2 карточки на страницу
    currentPage = 0;
    updateForecastPosition();
    addSwipeEvents(container);
    window.addEventListener("resize", () => {
      // при изменении ширины сбрасываем позицию
      currentPage = 0;
      updateForecastPosition();
    });
  } else {
    // сбрасываем трансформацию на десктопе
    container.style.transform = "none";
  }
}

// Обновление позиции контейнера для свайпа
// Обновление позиции контейнера
function updateForecastPosition() {
  const container = document.getElementById("forecast");
  const dayHeight = container.querySelector(".forecast-day").offsetHeight;
  const offset = dayHeight * 2 * currentPage; // 2 карточки на страницу
  container.style.transform = `translateX(-${currentPage * container.offsetWidth}px)`; // горизонтально
  container.style.transition = "transform 0.3s ease-in-out";

  // скрываем карточки не текущей страницы (для вертикальной колонки)
  const allCards = container.querySelectorAll(".forecast-day");
  allCards.forEach((card, index) => {
    const pageIndex = Math.floor(index / 2);
    card.style.display = pageIndex === currentPage ? "flex" : "none";
  });
}

// Свайп для мобильной версии
function addSwipeEvents(container) {
  let startX = 0;
  let endX = 0;

  container.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].screenX; });
  container.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = endX - startX;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && currentPage < totalPages - 1) currentPage++;
      else if (diff > 0 && currentPage > 0) currentPage--;
      updateForecastPosition();
    }
  }
}