var map = L.map('map', {
    minZoom: 16,
    maxZoom: 20,
    maxBoundsViscosity: 1.0,
    zoomControl: false,
}).setView([-19.328, 146.756], 16);


// ------- Zoom Controls -------
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// ------- Search Index -------
window.jcuSearchIndex = {
    campus: "tsv",
    buildings: [],
    pois: [],
    parking: []
}


// ------- User Location Control -------

let locationButtonState = "default";

const locateControl = L.control({
    position: 'bottomright'
});

function updateLocateButton() {
    const button = document.querySelector('.user-location-button');

    if (!button) return;

    const states = {
        default: {
            icon: 'location_searching',
            title: "Find my location",
            className: 'location-default'
        },
        permissionDenied: {
            icon: 'location_disabled',
            title: "Location permission denied",
            className: 'location-permission-denied'
        },
        offCampus: {
            icon: 'location_searching',
            title: "Location is beyond map bounds",
            className: 'location-off-campus'
        },
        onCampus: {
            icon: 'my_location',
            title: "Centre map on my location",
            className: 'location-on-campus'
        }
    };

    const state = states[locationButtonState];

    if (!state) return;

    let icon = state.icon;
    let title = state.title;
    let isNotCentered = false;

    // Check whether the map is centered on the user's location
    if (locationButtonState === 'onCampus' && userLocationMarker) {
        const distance = map.distance(map.getCenter(), userLocationMarker.getLatLng());
        isNotCentered = distance > 10;
        if (isNotCentered) {
            icon = "location_searching";
            title = "Centre map on my location";
        }
    }

    button.classList.remove('location-default', 'location-permission-denied', 'location-off-campus', 'location-on-campus', 'not-centered');

    button.classList.add(state.className);

    if (isNotCentered) {
        button.classList.add('not-centered');
    }

    button.innerHTML = `<span class="material-symbols-outlined">${icon}</span>`;
    
    button.title = title;
    button.setAttribute('aria-label', title);
}

locateControl.onAdd = function() {
    const button = L.DomUtil.create('button', 'user-location-button');

    button.type = 'button';
    
    L.DomEvent.disableClickPropagation(button);
    L.DomEvent.disableScrollPropagation(button);


    L.DomEvent.on(button, 'click', function() {
        if (locationButtonState === 'permissionDenied') {
            centerMapLocationFound = true;
            watchUserLocation();
            return;
        }

        if (locationButtonState === 'offCampus') {
            showLocationPopup(
                "Location is beyond map bounds",
                "You're outside the selected campus bounds. Location features are currently unavailable."
            );
            return;
        }

        if (!userLocationMarker) {
            centerMapLocationFound = true;
            watchUserLocation();
            return;
        }

        map.stop();

        map.setView(userLocationMarker.getLatLng(), 19, {
            animate: true
        });
    });

    return button;  
};

locateControl.addTo(map);
updateLocateButton();
map.on('moveend zoomend', updateLocateButton);

// ------- User Location Pane -------

map.createPane('accuracyPane');
map.getPane('accuracyPane').style.zIndex = 450;
map.getPane('accuracyPane').style.pointerEvents = 'none';

var campusLayers = L.featureGroup().addTo(map);
var campusBounds = null;

const searchableClusters = [];
const originalClusterMarkers = new Map();
let searchFilterActive = false;

// ------- Marker Cluster -------

function createMarkerCluster() {
    const cluster = L.markerClusterGroup({
        maxClusterRadius: 80,
        disableClusteringAtZoom: 19,
        showCoverageOnHover: false,

        iconCreateFunction: function(cluster) {
            var markers = cluster.getAllChildMarkers()[0];

            return L.divIcon({
                html: markers.options.icon.options.html,
                className: markers.options.icon.options.className,
                iconSize: markers.options.icon.options.iconSize,
                iconAnchor: markers.options.icon.options.iconAnchor
            });
        }
    });

    searchableClusters.push(cluster);
    //cluster.addTo(map);

    return cluster;
}

// ------- Hide Searchable Clusters -------

function hideSearchableClusters() {
    searchableClusters.forEach(cluster =>  map.removeLayer(cluster));
}

function saveOriginalClusterMarkers() {
    originalClusterMarkers.clear();

    searchableClusters.forEach(cluster => {
        originalClusterMarkers.set(cluster, cluster.getLayers());
    });
}

function restoreSearchableClusters() {
    searchFilterActive = false;

    searchableClusters.forEach(cluster => {
        cluster.clearLayers();
        cluster.addLayers(originalClusterMarkers.get(cluster) || []);
    });

    updateFilterVisibility();
}

function filterSearchableClusters(features) {
    const matchingFeatures = new Set(features);
    searchFilterActive = true;

    searchableClusters.forEach(cluster => {
        const markers = originalClusterMarkers.get(cluster) || [];

        cluster.clearLayers();
        cluster.addLayers(markers.filter(marker => matchingFeatures.has(marker.feature)));

        if (cluster.getLayers().length > 0 && !map.hasLayer(cluster)) {
            map.addLayer(cluster);
        }
    });
}

// ------- Styles -------

const MAP_OBJECT_COLORS = {
    CREEK_OUTLINE: "rgba(188, 210, 255, 0.80)",
    CREEK_FILL: "rgba(211, 226, 234, 1.00)",
    SPORTS_FIELDS_OUTLINE: "rgba(170, 221, 170, 1.00)",
    SPORTS_FIELDS_FILL: "rgba(204, 228, 204, 1.00)",
    FENCE: "rgba(170, 136, 136, 1.00)",
    ROAD_OUTLINE: "rgba(153, 153, 153, 1.00)",
    ROAD_FILL: "rgba(255, 255, 255, 1.00)",
    PARKING_FILL: "rgba(243, 243, 243, 1.00)",
    PATH: "rgba(119, 153, 170, 1.00)",
    NATURE_PATH: "rgba(102, 0, 153, 1.00)",
    BUILDING_OUTLINE: "rgba(68, 170, 221, 1.00)",
    BUILDING_FILL: "rgba(102, 221, 255, 1.00)"
}

const MAP_OBJECT_STYLES = {
    CREEK: {
        color: MAP_OBJECT_COLORS.CREEK_OUTLINE,
        weight: 1,
        fillColor: MAP_OBJECT_COLORS.CREEK_FILL,
        fillOpacity: 1
    },

    SPORTS_FIELD: {
        color: MAP_OBJECT_COLORS.SPORTS_FIELDS_OUTLINE,
        weight: 1,
        fillColor: MAP_OBJECT_COLORS.SPORTS_FIELDS_FILL,
        fillOpacity: 1
    },

    FENCE: {
        color: MAP_OBJECT_COLORS.FENCE
    },

    ROAD_AREA: {
        color: MAP_OBJECT_COLORS.ROAD_OUTLINE,
        weight: 1,
        fillColor: MAP_OBJECT_COLORS.ROAD_FILL,
        fillOpacity: 1
    },

    PATH_AREA: {
        color: MAP_OBJECT_COLORS.PATH,
        weight: 1,
        fillColor: MAP_OBJECT_COLORS.PATH,
        fillOpacity: 1 
    },

    PATH_CENTER_LINE: {
        color: MAP_OBJECT_COLORS.PATH,
        weight: 7,
        lineCap: "round",
        lineJoin: "miter"
    },

    PARKING: {
        color: MAP_OBJECT_COLORS.ROAD_OUTLINE,
        weight: 1,
        fillColor: MAP_OBJECT_COLORS.PARKING_FILL,
        fillOpacity: 1
    },

    NATURE_PATH: {
        color: MAP_OBJECT_COLORS.NATURE_PATH,
        weight: 2,
        fillColor: MAP_OBJECT_COLORS.NATURE_PATH,
        dashArray: "1.5, 2.5"
    },

    BUILDING: {
        color: MAP_OBJECT_COLORS.BUILDING_OUTLINE,
        weight: 1,
        fillColor: MAP_OBJECT_COLORS.BUILDING_FILL,
        fillOpacity: 1
    }
}