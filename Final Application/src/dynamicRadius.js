/**
 * This function creates a dynamic radius on a map, allowing users to select
 * an area and display amenities within that radius.
 *
 * @param {*} amenity The type of amenity to display within the radius.
 * @param {*} type The type of the amenity.
 * @param {*} nameDefault The default name for the amenity.
 * @param {*} symbol The symbol to represent the amenity.
 */
function dynamicRadius(amenity, type, nameDefault, symbol) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    var canvas = document.getElementById('radiusCanvas');
    var context = canvas.getContext('2d');
    canvas.width = map.getSize().x;
    canvas.height = map.getSize().y;
    canvas.style.display = 'block';
    map.getContainer().style.cursor = 'crosshair';
    var presetRadius = 3500;

    if (map.getZoom() != 13) {
        map.setZoom(13);
    }

    function handleClick(e) {
        var clickedPoint = map.latLngToContainerPoint(e.latlng);
        var circleBounds = getCircleBounds(clickedPoint, presetRadius / map.getZoom());
        canvas.style.display = 'none';
        map.getContainer().style.cursor = 'default';
        displayAmenities(circleBounds, amenity, type, nameDefault, symbol);

        map.off('click', handleClick);
        map.off('zoomend', handleZoomEnd);
        map.off('mousemove', handleMouseMove);
    }

    function handleZoomEnd() {
        if (map.getZoom() < 13) {
            map.setZoom(13);
        }
    }

    function handleMouseMove(e) {
        var cursorPoint = map.latLngToContainerPoint(e.latlng);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(94, 93, 240, 0.5)';
        context.beginPath();
        context.arc(cursorPoint.x, cursorPoint.y, presetRadius / map.getZoom(), 0, 2 * Math.PI);
        context.fill();
        context.strokeStyle = 'blue';
        context.beginPath();
        context.arc(cursorPoint.x, cursorPoint.y, presetRadius / map.getZoom(), 0, 2 * Math.PI);
        context.stroke();
    }

    map.on('click', handleClick);
    map.on('zoomend', handleZoomEnd);
    map.on('mousemove', handleMouseMove);
}

/**
 * This function displays amenities within a given bounds on the map.
 *
 * @param {*} bounds - The bounds within which to display amenities.
 * @param {*} amenity - The type of amenity to display.
 * @param {*} type - The specific type of the amenity.
 * @param {*} nameDefault - The default name for the amenity if not provided.
 * @param {*} symbol - The symbol to represent the amenity on the map.
 */
function displayAmenities(bounds, amenity, type, nameDefault, symbol) {
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
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
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
}

/**
 * Returns the bounds of a circle on the map with the given center and radius.
 *
 * @param {*} center - The center point of the circle.
 * @param {*} radius - The radius of the circle.
 * @returns {*} - The bounds of the circle.
 */
function getCircleBounds(center, radius) {
    var northEast = map.containerPointToLatLng([center.x + radius, center.y - radius]);
    var southWest = map.containerPointToLatLng([center.x - radius, center.y + radius]);
    return L.latLngBounds(southWest, northEast);
}

/**
 * Provides autocomplete functionality for an input field based on a given array of options.
 *
 * @param {*} input - The input field to which autocomplete functionality will be added.
 * @param {*} arr - An array of options to use for autocompletion.
 * @param {*} searchFunctions - An object containing search functions mapped to item types.
 */
function autocomplete(input, arr, searchFunctions) {
    let currentFocus;

    input.addEventListener("input", function (e) {
        const value = this.value;
        closeAllLists();
        if (!value) { return false; }
        currentFocus = -1;
        const autocompleteList = document.createElement("DIV");
        autocompleteList.setAttribute("id", input.id + "autocomplete-list");
        autocompleteList.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(autocompleteList);
        arr.forEach(item => {
            if (item.substr(0, value.length).toUpperCase() === value.toUpperCase()) {
                const suggestion = document.createElement("DIV");
                suggestion.innerHTML = `<strong>${item.substr(0, value.length)}</strong>`;
                suggestion.innerHTML += item.substr(value.length);
                suggestion.innerHTML += `<input type='hidden' value='${item}'>`;
                suggestion.addEventListener("click", function () {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    const itemType = input.value.toLowerCase();
                    if (searchFunctions[itemType]) {
                        searchFunctions[itemType]();
                        document.getElementById('floating-searchWindow').style.display = 'none';
                        document.getElementById('map').style.display = 'block';
                        document.getElementById('overlay').style.display = 'none';
                        clearInput();
                    }
                });
                autocompleteList.appendChild(suggestion);
            }
        });
    });

    function closeAllLists(except) {
        const autocompleteItems = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < autocompleteItems.length; i++) {
            if (except !== autocompleteItems[i] && except !== input) {
                autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    function clearInput() {
        input.value = '';
    }
}

const amenities = [
    "ATMs",
    "Auto Repair Shops",
    "Bakeries",
    "Banks",
    "Cafes",
    "Cinemas",
    "Clothing Stores",
    "Convenience Stores",
    "Fitness Centres",
    "Hairdressers",
    "Hospitals",
    "Hotels",
    "Libraries",
    "Museums",
    "Nightclubs",
    "Pet Stores",
    "Petrol Services",
    "Pharmacies",
    "Post Offices",
    "Pubs",
    "Restaurants",
    "Schools",
    "Shopping Centres",
    "Supermarkets",
    "Theatres",
    "Tourist Attractions",
    "Veterinary Clinics"
];

const searchFunctions = {
    'atms': highlightATMs,
    'auto repair shops': highlightRepairs,
    'bakeries': highlightBakeries,
    'banks': highlightBanks,
    'cafes': highlightCafes,
    'cinemas': highlightCinemas,
    'clothing stores': highlightClothes,
    'convenience stores': highlightConvenience,
    'fitness centres': highlightFitness,
    'hairdressers': highlightHairdresser,
    'hospitals': highlightHospitals,
    'hotels': highlightHotels,
    'libraries': highlightLibraries,
    'museums': highlightMuseums,
    'nightclubs': highlightClubs,
    'pet stores': highlightPetStores,
    'petrol services': highlightServices,
    'pharmacies': highlightPharmacies,
    'post offices': highlightPostOffices,
    'pubs': highlightPubs,
    'restaurants': highlightRestaurants,
    'schools': highlightSchools,
    'shopping centres': highlightTowns,
    'supermarkets': highlightSupermarkets,
    'theatres': highlightTheatres,
    'tourist attractions': highlightTourism,
    'veterinary clinics': highlightVets,
};

autocomplete(document.getElementById("myInput"), amenities, searchFunctions);

// Functions to highlight amenities
function highlightATMs() {
    dynamicRadius('amenity', 'atm', 'ATMs', '🏧');
}

function highlightRepairs() {
    dynamicRadius('shop', 'car_repair', 'Auto Repair Shops', '🔧');
}

function highlightBakeries() {
    dynamicRadius('craft', 'bakery', 'Bakeries', '🥯');
}

function highlightBanks() {
    dynamicRadius('amenity', 'bank', 'Banks', '🏦');
}

function highlightCafes() {
    dynamicRadius('amenity', 'cafe', 'Cafes', '☕');
}

function highlightCinemas() {
    dynamicRadius('amenity', 'cinema', 'Cinemas', '🎞️');
}

function highlightClothes() {
    dynamicRadius('shop', 'clothes', 'Clothing Store', '👕');
}

function highlightConvenience() {
    dynamicRadius('shop', 'convenience', 'Convenience Store', '🏪');
}

function highlightFitness() {
    dynamicRadius('leisure', 'fitness_centre', 'Fitness Centre', '💪');
}

function highlightHairdresser() {
    dynamicRadius('shop', 'hairdresser', 'Hairdressers', '💈');
}

function highlightHospitals() {
    dynamicRadius('amenity', 'hospital', 'Hospitals', '🏥');
}

function highlightHotels() {
    dynamicRadius('tourism', 'hotel', 'Hotels', '🏨');
}

function highlightLibraries() {
    dynamicRadius('amenity', 'library', 'Libraries', '📚');
}

function highlightMuseums() {
    dynamicRadius('building', 'museum', 'Museums', '🖼️');
}

function highlightClubs() {
    dynamicRadius('amenity', 'nightclub', 'Nightclubs', '🪩');
}

function highlightPetStores() {
    dynamicRadius('shop', 'pet', 'Pet Stores', '🐶');
}

function highlightServices() {
    dynamicRadius('amenity', 'fuel', 'Petrol Services', '⛽');
}

function highlightPharmacies() {
    dynamicRadius('amenity', 'pharmarcy', 'Pharmarcies', '😷');
}

function highlightPostOffices() {
    dynamicRadius('amenity', 'post_office', 'Post Offices', '🏤');
}

function highlightPubs() {
    dynamicRadius('amenity', 'pub', 'Pubs', '🍺');
}

function highlightRestaurants() {
    dynamicRadius('amenity', 'restaurant', 'Restaurants', '🍽️');
}

function highlightSchools() {
    dynamicRadius('amenity', 'college', 'Schools', '🏫');
}

function highlightTowns() {
    dynamicRadius('shop', 'department_store', 'Towns', '🏬');
}

function highlightSupermarkets() {
    dynamicRadius('shop', 'supermarket', 'Supermarkets', '🛒');
}

function highlightTheatres() {
    dynamicRadius('amenity', 'theatre', 'Theatres', '🎭');
}

function highlightTourism() {
    dynamicRadius('tourism', 'attraction', 'Tourist Attractions', '🏛️');
}

function highlightVets() {
    dynamicRadius('amenity', 'veterinary', 'Veterinary Clinics', '🎭');
}