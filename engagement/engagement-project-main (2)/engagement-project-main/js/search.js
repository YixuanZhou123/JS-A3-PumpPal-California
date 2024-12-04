function initializeSearch(MigrationInfo, events) {
  const searchBox = document.querySelector('#country-name-filter');
  searchBox.addEventListener('input', () => {
    updateFilteredCountries(MigrationInfo.features, events);
  });
  document.getElementById('clear-filter-button').addEventListener('click', clearAllSearch);
}


function updateFilteredCountries(MigrationInfo, events) {
  const searchBox = document.querySelector('#country-name-filter');
  const lowercaseValue = searchBox.value.toLowerCase();
  
  const filteredCountries = [];
  for (const country of MigrationInfo) {
    
    if (country.properties.To_Country.toLowerCase().includes(lowercaseValue)) {
      filteredCountries.push(country);
    }
  }

  //
  // 

  const newEvent = new CustomEvent('filter-countries', { detail: { filteredCountries }});
  events.dispatchEvent(newEvent);
}

function clearAllSearch() {

  document.getElementById("country-name-filter").value = "";
} 

export {
  initializeSearch,
};
