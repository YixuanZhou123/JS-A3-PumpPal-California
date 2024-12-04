import { crimeObj } from './load-crimes.js';
import { addCrimesToList } from './crimes-list.js';
import { addCrimesToMap } from './crimes-map.js';

function initializeModal() {
    const reportBtn = document.querySelector('#report-btn');
    const reportModal = document.querySelector('#report-modal');
    const span = document.querySelector('#close');
    const modalEntry = document.querySelector('#modal-entry');
    const modalChoiceList = document.querySelector('#modal-choices');
    const submitBtn = document.querySelector('#modal-submit-btn');

    let lat = "";
    let lon = "";

    reportBtn.addEventListener("click", event => {
        reportModal.style.display = "block";
    });

    span.addEventListener("click", event => {
        reportModal.style.display = "none";
    });

    modalEntry.addEventListener('input', async function() {
        const partialAddress = modalEntry.value;
        const apiKey = 'pk.eyJ1IjoieGlhb2Zhbi05OCIsImEiOiJjbG1tYTUyeDYwZ3Z0MnJsMXp5bzlhbmhuIn0.o4NFKmmhKwaWErRm16MjHA';
        const bbox = [-75.3002, 39.8544, -74.9995, 40.0649].join(',')
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${partialAddress}.json?bbox=${bbox}&access_token=${apiKey}`;

        const resp = await fetch(url);
        const data = await resp.json();

        let html = '';
        for (const feature of data.features) {
            const placeName = feature.place_name;
            html += `<li class="modal-li" data-lat="${feature.center[1]}" data-lon="${feature.center[0]}">${placeName}</li>`;
        }

        modalChoiceList.innerHTML = html;
        

        const choices = modalChoiceList.querySelectorAll('.modal-li');
        for (const choice of choices) {
            choice.addEventListener("click", event => {
                modalEntry.value = choice.innerHTML;
                lat = choice.getAttribute('data-lat');
                lon = choice.getAttribute('data-lon');
                modalChoiceList.innerHTML = '';
            } );
        }
    });

    submitBtn.addEventListener("click", event => {
        const filters = document.querySelectorAll(".modal-input");
        const date = new Date();
        const ymd = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const hms = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        const newCrime = {
            "dispatch_date": ymd,
            "dispatch_time": hms,
            "location_block": document.querySelector('#modal-entry').value.split(",")[0],
            "text_general_code": "",
            "lat": lat,
            "lng": lon
        };


        for (const filter of filters) {
          if (filter.checked) {
            newCrime["text_general_code"] = filter.value;
            crimeObj[filter.value].push(newCrime);
            const radioGroup = document.querySelector('.radiogroup');

            break;
          }
        };

        reportModal.style.display = "none";
        
    });
};


export{
    initializeModal
}