import { initializeMap, updateMapStations } from './map.js';
import { initializeSearch } from './search.js';
import './checkbox.js';
import './search.js';

const stationGeoJSON = await fetch('./data/test.geojson');
export const stationInfo = await stationGeoJSON.json(); // Export stationInfo for other modules

const events = new EventTarget();

// Initialize map and search functionality
const stationLayer = initializeMap(stationInfo, events);
initializeSearch(stationInfo, events);

// Listen for filter-stations event
events.addEventListener('filter-stations', (evt) => {
  const { filteredStations } = evt.detail;

  // Update the map with filtered stations
  updateMapStations(filteredStations, stationLayer);

  // Update the station list
  updateStationList(filteredStations);
});

// Trigger initial load of all stations
updateStationList(stationInfo.features);


function updateStationList(stations) { 
  const listElement = document.querySelector('.station-list ol');
  listElement.innerHTML = ''; // Clear existing list

  // Deduplicate stations based on address, city, and overall_rating
  const uniqueStations = [];
  const seenKeys = new Set();

  stations.forEach((station) => {
    const key = `${station.properties.address_1}-${station.properties.city}-${station.properties.overall_rating}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueStations.push(station);
    }
  });

  // Render the deduplicated and filtered stations
  uniqueStations.forEach((station) => {
    const listItem = document.createElement('li');
    listItem.classList.add('station-item');
    listItem.innerHTML = `
      <div class="city">${station.properties.city || 'N/A'}</div>
      <div class="address">${station.properties.address_1 || 'N/A'}</div>
      <div class="overall_rating">Rating: ${station.properties.overall_rating || 'N/A'}</div>
    `;

    // Add click event to focus on the station on the map
    listItem.addEventListener('click', () => {
      const coordinates = station.geometry.coordinates;
      const latLng = [coordinates[1], coordinates[0]];

      // Ensure the map instance is available before attempting to set the view
      if (typeof map !== 'undefined') {
        map.setView(latLng, 15); // Zoom to level 15 and center on the station
      } else {
        console.error("Map instance is not defined.");
      }
    });

    // Append the station to the list
    listElement.appendChild(listItem);
  });
}


// function focusOnMap(stadium, index, events){
//   const mapZoomSelect = stadium.ID; // .dataset is get the attribute in html (get your customized attribute!)

//   // define a customized event
//   const zoomId = new CustomEvent('zoom-map', { detail: { mapZoomSelect }}); // define your own event
//   events.dispatchEvent(zoomId);
// } 





// Add the combined filtering logic:
function applyFilters() {
  const searchText = document.querySelector('#search-box').value.toLowerCase();
  const filterType = document.querySelector('#city').checked ? 'city' : 'address_1';
  const selectedProducts = Array.from(document.querySelectorAll('.checkbox input[type="checkbox"]:checked'))
    .filter((checkbox) => checkbox.id !== 'SelectAll')
    .map((checkbox) => checkbox.value);
  const minRating = parseFloat(document.querySelector('#rating-slider').value);

  // Apply all filters
  const filteredStations = stationInfo.features.filter((feature) => {
    const properties = feature.properties;

    const matchesSearchText =
      properties[filterType] && properties[filterType].toLowerCase().includes(searchText);

    const matchesProducts =
      selectedProducts.length === 0 ||
      selectedProducts.some((product) => (properties.product_name || '').toLowerCase().includes(product.toLowerCase()));

    const matchesRating = parseFloat(properties.overall_rating || 0) >= minRating;

    return matchesSearchText && matchesProducts && matchesRating;
  });

  // Dispatch event to update map and station list
  const event = new CustomEvent('filter-stations', { detail: { filteredStations } });
  events.dispatchEvent(event);
}

// Attach event listeners to all filters
document.querySelector('#search-box').addEventListener('input', applyFilters);
document.querySelectorAll('.checkbox input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener('change', applyFilters);
});
document.querySelector('#rating-slider').addEventListener('input', applyFilters);





// Toolbar

const searchButton = document.getElementById('search-btn');
const shareButton = document.getElementById('share-btn');

// Elements to toggle
const addressFilter = document.querySelector('.address-filter');
const checkboxSection = document.querySelector('.checkbox');
const stationListSection = document.querySelector('.station-list');
const ratingFilter = document.getElementById('rating-filter');

// Event listeners
searchButton.addEventListener('click', () => {
  searchButton.classList.add('selected');
  shareButton.classList.remove('selected');
  addressFilter.style.display = 'block';
  checkboxSection.style.display = 'block';
  stationListSection.style.display = 'block';
  ratingFilter.style.display = 'block';
});

shareButton.addEventListener('click', () => {
  shareButton.classList.add('selected');
  searchButton.classList.remove('selected');
  addressFilter.style.display = 'none';
  checkboxSection.style.display = 'none';
  stationListSection.style.display = 'none';
  ratingFilter.style.display = 'none';
});




// Rating Slider

const ratingSlider = document.getElementById('rating-slider');
const sliderValueDisplay = document.getElementById('slider-value');

// Update the slider value
ratingSlider.addEventListener('input', () => {
  const minValue = parseFloat(ratingSlider.value);
  sliderValueDisplay.textContent = `Rating: ${minValue.toFixed(1)}`;

  // Filter stations based on rating
  const filteredStations = stationInfo.features.filter((feature) => {
    const rating = parseFloat(feature.properties.overall_rating) || 0.0;
    return rating >= minValue; // Show only stations with a rating >= slider value
  });

  // Dispatch an event to update map and station list
  const event = new CustomEvent('filter-stations', { detail: { filteredStations } });
  events.dispatchEvent(event);
});





// Share Section
// Station Information
const cityDropdown = document.querySelector('#city-dropdown');
const stationDropdown = document.querySelector('#station-dropdown');
const stationAddressDisplay = document.querySelector('#station-address');

// Populate city dropdown with unique cities from geojson
function populateCityDropdown(geojson) {
  const cities = [...new Set(geojson.features.map((feature) => feature.properties.city))];
  cityDropdown.innerHTML = '<option value="" selected>Please select</option>';
  cities.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityDropdown.appendChild(option);
  });
  cityDropdown.disabled = false;
}

// Populate station dropdown based on the selected city
function populateStationDropdown(geojson, selectedCity) {
  const seenStations = new Map(); // Use a Map to merge stations with the same name
  geojson.features.forEach((feature) => {
    const stationName = feature.properties.loc_name;
    const cityName = feature.properties.city;
    const address = feature.properties.address_1;

    // If no city is selected or station matches the city, consider it
    if (!selectedCity || cityName === selectedCity) {
      if (!seenStations.has(stationName)) {
        seenStations.set(stationName, address); // Store unique station and its address
      }
    }
  });

  // Populate the station dropdown
  stationDropdown.innerHTML = '<option value="" selected>Please select</option>';
  seenStations.forEach((address, name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    option.dataset.address = address; // Store the address for display later
    stationDropdown.appendChild(option);
  });

  stationDropdown.disabled = false; // Enable the dropdown
}


// Display station address based on the selected station
// Display Station Address
stationDropdown.addEventListener('change', () => {
  const selectedStation = stationDropdown.options[stationDropdown.selectedIndex];
  stationAddressDisplay.textContent = `Address: ${selectedStation.dataset.address || 'N/A'}`;
});

// Event listeners for city and station dropdowns
cityDropdown.addEventListener('change', () => {
  const selectedCity = cityDropdown.value;
  populateStationDropdown(stationInfo, selectedCity);
  stationAddressDisplay.textContent = '';
});

stationDropdown.addEventListener('change', () => {
  const selectedStationName = stationDropdown.value;
  displayStationAddress(selectedStationName);
});

// Initial population of dropdowns
populateCityDropdown(stationInfo);
populateStationDropdown(stationInfo, null);










// sharing information 

// 1. product name
const productTypeDropdown = document.querySelector('#product-type');

// Populate Product Type Dropdown
function populateProductTypeDropdown(stationInfo, selectedStation) {
  let products = new Set(); // Use a Set to avoid duplicates

  // Iterate through all stations in the GeoJSON data
  stationInfo.features.forEach((feature) => {
    const properties = feature.properties;

    // Add product names if the station matches or if no station is selected
    if (!selectedStation || properties.loc_name === selectedStation) {
      const productNames = properties.product_name.split(','); // Assuming product names are comma-separated
      productNames.forEach((name) => products.add(name.trim()));
    }
  });

  // Populate the dropdown
  productTypeDropdown.innerHTML = '<option value="" selected>Please select</option>';
  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product;
    option.textContent = product;
    productTypeDropdown.appendChild(option);
  });

  // Enable the dropdown
  productTypeDropdown.disabled = false;
}

// Event listener for station selection
stationDropdown.addEventListener('change', () => {
  const selectedStation = stationDropdown.value;
  populateProductTypeDropdown(stationInfo, selectedStation);
});

// Initialize dropdown with all product types when no station is selected
populateProductTypeDropdown(stationInfo, null);



//2.Unit Price
const unitPriceInput = document.querySelector("#unit-price");
const priceValidation = document.querySelector("#price-validation");

//Validate Unit Price Input
unitPriceInput.addEventListener("input", () => {
  const value = parseFloat(unitPriceInput.value);
  if (isNaN(value) || value < 0 || value > 10) {
    priceValidation.textContent = "Please enter numbers between 0 and 10.";
  } else {
    priceValidation.textContent = ""; // Clear error
  }
});



//3.overall rating
// Input Validation for Overall Rating
const overallRatingInput = document.querySelector('#overall-rating');
const overallRatingError = document.querySelector('#overall-rating-error');

// Validate Overall Rating
overallRatingInput.addEventListener('input', () => {
  const value = parseFloat(overallRatingInput.value);
  if (isNaN(value) || value < 0 || value > 5) {
    overallRatingError.textContent = 'Please enter a number from 0 to 5.';
    shareButton.disabled = true;
  } else {
    overallRatingError.textContent = '';
    shareButton.disabled = false;
  }
});



//4.comment
// Reference to the comment input and error container
const commentInput = document.querySelector('#comment');
const commentError = document.querySelector('#comment-validation-error');

// Validation for comment field
commentInput.addEventListener('input', () => {
  const words = commentInput.value.trim().split(/\s+/); // Split by whitespace
  if (words.length > 20) {
    commentError.textContent = 'Only comments within 20 words are allowed';
    commentInput.value = words.slice(0, 20).join(' '); // Trim to 20 words
  } else {
    commentError.textContent = ''; // Clear the error if within limit
  }
});




// Firebase Upload on 'Sharing a Fueling Experience'
shareButton.addEventListener('click', async () => {
  const comment = commentInput.value.trim();

  if (!comment) {
    commentError.textContent = 'Please enter a comment within 20 words.';
    return;
  }

  // Existing station data handling...
  const timestamp = new Date().toISOString();
  const stationData = stationInfo.features.find(
    (feature) => feature.properties.city === city && feature.properties.loc_name === station
  );

  const { geometry: { coordinates }, properties: { address_1: address } } = stationData;

  const newData = {
    city,
    station,
    address,
    product_type: productType,
    price_current: unitPrice,
    overall_rating: overallRating,
    comment,
    DATE_SCRAPED: timestamp,
    latitude: coordinates[1],
    longitude: coordinates[0],
  };

  try {
    const db = firebase.firestore();
    await db.collection('fuelingExperiences').add(newData);
    alert('Fueling experience submitted successfully!');

    // Reset fields after submission
    commentInput.value = '';
    document.querySelector('#unit-price').value = '';
    overallRatingInput.value = '';

    // Display latest 5 comments
    displayLatestComments(city, station);

  } catch (error) {
    console.error('Error uploading data to Firebase:', error);
    alert('An error occurred. Please try again.');
  }
});

// Display the latest 5 comments for a station
async function displayLatestComments(city, station) {
  const db = firebase.firestore();
  const querySnapshot = await db
    .collection('fuelingExperiences')
    .where('city', '==', city)
    .where('station', '==', station)
    .orderBy('DATE_SCRAPED', 'desc')
    .limit(5)
    .get();

  const commentsContainer = document.querySelector('#comments-container'); // Add this in HTML
  commentsContainer.innerHTML = ''; // Clear existing comments

  querySnapshot.forEach((doc) => {
    const { comment, DATE_SCRAPED } = doc.data();
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment-item');
    commentElement.innerHTML = `
      <p>${comment}</p>
      <small>${new Date(DATE_SCRAPED).toLocaleString()}</small>
    `;
    commentsContainer.appendChild(commentElement);
  });
}




// 5. Sharing a Fueling Experience
shareButton.addEventListener('click', async () => {
  const city = document.querySelector('#city-dropdown').value;
  const station = document.querySelector('#station-dropdown').value;
  const productType = document.querySelector('#product-type').value;
  const unitPrice = parseFloat(document.querySelector('#unit-price').value);
  const overallRating = parseFloat(overallRatingInput.value);
  const comment = document.querySelector('#comment').value;

  if (!city || !station || !productType || isNaN(unitPrice) || isNaN(overallRating) || !comment) {
    alert('Please fill out all fields correctly.');
    return;
  }

  // Fetch latitude and longitude from station info
  const stationData = stationInfo.features.find(
    (feature) =>
      feature.properties.city === city && feature.properties.loc_name === station
  );
  const { geometry: { coordinates }, properties: { address_1: address } } = stationData;

  const timestamp = new Date().toISOString();

  // Firebase Data
  const newData = {
    city,
    station,
    address,
    product_type: productType,
    price_current: unitPrice,
    overall_rating: overallRating,
    comment,
    DATE_SCRAPED: timestamp,
    latitude: coordinates[1],
    longitude: coordinates[0],
  };

  // Upload to Firebase
  try {
    const db = firebase.firestore();
    await db.collection('fuelingExperiences').add(newData);
    alert('Fueling experience submitted successfully!');

    // Reset Input Fields
    overallRatingInput.value = '';
    document.querySelector('#unit-price').value = '';
    document.querySelector('#comment').value = '';

    // Update Average Rating
    updateAverageRating(city, station, productType);
  } catch (error) {
    console.error('Error uploading data to Firebase:', error);
    alert('An error occurred. Please try again.');
  }
});

// Update Average Rating
async function updateAverageRating(city, station, productType) {
  const db = firebase.firestore();

  // Fetch all ratings for the same product type at the same station
  const querySnapshot = await db
    .collection('fuelingExperiences')
    .where('city', '==', city)
    .where('station', '==', station)
    .where('product_type', '==', productType)
    .get();

  const ratings = [];
  querySnapshot.forEach((doc) => {
    ratings.push(doc.data().overall_rating);
  });

  // Calculate Average
  const averageRating =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  // Update Display
  const stationList = document.querySelector('.station-list');
  stationList.querySelector(
    `li[data-station="${station}"] .overall_rating`
  ).textContent = `Rating: ${averageRating.toFixed(1)}`;

  // Update Popup
  const popup = stationLayer.getPopup();
  if (popup.isOpen() && popup.getContent().includes(station)) {
    popup.setContent(popup.getContent().replace(/Rating: \d+(\.\d+)?/, `Rating: ${averageRating.toFixed(1)}`));
  }
}
