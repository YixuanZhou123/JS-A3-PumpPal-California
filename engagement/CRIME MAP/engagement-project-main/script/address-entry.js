import { addCrimesToList, updateLocation } from './crimes-list.js';
import { addSearchLocation } from './crimes-map.js';

function initializeAddressEntry() {
  const addressEntry = document.querySelector('#address-entry');
  const addressChoiceList = document.querySelector('#address-choices');

  addressEntry.addEventListener('input', async function() {
    const partialAddress = addressEntry.value;
    const apiKey = 'pk.eyJ1IjoieGlhb2Zhbi05OCIsImEiOiJjbG1tYTUyeDYwZ3Z0MnJsMXp5bzlhbmhuIn0.o4NFKmmhKwaWErRm16MjHA';
    const bbox = [-75.3002, 39.8544, -74.9995, 40.0649].join(',')
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${partialAddress}.json?bbox=${bbox}&access_token=${apiKey}`;

    const resp = await fetch(url);
    const data = await resp.json();

    let html = '';
    for (const feature of data.features) {
      const placeName = feature.place_name;
      html += `<li class="search-li" data-lat="${feature.center[1]}" data-lon="${feature.center[0]}">${placeName}</li>`;
    }

    addressChoiceList.innerHTML = html;
    

    const choices = addressChoiceList.querySelectorAll('.search-li');
    for (const choice of choices) {
      choice.addEventListener("click", event => {
        addressEntry.value = choice.innerHTML;
        addressChoiceList.innerHTML = '';

        updateLocation(choice.getAttribute('data-lat'), choice.getAttribute('data-lon'));

        addSearchLocation(choice.getAttribute('data-lat'), choice.getAttribute('data-lon'));

        const filters = document.querySelectorAll(".filter-input");
        for (const filter of filters) {
          if (filter.checked) {
            addCrimesToList(filter.value);
            break;
          }
        }

      } );
    }

  });
}

export {
  initializeAddressEntry,
};
