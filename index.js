const apiKey = "ef2ade3aeec91d0e2f6ae62a77546270"; // ключ

async function getCityByLocation() {
  return new Promise((resolve, reject) => {
    //проверка поддержки геолокации Если в браузере нет navigator.geolocation, то сразу ошибка.
    if (!navigator.geolocation) {
      reject("Геолокация не поддерживается вашим браузером.");
      return;
    }

    //получение координат
    //getCurrentPosition — встроенный метод браузера, который спрашивает разрешение у пользователя
    navigator.geolocation.getCurrentPosition(
       
      async (position) => {
        // console.log(position.coords); //свойства местоположения
        const { latitude, longitude } = position.coords;

        try {
          // Запрос к серверу OpenWeatherMap
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${apiKey}`
          );

          if (!response.ok) throw new Error("Ошибка API");


          const data = await response.json();

          //Выведем весь объект целиком
      //console.table("Полный ответ API:", data);
      //  console.log("Основная информация:", data.main);
      // console.log("Погода:", data.weather);
      // console.log("Ветер:", data.wind);
      // console.log("Система:", data.sys);
      console.log(data.weather[0])

          resolve({
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp, //текущая температура
            feels_like: data.main.feels_like,// ощущается как
            main: data.weather[0].main, //уменьшенное описание надо для подбора картинки
            description: data.weather[0].description,//описание погоды
            wind: data.wind.speed,//скорость ветра
            humidity: data.main.humidity,//влажность воздуха
          });
        } catch (err) {
          reject("Не удалось получить данные: " + err.message);
        }
      },
      (error) => {
        reject("Доступ к геолокации отклонён.");
      }
    );
  });
}

getCityByLocation()
  .then((data) => {
    // Дата
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

    // Вставляем данные в HTM
    document.getElementById("date").textContent = formattedDate;
    document.getElementById("time").textContent = formattedTime;
    document.getElementById("city-data").textContent =`${data.city}`;

      //console.log("Ваш город:", data.city); console.log("Температура:", data.temp, "°C"); console.log("Погода:", data.description);
      //document.getElementById("weather_icon").textContent = "🥰";
      document.getElementById("weather_temp").textContent = `${Math.round(data.temp)}°C`
      document.getElementById("weather_feels_like").textContent = `Ощущается как: ${Math.round(data.feels_like)}°C`
      document.getElementById("weather_description").textContent = data.description;
      // добавляем иконку
    setWeatherIcon(data.main);
  })
  .catch((error) => {
    console.error(error);
    alert(error);
  });

  function setWeatherIcon(main) {
  const iconEl = document.getElementById("weather_icon");

  // убираем все старые классы кроме базового "icon"
  iconEl.className = "icon";

  // словарь соответствий
  const iconMap = {
    Clear: "sun",
    Clouds: "clouds",
    Rain: "rain",
    Snow: "snow",
    Thunderstorm: "thunder",
    Drizzle: "rain",
    Mist: "mist",
    Fog: "mist",
    Haze: "mist",
    Smoke: "mist",
    Dust: "mist",
    Tornado: "thunder"
  };

  const iconClass = iconMap[main] || "default";
  iconEl.classList.add(iconClass);
}