function initializeList(MigrationInfo, events,countryToPlot) {

  

  updateCountryList(MigrationInfo.features, events,countryToPlot);

  events.addEventListener('filter-countries', (evt) => {
    const filteredCountries = evt.detail.filteredCountries;
    updateCountryList(filteredCountries, events,countryToPlot);
  });

  checkIfClearCountryFilter(countryToPlot,events) 
}

function checkIfClearCountryFilter(countryToPlot,events){ 
  const clearButton = document.getElementById('clear-country-filter');
  const paragraph = document.querySelector('#selected-countries');
  
  clearButton.addEventListener('click', () => {
    countryToPlot.length = 0; 
    paragraph.textContent =  countryToPlot.join(', ');
    document.querySelectorAll('.country-checkbox').forEach(checkbox => {
      checkbox.checked = false;
    });
    const eventPlotStop = new CustomEvent('plotStop', { detail: { countryToPlot } });
    events.dispatchEvent(eventPlotStop);
  });

}

function updateCountryList(countries, events,countryToPlot) {
  const countryList = document.querySelector('#country-list'); 
  let html = '';

  for (const country of countries) {
    html += `
      <li data-country-hovor="${country.properties.To_Country}" >
        <input type="checkbox" class="country-checkbox" value="${country.properties.To_Country}">
        ${country.properties.To_Country} 
      </li>
    `;
  }
  countryList.innerHTML = html;

  /*for (const li of countryList.querySelectorAll('li')) {
    li.addEventListener('mouseover', (evt) => {
      //console.log(evt.target.dataset.countryHovor);
      const countryName = evt.target.dataset.countryHovor;
      const newEvent = new CustomEvent('focus-country', {
        detail: { countryName },
      });
      events.dispatchEvent(newEvent);
    });
  }*/
  document.querySelectorAll('.country-checkbox').forEach(checkbox => {
    if(countryToPlot.includes(checkbox.value)){
      checkbox.checked = true;};
    checkbox.addEventListener('change', () => {handleCheckboxChange(events,countryToPlot)});
    //checkbox.addEventListener('change', () => {handleCheckboxChange(events,countryToPlot)});
  });
  const paragraph = document.querySelector('#selected-countries');
  paragraph.textContent = countryToPlot.join(', ');
}

function handleCheckboxChange(events,countryToPlot) {

  document.querySelectorAll('.country-checkbox').forEach(checkbox => {
    if(!checkbox.checked && countryToPlot.includes(checkbox.value)){
      countryToPlot = countryToPlot.filter(item => item !== checkbox.value);};
    if(checkbox.checked && !countryToPlot.includes(checkbox.value)){
        countryToPlot.push(checkbox.value);
      }
  } );

  // Update the paragraph with selected country names
  const paragraph = document.querySelector('#selected-countries');
  paragraph.textContent =  countryToPlot.join(', ');
  //console.log(countryToPlot);

  const eventPlot = new CustomEvent('plotChange', { detail: { countryToPlot } });
  events.dispatchEvent(eventPlot);
}


export {
  initializeList,
};

