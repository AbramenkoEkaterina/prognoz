// const apiKey = "ef2ade3aeec91d0e2f6ae62a77546270"; // ключ

// async function getCityByLocation() {
//   return new Promise((resolve, reject) => {
//     //проверка поддержки геолокации Если в браузере нет navigator.geolocation, то сразу ошибка.
//     if (!navigator.geolocation) {
//       reject("Геолокация не поддерживается вашим браузером.");
//       return;
//     }

//     //получение координат
//     //getCurrentPosition — встроенный метод браузера, который спрашивает разрешение у пользователя
//     navigator.geolocation.getCurrentPosition(
       
//       async (position) => {
//         // console.log(position.coords); //свойства местоположения
//         const { latitude, longitude } = position.coords;

//         try {
//           // Запрос к серверу OpenWeatherMap
//           const response = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${apiKey}`
//           );

//           if (!response.ok) throw new Error("Ошибка API");
//           const data = await response.json();

//           //Выведем весь объект целиком
//       console.table("Полный ответ API:", data);
//       //  console.log("Основная информация:", data.main);
//       // console.log("Погода:", data.weather);
//       // console.log("Ветер:", data.wind);
//       // console.log("Система:", data.sys);
//       console.log(data.weather[0])

//           resolve({
//             lat: latitude,
//             lon: longitude,
//             city: data.name,
//             country: data.sys.country,
//             temp: data.main.temp, //текущая температура
//             feels_like: data.main.feels_like,// ощущается как
//             main: data.weather[0].main, //уменьшенное описание надо для подбора картинки
//             description: data.weather[0].description,//описание погоды
//             wind: data.wind.speed,//скорость ветра
//             humidity: data.main.humidity,//влажность воздуха
//           });
//         } catch (err) {
//           reject("Не удалось получить данные: " + err.message);
//         }
//       },
//       (error) => {
//         reject("Доступ к геолокации отклонён.");
//       }
//     );
//   });
// }

// getCityByLocation()
//   .then((data) => {
//     // Дата
//     const now = new Date();
//     const formattedDate = now.toLocaleDateString("ru-RU", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//     const formattedTime = now.toLocaleTimeString("ru-RU", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     // Вставляем данные в HTM
//     document.getElementById("date").textContent = formattedDate;
//     document.getElementById("time").textContent = formattedTime;
//     document.getElementById("city-data").textContent =`${data.city}`;

//       //console.log("Ваш город:", data.city); console.log("Температура:", data.temp, "°C"); console.log("Погода:", data.description);
//       //document.getElementById("weather_icon").textContent = "🥰";
//       document.getElementById("weather_temp").textContent = `${Math.round(data.temp)}°C`
//       document.getElementById("weather_feels_like").textContent = `Ощущается как: ${Math.round(data.feels_like)}°C`
//       document.getElementById("weather_description").textContent = data.description;
//       // добавляем иконку
//     setWeatherIcon(data.main);
//     // Загружаем прогноз
//     getForecast(data.lat, data.lon);
//   })
//   .catch((error) => {
//     console.error(error);
//     alert(error);
//   });

//   function setWeatherIcon(main) {
//   const iconEl = document.getElementById("weather_icon");

//   // убираем все старые классы кроме базового "icon"
//   iconEl.className = "icon";

//   // словарь соответствий
//   const iconMap = {
//     Clear: "sun",
//     Clouds: "clouds",
//     Rain: "rain",
//     Snow: "snow",
//     Thunderstorm: "thunder",
//     Drizzle: "rain",
//     Mist: "mist",
//     Fog: "mist",
//     Haze: "mist",
//     Smoke: "mist",
//     Dust: "mist",
//     Tornado: "thunder"
//   };

//   const iconClass = iconMap[main] || "default";
//   iconEl.classList.add(iconClass);
// }

// /** прогноз на 5 дней */

// async function getForecast(lat, lon) {
//   try {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`
//     );

//     if (!response.ok) throw new Error("Ошибка получения прогноза");

//     const data = await response.json();

//     // Берем прогноз на 5 ближайших дней (по 12:00)
//     const daily = data.list.filter(item =>
//       item.dt_txt.includes("12:00:00")
//     ).slice(0, 5);

//     const forecastContainer = document.getElementById("forecast");
//     forecastContainer.innerHTML = daily.map(day => {
//       const date = new Date(day.dt_txt).toLocaleDateString("ru-RU", {
//         weekday: "short",
//         day: "numeric",
//         month: "short",
//       });
//       const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
//       return `
//         <div class="forecast-day">
//           <div class="forecast-date">${date}</div>
//           <img src="${icon}" alt="${day.weather[0].description}">
//           <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
//           <div class="forecast-desc">${day.weather[0].description}</div>
//         </div>
//       `;
//     }).join("");
//   } catch (err) {
//     console.error("Ошибка прогноза:", err);
//   }
// }

import { getWeather, getForecast } from "./api.js";
import { getCoords } from "./geolocation.js";
import { renderCurrentWeather, renderForecast } from "./ui.js";

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

  /*модально окно*/
  
  const modal = document.getElementById('weatherModal');
  const btncloseModal = document.getElementById('closeModal');
  const moreDetails = document.querySelector('.mini_weather')
  console.log(moreDetails)

  //функция открытия
  function openModal() {
  modal.style.display = 'block';
  }

  //закрытие
  function closeModal() {
    modal.style.display = 'none';
  }

  //обработка событитя 
  moreDetails.addEventListener('click', openModal);
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      closeModal();
    }
  })
  
  