// Open or create an IndexedDB database named 'locations-db' with version 1
const dbPromise = window.indexedDB.open('locations-db', 1);

// Create a layer group for markers and add it to the map
var layerGroup = L.layerGroup().addTo(map);

// Event handler for database upgrade (creating object store if not exists)
dbPromise.onupgradeneeded = function (event) {
  var db = event.target.result;
  if (!db.objectStoreNames.contains('locations')) {
    var store = db.createObjectStore('locations', { keyPath: 'id', autoIncrement: true });
  }
}

// Event handler for successful database opening
dbPromise.onsuccess = function (event) {
  console.log('Database opened successfully');
}

// Event handler for database errors
dbPromise.onerror = function (event) {
  console.error('Database error:', event.target.error);
}

/**
 * Displays the saved locations on the map and in the saved locations container.
 */
function showSavedLocations() {
  var savedLocationsContainer = document.getElementById("savedLocations");
  var transaction = dbPromise.result.transaction(['locations'], 'readonly');
  var store = transaction.objectStore('locations');
  var cursorRequest = store.openCursor();
  savedLocationsContainer.innerHTML = "";
  layerGroup.clearLayers();
  cursorRequest.onsuccess = function (event) {
    var cursor = event.target.result;
    if (cursor) {
      var location = cursor.value;
      var lat = location.lat;
      var lon = location.lon;
      var savedMarker = L.marker([lat, lon]);
      layerGroup.addLayer(savedMarker);
      geoCode(lat, lon)
        .then(data => {
          var placeName = data.address ? (data.address.city || data.address.town || data.address.village || data.address.hamlet || "N/A") : "N/A";
          var postcode = data.address ? (data.address.postcode || "N/A") : "N/A";
          var savedLocation = document.createElement("div");
          savedLocation.textContent = placeName + ", " + postcode;
          savedLocation.classList.add("saved-location");
          var removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.classList.add("remove-button");
          removeButton.addEventListener("click", function () {
              removeSavedLocation(cursor.key, savedMarker, removeButton);
              savedLocationsContainer.removeChild(savedLocation);
          });
          savedLocation.addEventListener("click", function () {
            if (!savedLocation.classList.contains("clicked-once")) {
              savedLocation.classList.add("clicked-once");
              map.setView([lat, lon], 15);
            }
          });
        savedLocationsContainer.appendChild(savedLocation);
        savedLocationsContainer.appendChild(removeButton);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      cursor.continue();
    }
  };

  cursorRequest.onerror = function (event) {
    console.error('Error retrieving saved locations:', event.target.error);
  };
}

/**
 * Saves the provided location to the IndexedDB database.
 *
 * @param {*} location - The location to be saved.
 */
function saveLocation(location) {
  var transaction = dbPromise.result.transaction(['locations'], 'readwrite');
  var store = transaction.objectStore('locations');
  var request = store.add(location);

  request.onsuccess = function (event) {
    console.log('Location saved successfully');
  };

  request.onerror = function (event) {
    console.error('Error saving location:', event.target.error);
  };
}

/**
 * Saves the current marker location to the IndexedDB database when called.
 */
function saveLocationButton() {
  if (tempMarker !== null) {
    var lat = tempMarker.getLatLng().lat;
    var lon = tempMarker.getLatLng().lng;
    var location = {
      lat: lat,
      lon: lon
    };

    saveLocation(location);
  }
}

/**
 * Removes the saved location with the provided key from the IndexedDB database and the map.
 *
 * @param {*} key - The key of the location to be removed.
 * @param {*} marker - The marker associated with the location to be removed.
 */
function removeSavedLocation(key, marker) {
  var transaction = dbPromise.result.transaction(['locations'], 'readwrite');
  var store = transaction.objectStore('locations');
  var request = store.delete(key);

  request.onsuccess = function (event) {
    console.log('Location removed successfully');
    layerGroup.removeLayer(marker);
    showSavedLocations();
  };

  request.onerror = function (event) {
    console.error('Error removing location:', event.target.error);
  };
}