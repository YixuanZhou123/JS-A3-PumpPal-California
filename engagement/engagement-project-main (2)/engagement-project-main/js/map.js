function initializeMap(MigrationInfo, events) {
  const map = L.map('map').setView([39.95, -75.16], 3); // center of Philadelphia

  L.tileLayer('https://api.mapbox.com/styles/v1/ltscqian/clop0wsxp00cr01qq0kjz1du0/tiles/256/{z}/{x}/{y}@2x?access_token={apiKey}', {
    apiKey: 'pk.eyJ1IjoibHRzY3FpYW4iLCJhIjoiY2t1MGhqcDc2MWU2dzJ1dGh1MnRlanJkYiJ9.evZuw4tNS1sR4QF9vta6xQ',
    maxZoom: 14,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  }).addTo(map);

  const CountryLayer = L.layerGroup(); 
  CountryLayer.addTo(map); 

  const LineLayer = L.layerGroup(); 
  LineLayer.addTo(map); 

  const plotLayer = L.layerGroup();
  plotLayer.addTo(map);

  updateWorldMap(MigrationInfo.features, CountryLayer,LineLayer); // add all the countries to the map

  /*
  events.addEventListener('filter-countries', (evt) => { 
    const filteredCountries = evt.detail.filteredCountries;
    //console.log(filteredCountries);
    //这里还没写好，需要把处理[0]
    updateWorldMap(filteredCountries, CountryLayer,LineLayer,plotLayer);
  });*/
  /*
  events.addEventListener('focus-country', (evt) => {
    const countryName = evt.detail.countryName;
    CountryLayer.eachLayer((CountryLayer) => {
      if (CountryLayer.countryName === countryName) {
        
        CountryLayer.openPopup();
      }
    });
  });*/
  return map;
}


function updateWorldMap(geojsonData, CountryLayer, LineLayer) {
  CountryLayer.clearLayers(); 
  LineLayer.clearLayers(); 



  const greenlandCoords = [71.706936, -42.604303];
  
  const geoJsonLayer = L.geoJSON(geojsonData, {
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        
        const popupContent = `
          <h2 class="country-name">${feature.properties.To_Country}</h2>
          <canvas id="mypieChart1"></canvas>
          <p class="continent">Continent: ${feature.properties.continent}</p>
          <p class="area_km2">Area (km<sup>2</sup>): ${feature.properties.area_km2.toLocaleString()}</p>
          <p class="pop">Population: ${feature.properties.pop.toLocaleString()}</p>
          <p class="lifeExp">Life Expectancy: ${feature.properties.lifeExp.toFixed(2)}</p>
          <p class="gdpPercap">GDP per Capita: $${feature.properties.gdpPercap.toFixed(2)}</p>
        `;

       
        layer.bindPopup(popupContent);

      };



      layer.on('click', function (e) {

        //console.log(e.target.feature.properties.To_Country);
        geoJsonLayer.resetStyle();

        e.target.setStyle({
          color: 'yellow', 
          fillColor: 'transparent',
          fillOpacity: 0.7, 
          weight: 2 
        });

/*
        const popupContent = `
        <h2 class="country-name">${e.target.feature.properties.To_Country}</h2>
        <canvas id="mypieChart1"></canvas>
        <p class="continent">Continent: ${e.target.feature.properties.continent}</p>
        <p class="area_km2">Area (km<sup>2</sup>): ${e.target.feature.properties.area_km2.toLocaleString()}</p>
        <p class="pop">Population: ${e.target.feature.properties.pop.toLocaleString()}</p>
        <p class="lifeExp">Life Expectancy: ${e.target.feature.properties.lifeExp.toFixed(2)}</p>
        <p class="gdpPercap">GDP per Capita: $${e.target.feature.properties.gdpPercap.toFixed(2)}</p>
      `;
      layer.bindPopup(popupContent).openPopup();*/


        // Draw a line from Greenland to the clicked country
      const clickedCountryCoords = e.latlng;
      const latlngs = [greenlandCoords, [clickedCountryCoords.lat, clickedCountryCoords.lng]];
      const polyline = L.polyline(latlngs, { color: 'red' }).addTo(LineLayer);
        
        // Center the map on the clicked country
       // e.target._map.fitBounds(e.target.getBounds());

       
      
      LineLayer.clearLayers();
        
      LineLayer.addLayer(polyline);

      updatePieChartWithFilteredCountries(e.target.feature);
      });
    },
    style: {
      color: 'blue', 
      fillColor: '#f2f2f2',
      fillOpacity: 0.2, 
      weight: 2
    }
  }).addTo(CountryLayer);
  

  geoJsonLayer.on('popupclose', function (e) {
    geoJsonLayer.resetStyle(e.target);
    LineLayer.clearLayers(); // Remove the line when the popup is closed
    
  });
}
//updatePieChartWithFilteredCountries(feature.properties);


let pieChart1 = null;

function updatePieChartWithFilteredCountries(filteredCountries) {
  if (pieChart1) {
    pieChart1.destroy();
  };

 // const ctx4 = document.getElementById('mypieChart1').getContext('2d');
  const selectedCountry = filteredCountries;
  const years = Object.keys(selectedCountry.properties.migdata);


  // Initialize sums
  let MenImmigrations = 0;
  let MenEmigrations = 0;
  let WomenImmigrations = 0;
  let WomenEmigrations = 0;

  // Loop through each year and add up the values
  for (const year of years) {
    const yearData = selectedCountry.properties.migdata[year];
    MenImmigrations += yearData[0].MenImmigrations;
    MenEmigrations += yearData[0].MenEmigrations;
    WomenImmigrations += yearData[0].WomenImmigrations;
    WomenEmigrations += yearData[0].WomenEmigrations;
  }

//console.log({ MenImmigrations, MenEmigrations, WomenImmigrations, WomenEmigrations }); 

  /*const sums = years.reduce((accumulator, year) => {
    const yearData = selectedCountry.properties.migdata[year];
    accumulator.MenImmigrations += yearData[0].MenImmigrations;
    accumulator.MenEmigrations += yearData[0].MenEmigrations;
    accumulator.WomenImmigrations += yearData[0].WomenImmigrations;
    accumulator.WomenEmigrations += yearData[0].WomenEmigrations;
    return accumulator;
  }, { MenImmigrations: 0, MenEmigrations: 0, WomenImmigrations: 0, WomenEmigrations: 0 });
  
  console.log(sums);*/
  



  const piedata = {
    labels: ['Men Immigrations', 'Men Emigrations', 'Women Immigrations', 'Women Emigrations'],
    datasets: [{
        label: 'Migration Data',
        data: [MenImmigrations, MenEmigrations, WomenImmigrations, WomenEmigrations],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
    }]
};

// Config
const config = {
    type: 'pie',
    data: piedata,
};

// Render the chart
 pieChart1 = new Chart(
    document.getElementById('mypieChart1'),
    config
);

  /*const menImmigrationData = years.map(year => {
    const yearData = selectedCountry.properties.migdata[year];
    return yearData[0].MenImmigrations;
  });*/

  //console.log(menImmigrationData);

  /*pieChart1 = new Chart(ctx4, {
    type: 'pie',
    data: {
      labels: years,
      datasets: [{
        label: `Men Immigrations in ${selectedCountry.properties.To_Country}`,
        data: menImmigrationData,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  console.log(pieChart1);
}
*/

/*
function updatePieChartWithFilteredCountries(filteredCountries) {
  //How to remove all the data from the chart??
 
  if (pieChart1) {
    pieChart1.destroy();
  }
  
  const ctx4 = document.getElementById('mypieChart1').getContext('2d');
  
  const selectedCountry = filteredCountries;
  const years = Object.keys(selectedCountry.properties.migdata);
  const menImmigrationData = years.map(year => {
    const yearData = selectedCountry.properties.migdata[year];
    return yearData[0].MenImmigrations;
  });

  pieChart1 = new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: `Men Immigrations in ${selectedCountry.properties.To_Country}`,
        data: menImmigrationData,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        },
        
      }
    }
  });*/
}



//updateClickPopup();



export {
  initializeMap,
};
