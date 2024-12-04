function initializeplot(MigrationInfo, events) {
  
  events.addEventListener('plotChange', function(event) {
    const countryToPlot = event.detail.countryToPlot;
    //console.log(countryToPlot);
    handleSearchBoxInput(countryToPlot, MigrationInfo,events);
    
  });

  events.addEventListener('plotStop', function(event) {
    const countryToPlot = event.detail.countryToPlot;
    //console.log(countryToPlot);
    handleSearchBoxInput(countryToPlot, MigrationInfo,events);
    
  });


}

function handleSearchBoxInput(countryToPlot, MigrationInfo, events) {
  updateFilteredCountries(countryToPlot, MigrationInfo, events);
}

function updateFilteredCountries(countryToPlot, MigrationInfo, events) {
  const searchBox = countryToPlot;
  
  
  //const filteredCountries = [];
  const filteredCountriesMig = {};
  for (const country of MigrationInfo.features) {
    if (searchBox.includes(country.properties.To_Country)) {
      //filteredCountries.push(country);
  
      
      for (const year in country.properties.migdata) {
        if (!filteredCountriesMig[year]) {
          filteredCountriesMig[year] = {
            MenImmigrations: 0,
            WomenImmigrations: 0,
            MenEmigrations: 0,
            WomenEmigrations: 0
          };
        }
  
        const yearData = country.properties.migdata[year][0];
        filteredCountriesMig[year].MenImmigrations += yearData.MenImmigrations || 0;
        filteredCountriesMig[year].WomenImmigrations += yearData.WomenImmigrations || 0;
        filteredCountriesMig[year].MenEmigrations += yearData.MenEmigrations || 0;
        filteredCountriesMig[year].WomenEmigrations += yearData.WomenEmigrations || 0;
      }
    }
  };
  


  

  updateChartWithFilteredCountries(countryToPlot,filteredCountriesMig);
}

let chart1 = null;
let chart2 = null;
let chart3 = null;
let chart4 = null;
function updateChartWithFilteredCountries(countryToPlot,filteredCountries) {
  const plotContext =   countryToPlot.join(', ');
  //console.log(plotContext);
  if (chart1) {
    chart1.destroy();
  }
  if (chart2) {
    chart2.destroy();
  }
  if (chart3) {
    chart3.destroy();
  }
  if (chart4) {
    chart4.destroy();
  }
  const ctx1 = document.getElementById('myChart').getContext('2d');
  const ctx2 = document.getElementById('myChart2').getContext('2d');
  const ctx3 = document.getElementById('myChart3').getContext('2d');
  const ctx4 = document.getElementById('myChart4').getContext('2d');



  const selectedCountry = filteredCountries;

 // const years = Object.keys(filteredCountries);
  //return sum 
  

  let menImmigrationData = [];
  let womenImmigrationData = [];
  let menEmigrationData = [];
  let womenEmigrationData = [];

  const years = Object.keys(filteredCountries);

  // Extract data for each year
  years.forEach(year => {
    const yearData = filteredCountries[year];
    menImmigrationData.push(yearData.MenImmigrations || 0);
    womenImmigrationData.push(yearData.WomenImmigrations || 0);
    menEmigrationData.push(yearData.MenEmigrations || 0);
    womenEmigrationData.push(yearData.WomenEmigrations || 0);
  });



  chart1 = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: `Men Immis in ${plotContext}`,
        data: menImmigrationData,
        backgroundColor: 'rgba(56, 104, 125, 0.6)',
        borderColor: 'rgba(56, 104, 125, 1)', 
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        }
      },
    }
  });


  chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: `Women Immis in ${plotContext}`,
        data: womenImmigrationData,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)', 
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        }
      },

    }
  });


  chart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: `Men Emis in ${plotContext}`,
        data: menEmigrationData,
        backgroundColor: 'rgba(56, 104, 125, 0.6)',
        borderColor: 'rgba(56, 104, 125, 1)', 
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        }
      },
    }
  });


  chart4 = new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: `Women Emis in ${plotContext}`,
        data: womenEmigrationData,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)', 
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.5)' // Lighter grid lines
          }
        }
      },
    }
  });

  document.getElementById('download-combined-chart').addEventListener('click', downloadCombinedCharts);

  // Note:
  // This code is from a combination of CHATGPT and StackOverflow, I did not write it myself
  function renderChartToCanvas(chart) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width *5;
        canvas.height = image.height *5;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        resolve(canvas);
      };
      image.onerror = reject;
      image.src = chart.toBase64Image();
    });
  };
  

  async function downloadCombinedCharts() {
    try {
     
      const canvases = await Promise.all([
        renderChartToCanvas(chart1),
        renderChartToCanvas(chart2),
        renderChartToCanvas(chart3),
        renderChartToCanvas(chart4)
      ]);

      const combinedCanvas = document.createElement('canvas');
      const combinedCtx = combinedCanvas.getContext('2d');

      combinedCanvas.width = canvases[0].width * 2;
      combinedCanvas.height = canvases[0].height * 2;

      canvases.forEach((canvas, index) => {
        const x = (index % 2) * canvas.width;
        const y = Math.floor(index / 2) * canvas.height;
        const scaleFactor = 5; 
        combinedCtx.drawImage(canvas, x, y, canvas.width * scaleFactor, canvas.height * scaleFactor);
      });
  
      // Trigger the download
      const link = document.createElement('a');
      link.href = combinedCanvas.toDataURL('image/png');
      link.download = 'combined_charts.png';
      link.click();
  
    } catch (error) {
      console.error('Error combining charts:', error);
    }
  };
  


}



export {
  initializeplot,
  handleSearchBoxInput
};
