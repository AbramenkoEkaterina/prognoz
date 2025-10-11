//работа с координатами
//встроенный объект, позволяет узнать метоположение через gps, wi-fi, ip
export function getCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Геолокация не поддерживается");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => reject("Доступ к геолокации отклонён")
    );
  });
}
