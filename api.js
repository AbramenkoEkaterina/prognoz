//запросы к OpenWeather

const apiKey = "ef2ade3aeec91d0e2f6ae62a77546270";

export async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`
  );
  if (!response.ok) throw new Error("Ошибка получения текущей погоды");
  return response.json();
}

export async function getForecast(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`
  );
  if (!response.ok) throw new Error("Ошибка получения прогноза");
  return response.json();
}

