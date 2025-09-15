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

// /*для модалки подробный текущего дня*/
// export async function getOneCallWeather(lat, lon) {
//   const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&lang=ru&appid=${apiKey}`;
  
//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Ошибка загрузки One Call API");
//   return await res.json();
// }


