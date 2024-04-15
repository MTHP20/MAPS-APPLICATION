// Initalise Leaflet map
var map = L.map('map', {
  maxZoom: 18,
  minZoom: 7,
  zoomControl: false
}).setView([51.505, -0.09], 13);

// Variables for marker handling
var isDoubleClick = false;
var tempMarker = null;
var floatingWindow = document.getElementById('floating-window');
var markerShown = false;

// Add zoom control to the map
L.control.zoom({
  position: 'bottomright'
}).addTo(map);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  serviceWorker: true
}).addTo(map);

// Event listener for single click on the map
map.on('click', function (e) {
  if (!isDoubleClick) {
    var lat = e.latlng.lat.toFixed(6);
    var lon = e.latlng.lng.toFixed(6);
    if (markerShown) {
      resetMarkerAndWindow();
    } else {
      tempMarker = L.marker([lat, lon], { draggable: false }).addTo(map);
      geoCode(lat, lon)
        .then(data => {
          var placeName = data.address ? (data.address.city || data.address.town || data.address.village || data.address.hamlet || "N/A") : "N/A";
          var postcode = data.address ? (data.address.postcode || "N/A") : "N/A";
          var country = data.address ? (data.address.country || "N/A") : "N/A";
          floatingWindow.style.display = 'block';
          var content = postcode + '<br>' + country + '<br>' + lat + ', ' + lon;
          if (placeName !== "N/A") {
            content = placeName + '<br>' + content;
          }
          content += '</div>' + '<br>';
          content += '<button id="saveLocationButton" onclick="saveLocationButton()">💾</button>';
          floatingWindow.innerHTML = content;
          floatingWindow.style.display = 'block';
        })
        .catch(error => {
          console.error('Error:', error);
        });
      markerShown = true;
    }
  }
  isDoubleClick = false;
  clearPreviousSearches();
});

// Event listener for double click on the map
map.on('dblclick', function (e) {
  map.zoomIn();
  resetMarkerAndWindow();
  isDoubleClick = true;
  setTimeout(() => {
    map.getContainer().style.cursor = 'default';
  }, 1000);
});

// Event listener for map move start
map.on('movestart', function (e) {
  resetMarkerAndWindow();
  clearPreviousSearches();
});

/**
 * Retrieves location details from coordinates using reverse geocoding.
 *
 * @param {*} lat The latitude coordinate.
 * @param {*} lon The longitude coordinate.
 * @returns {*} A Promise containing the location details.
 */
function geoCode(lat, lon) {
  return fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&addressdetails=1')
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching location details:', error);
    });
}

/**
 * Resets the map marker and floating window.
 */
function resetMarkerAndWindow() {
  if (tempMarker !== null) {
    map.removeLayer(tempMarker);
    tempMarker = null;
    markerShown = false;
  }
  floatingWindow.style.display = 'none';
}


/**
 * Toggles the sidebar open or closed.
 */
function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  var expandBtn = document.querySelector(".expand-btn");
  if (sidebar.style.width === "250px") {
    closeSidebar();
    expandBtn.classList.remove("active");
  } else {
    openSidebar();
    expandBtn.classList.add("active");
  }
  clearPreviousSearches();
}

// Toggles to open sidebar
function openSidebar() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("searchContainer").style.marginLeft = "250px";
}

// Toggles to close sidebar
function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("searchContainer").style.marginLeft = "0px";
}

/**
 * Searches for a location based on the input query.
 */
function searchLocation() {
  var query = document.getElementById('searchInput').value;
  if (query.length > 0) {
    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query))
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          var result = data[0];
          var lat = parseFloat(result.lat);
          var lon = parseFloat(result.lon);
          map.setView([lat, lon], 14);
          addRecentSearch(query);
          clearPreviousSearches();
        } else {
          alert('Location not found.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    alert('Please enter a location.');
  }
}

/**
 * Adds a recent search to the search history.
 *
 * @param {*} query The search query to be added.
 */
function addRecentSearch(query) {
  query = query.toUpperCase();
  var searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  var index = searches.indexOf(query);
  if (index !== -1) {
    searches.splice(index, 1);
  }
  searches.unshift(query);
  if (searches.length > 5) {
    searches.pop();
  }
  localStorage.setItem('recentSearches', JSON.stringify(searches));
}

/**
 * Removes a previous search from the search history.
 *
 * @param {*} search The search query to be removed.
 */
function removePreviousSearch(search) {
  var searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  var index = searches.indexOf(search);
  if (index !== -1) {
    searches.splice(index, 1);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    showSearchHistory();
  }
}

/**
 * Populates and displays the search history dropdown menu.
 */
function showSearchHistory() {
  var previousSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  var dropdown = document.getElementById("previousSearches");
  dropdown.innerHTML = "";
  var uniqueSearches = new Set();
  previousSearches.forEach(search => {
    var displayText = search.includes(',') ? search.split(',')[0] : search;
    uniqueSearches.add(displayText);
  });
  var uniqueSearchArray = Array.from(uniqueSearches);
  uniqueSearchArray.forEach(search => {
    var option = document.createElement("div");
    option.classList.add("previous-search");
    var searchElement = document.createElement("span");
    searchElement.textContent = search;
    searchElement.addEventListener("click", function () {
      document.getElementById('searchInput').value = search;
      searchLocation();
    });
    option.appendChild(searchElement);
    var removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.id = "remove-button";
    removeButton.addEventListener("click", function (event) {
      event.stopPropagation();
      removePreviousSearch(search);
    });
    option.appendChild(removeButton);
    dropdown.appendChild(option);
  });
}

// Close Previous Searches
function clearPreviousSearches() {
  var dropdown = document.getElementById("previousSearches");
  dropdown.innerHTML = "";
}

// Event listener for Enter key press on the search input field
document.getElementById("searchInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchLocation();
  }
});

// Event listener for click on the search input field
document.getElementById("searchInput").addEventListener("click", function () {
  showSearchHistory();
});

// Event listener for input change on the search input field
document.getElementById("searchInput").addEventListener("input", function () {
  clearPreviousSearches();
});

// Register service worker if supported by the browser
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/src/service-worker.js').then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
