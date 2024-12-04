import { crimeObj } from './load-crimes.js';

let dataLayer;
let map;
let iconLayer;

function initializeMap(crimeName) {
  map = L.map('map').setView([39.96, -75.15], 13);
  const baseTileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/xiaofan-98/clo6o9kd700l701qx5iz9cm6a/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieGlhb2Zhbi05OCIsImEiOiJjbG1tYTUyeDYwZ3Z0MnJsMXp5bzlhbmhuIn0.o4NFKmmhKwaWErRm16MjHA');
  baseTileLayer.addTo(map);

  dataLayer = L.layerGroup().addTo(map);
  iconLayer = L.layerGroup().addTo(map);
  addCrimesToMap(crimeName);

} // create a new map and initialize the view for the map, return it

// add obj data to the map as markers
function addCrimesToMap(crimeName) {
  dataLayer.clearLayers();

  for (const crime of crimeObj[crimeName]) {
    const marker = L.circleMarker([crime.lat, crime.lng], {
      radius: 3,
      title: crime.text_general_code,
      alt: crime.text_general_code,
      fillColor: getColor(crime.text_general_code),
      fillOpacity: 0.7,
      weight: 6,
      color: getColor(crime.text_general_code),
      opacity: 0.1,
    });
    dataLayer.addLayer(marker);
    
  }
}

// set color for each type of crime
function getColor(crimeName) {
  switch(crimeName) {
    case 'Aggravated Assault':
      return 'rgb(84,193,225)';
    case 'Burglary':
      return 'rgb(240,109,101)';
    case 'Drug Violations':
      return 'rgb(242,133,60)';
    case 'Fraud':
      return 'rgb(122,113,219)';
    case 'Other Assaults':
      return 'rgb(18,103,166)';
    case 'Other Crimes':
      return 'rgb(153,153,153)';
    case 'Rape':
      return 'rgb(241,178,90)';
    case 'Robbery':
      return 'rgb(87,194,184)';
    case 'Sex Offenses':
      return 'rgb(241,178,90)';
    case 'Thefts':
      return 'rgb(22,139,138)';
    case 'Vandalism':
      return 'rgb(153,153,153)';
    case 'Weapon Violations':
      return 'rgb(139,104,186)';
    default:
      return 'rgb(153,153,153)';
  }
}


// add searched location to map as an icon
function addSearchLocation(lat, lng) {
  iconLayer.clearLayers();

  const icon = L.icon({
    iconUrl: './img/add_location.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [48, 48], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [24, 0], // point of the icon which will correspond to marker's location
    // //shadowAnchor: [4, 62],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  const marker = L.marker([lat, lng], {
    icon: icon
  });

  iconLayer.addLayer(marker);

  map.setView([lat, lng], 16, 2000);
}


export {
  initializeMap,
  addCrimesToMap,
  addSearchLocation
}; // export the function, so we could use it in main.js
