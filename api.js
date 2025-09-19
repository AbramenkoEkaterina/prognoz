//запросы к OpenWeather

const apiKey = "ef2ade3aeec91d0e2f6ae62a77546270";

/*общий запрос*/
export async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`
  );
  if (!response.ok) throw new Error("Ошибка получения текущей погоды");
  return response.json();
  
}

/*на 5 дней*/
export async function getForecast(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`
  );
  if (!response.ok) throw new Error("Ошибка получения прогноза");
  return response.json();
}

/* Поиск координат по названию города */
export async function getCoordsByCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  );
  if (!response.ok) throw new Error("Ошибка поиска города");

  const data = await response.json();
  if (!data.length) throw new Error("Город не найден");

  return {
    name: data[0].local_names?.ru || data[0].name,
    lat: data[0].lat,
    lon: data[0].lon
  };
}
