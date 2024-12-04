function initializeContinentFilter(MigrationInfo, events) {
    const changedText = document.getElementById('changed');
    function listres(){
      changedText.textContent = this.value;
    }
    document.getElementById("continent-filter").onchange = listres;

    const searchBox = document.querySelector('#continent-filter');
    searchBox.addEventListener('input', (evt) => {
      handleConSearchBoxInput(evt, MigrationInfo.features, events);
    });
    
  }
  
  function handleConSearchBoxInput(evt, MigrationInfo, events) {
    updateFilteredCountries(MigrationInfo, events);
  }
  
  function updateFilteredCountries(MigrationInfo, events) {
    const searchBox = document.querySelector('#continent-filter');
    const lowercaseValue = searchBox.value.toLowerCase();
  
    const filteredContinents = [];
    for (const continent of MigrationInfo) {
      if (continent.properties.continent.toLowerCase().includes(lowercaseValue)) {
        filteredContinents.push(continent);
      }
    }
  
    // const filteredCountries = MigrationInfo.data.countries
    //     .filter((country) => country.name.toLowerCase().includes(lowercaseValue));
  
    const newEvent = new CustomEvent('filter-continents', { detail: { filteredContinents }});
    events.dispatchEvent(newEvent);
  }
  
  export {
    initializeContinentFilter,
  };
  