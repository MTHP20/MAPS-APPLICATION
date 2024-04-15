// Array to store marker objects
var markers = [];

/**
 * Retrieves and displays amenities within the current map bounds after a delay.
 *
 * @param {*} amenity - The type of amenity to search for.
 * @param {*} type - The specific type of the amenity.
 * @param {*} nameDefault - The default name for the amenity if not provided.
 * @param {*} zoom - The minimum zoom level required before executing the search.
 * @param {*} symbol - The symbol to represent the amenity on the map.
 */
function dynamicSearch(amenity, type, nameDefault, zoom, symbol) {
    var currentZoom = map.getZoom();
    if (currentZoom < zoom) {
        map.setZoom(zoom);
    }

    setTimeout(function () {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        var bounds = map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        var overpassQuery = `[out:json];
            (
                node["${amenity}"="${type}"](${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
                way["${amenity}"="${type}"](${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
                relation["${amenity}"="${type}"](${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
            );
            out body;
            >;
            out skel qt;`;

        fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: overpassQuery
        })
            .then(response => response.json())
            .then(data => {
                data.elements.forEach(element => {
                    var lat, lon, name;
                    if (element.type === 'node') {
                        lat = element.lat;
                        lon = element.lon;
                        name = element.tags.name || nameDefault;
                    } else if (element.type === 'way' || element.type === 'relation') {
                        lat = element.center.lat;
                        lon = element.center.lon;
                        name = element.tags.name || nameDefault;
                    }

                    var customIcon = L.divIcon({
                        className: 'custom-marker',
                        html: symbol,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    });
                    var marker = L.marker([lat, lon], { icon: customIcon }).addTo(map)
                    markers.push(marker);

                    marker.on('click', function (e) {
                        var floatingWindow = document.getElementById('floating-window');
                        var content = `<div>${name}</div>`;
                        floatingWindow.innerHTML = content;
                        floatingWindow.style.display = 'block';
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, 500);
}

/**
 * Displays the floating search window and overlay.
 */
function showFloatingWindow() {
    var overlay = document.getElementById('overlay');
    var floatingWindow = document.getElementById('floating-searchWindow');
    overlay.style.display = 'block';
    floatingWindow.style.display = 'block';
}

/**
 * Hides the floating search window and overlay.
 */
function hideFloatingWindow() {
    var overlay = document.getElementById('overlay');
    var floatingWindow = document.getElementById('floating-searchWindow');
    overlay.style.display = 'none';
    floatingWindow.style.display = 'none';
}

// Add event listener to the button in the extraSearchContainer class to show the floating window when clicked
document.querySelector('.extraSearchContainer button').addEventListener('click', function () {
    showFloatingWindow();
});

// Add event listener to the closeButton element to hide the floating window when clicked
document.getElementById('closeButton').addEventListener('click', function () {
    hideFloatingWindow();
});

// Add event listener to the map for the zoomend event
map.on('zoomend', function () {
    var currentZoom = map.getZoom();
    if (currentZoom <= 12) {
        clearMarkers();
    }
});

/**
 * Clears all markers from the map.
 */
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

// Search thorugh amenities
function searchRestaurants() {
    dynamicSearch('amenity', 'restaurant', 'Restaurant', 16, '🍽️');
}

function searchServices() {
    dynamicSearch('amenity', 'fuel', 'Service', 15, '⛽');
}

function searchSupermarkets() {
    dynamicSearch('shop', 'supermarket', 'Supermarket', 15, '🛒');
}

function searchHotels() {
    dynamicSearch('tourism', 'hotel', 'Hotel', 15, '🏨');
}

function searchTowns() {
    dynamicSearch('shop', 'department_store', 'Town', 15, '🏬');
}