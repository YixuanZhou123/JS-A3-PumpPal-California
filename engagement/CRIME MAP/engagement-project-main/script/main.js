import { initializeMap, addSearchLocation } from './crimes-map.js';
import { initializeList } from './crimes-list.js';
import { initializeAddressEntry } from './address-entry.js';
import { initFilters } from './filters.js';
import { initializeModal } from './add-a-crime.js';

initFilters();
initializeMap("Aggravated Assault");
initializeList("Aggravated Assault");
initializeAddressEntry();
initializeModal();

// const options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0,
// };
  
// function success(pos) {
//     const crd = pos.coords;
//     addSearchLocation(crd.latitude, crd.longitude);
// };

// function error(err) {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
// };
  
// navigator.geolocation.getCurrentPosition(success, error, options);