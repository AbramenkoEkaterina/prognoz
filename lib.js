 <script>
    const API_KEY = "YOUR_API_KEY"; // ⚡ вставь свой API ключ с openweathermap.org
    const widget = document.getElementById("widget");
    const overlay = document.getElementById("overlay");

    const backgrounds = {
      clear_day: "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?fit=crop&w=800&q=80')",
      clear_night: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?fit=crop&w=800&q=80')",
      cloudy: "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?fit=crop&w=800&q=80')",
      rain: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?fit=crop&w=800&q=80')",
      snow: "url('https://images.unsplash.com/photo-1608889175123-4e4bbfdfbea1?fit=crop&w=800&q=80')",
      thunder: "url('https://images.unsplash.com/photo-1500674425229-f692875b0ab7?fit=crop&w=800&q=80')",
    };

    function updateTime() {
      const now = new Date();
      document.getElementById("time").textContent = now.toLocaleTimeString("ru-RU", {hour: "2-digit", minute:"2-digit"});
    }
    setInterval(updateTime, 1000);
    updateTime();

    function getWeatherIcon(icon) {
      return `https:/
Current weather and forecast
Current weather and forecast
openweathermap.org


penweathermap.org/img/wn/${icon}@2x.png`;
    }

    function setBackground(weather) {
      const hour = new Date().getHours();
      let bg = backgrounds.clear_day;

      if (weather.includes("дожд")) {
        bg = backgrounds.rain;
      } else if (weather.includes("гроза")) {
        bg = backgrounds.thunder;
      } else if (weather.includes("снег")) {
        bg = backgrounds.snow;
      } else if (weather.includes("обла") || weather.includes("пасмур")) {
        bg = backgrounds.cloudy;
      } else {
        bg = (hour >= 20 || hour < 6) ? backgrounds.clear_night : backgrounds.clear_day;
      }

      widget.style.backgroundImage = bg;
    }

    function setAnimation(weather) {
      overlay.innerHTML = ""; // очищаем старую анимацию

      if (weather.includes("дожд")) {
        for (let i = 0; i < 30; i++) {
          const drop = document.createElement("div");
          drop.className = "raindrop";
          drop.style.left = Math.random() * 360 + "px";
          drop.style.animationDuration = 0.5 + Math.random() * 0.7 + "s";
          overlay.appendChild(drop);
        }
      }

      if (weather.includes("снег")) {
        for (let i = 0; i < 20; i++) {
          const snow = document.createElement("div");
          snow.className = "snowflake";
          snow.textContent = "❄";
          snow.style.left = Math.random() * 360 + "px";
          snow.style.animationDuration = 4 + Math.random() * 3 + "s";
          overlay.appendChild(snow);
        }
      }

      if (weather.includes("гроза")) {
        const flash = document.createElement("div");
        flash.className = "lightning";
        overlay.appendChild(flash);
      }
    }

    function getWeather(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          document.getElementById("location").textContent = data.name;
          document.getElementById("temperature").textContent = Math.round(data.main.temp) + "°";
          document.getElementById("details").textContent = data.weather[0].description + `, ощущается как ${Math.round(data.main.feels_like)}°`;

          const weather = data.weather[0].description.toLowerCase();
          setBackground(weather);
          setAnimation(weather);
        });

      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const forecastEl = document.getElementById("forecast");
          forecastEl.innerHTML = "";
          for (let i = 0; i < data.list.length; i += 8) {
            const item = data.list[i];
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString("ru-RU", {weekday: "short"});
            const icon = getWeatherIcon(item.weather[0].icon);
            const temp = Math.round(item.main.temp);

            forecastEl.innerHTML += `
              <div class="day">
                <div>${dayName}</div>
                <img src="${icon}" alt="">
                <div class="temp">${temp}°</div>
              </div>
            `;
          }
        });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        getWeather(lat, lon);
      }, () => {
        document.getElementById("location").textContent = "Не удалось определить местоположение";
      });
    } else {
      document.getElementById("location").textContent = "Геолокация не поддерживается";
    }
  </script>