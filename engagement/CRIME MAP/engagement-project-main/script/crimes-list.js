import { crimeObj } from './load-crimes.js';


// set the default location
let lat = 39.952111;
let lng = -75.192297;


function initializeList(crimeName) {
  addCrimesToList(crimeName);
};

function updateLocation(newLat, newLng) {
  lat = newLat;
  lng = newLng;
};

function addCrimesToList(crimeName) {
  const crimeList = document.querySelector('.crime-list');
  const crimes = crimeObj[crimeName];


  // sort crimes by distance
  crimes.sort((left, right) => (calculateDistance(left.lat, left.lng, lat, lng) - calculateDistance(right.lat, right.lng, lat, lng)));


  // populate crime list
  let html = '';
  for (const crime of crimes) {
    const name = crime.text_general_code;
    const time = crime.dispatch_date + " " + crime.dispatch_time;
    const location = crime.location_block;
    const distance = calculateDistance(crime.lat, crime.lng, lat, lng).toFixed(2);

    const crimeListItemHTML = `
        <li><div class="each-crime"><div class="crime-info">
              <div class="crime-name">${name}</div>
              <div class="crime-location">${location}</div>
              <div class="crime-time">${time}</div>
            </div>
            <div class="crime-distance">${distance}mi</div>
        </div></li>`;
    html += crimeListItemHTML;
  }
  crimeList.innerHTML = html;

}

// calculate the distance between two points on map
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusMiles = 3958.8; // Radius of the Earth in miles

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusMiles * c;

  return distance;
}

export {
  initializeList,
  addCrimesToList,
  updateLocation,
};
