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
}

