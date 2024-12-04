import { initializeMap } from './map.js';
import { initializeList } from './list.js';
import { initializeSearch } from './search.js';
//import { initializeContinentFilter } from './filterCon.js'; 
import { initializeplot } from './plot.js';
import { handleSearchBoxInput } from './plot.js';
import { updateUrl } from './updateUrl.js';
import { showSupport } from './showSupport.js';


const MigrationInfoResp = await fetch('https://raw.githubusercontent.com/ObjQIAN/story-map-project-SW/main/templates/grnImFinal.geojson');
const MigrationInfo = await MigrationInfoResp.json();
var countryToPlot = [];
const events = new EventTarget();


function initializeFromUrl(events,MigrationInfo) {
    const params = new URLSearchParams(window.location.search);
    const countryToPlotProto = params.get('country');
    if (countryToPlotProto) {

      
      countryToPlot = countryToPlotProto.split(',');
      //console.log(countryToPlot);
      handleSearchBoxInput(countryToPlot, MigrationInfo,events);
      const loadPage = new CustomEvent('loadPage', { detail: { countryToPlot } });
      events.dispatchEvent(loadPage);
    
    };
    
  }
  
  // When the page loads
  document.addEventListener("DOMContentLoaded", initializeFromUrl(events,MigrationInfo));


initializeMap(MigrationInfo, events);
initializeList(MigrationInfo, events,countryToPlot);
initializeSearch(MigrationInfo, events);
//initializeContinentFilter(MigrationInfo, events);
initializeplot(MigrationInfo, events,countryToPlot);
updateUrl(events) ;
showSupport()