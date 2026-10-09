var map = L.map('map', {
    minZoom: 16,
    maxZoom: 19,
    maxBoundsViscosity: 1.0,
    zoomControl: false,
}).setView([-19.328, 146.756], 16);


// ------- Zoom Controls -------
L.control.zoom({
    position: 'bottomright'
}).addTo(map);


// ------- User Location Control -------

const locateControl = L.control({
    position: 'bottomright'
});

function updateLocateButton() {
    const button = document.querySelector('.user-location-button');

    if (!button) return;

    if (!userLocationMarker) {
        button.classList.add('not-centered');
        button.innerHTML = '<span class="material-symbols-outlined">location_searching</span>';
        return;
    }

    const mapCenter = map.getCenter();
    const userLocation = userLocationMarker.getLatLng();

    const isCentered = mapCenter.distanceTo(userLocation) <= 10;
    
    if (isCentered) {
        button.classList.remove('not-centered');
        button.innerHTML = '<span class="material-symbols-outlined">my_location</span>';
    } else {
        button.classList.add('not-centered');
        button.innerHTML = '<span class="material-symbols-outlined">location_searching</span>';
    }
}

locateControl.onAdd = function() {
    const button = L.DomUtil.create('button', 'user-location-button not-centered');

    button.addEventListener('click', () => {
        watchUserLocation();
    });

    button.type = 'button';
    button.innerHTML = '<span class="material-symbols-outlined">location_searching</span>';
    button.title = 'Centre map on your location';
    button.setAttribute('aria-label', 'Centre map on your location');

    L.DomEvent.disableClickPropagation(button);
    L.DomEvent.disableScrollPropagation(button);


    L.DomEvent.on(button, 'click', function() {
        if (!userLocationMarker) {
            console.log("User location is not available yet.");
            return;
        }

        map.stop();

        map.setView(userLocationMarker.getLatLng(), 18, {
            animate: true
        });
    });

    return button;  
};

locateControl.addTo(map);

map.on('moveend zoomend', updateLocateButton);


// ------- User Location Pane -------

map.createPane('accuracyPane');
map.getPane('accuracyPane').style.zIndex = 450;
map.getPane('accuracyPane').style.pointerEvents = 'none';

var campusLayers = L.featureGroup().addTo(map);
var campusBounds = null;


// ------- Marker Cluster -------

function createMarkerCluster() {
    return L.markerClusterGroup({
        maxClusterRadius: 50,
        disableClusteringAtZoom: 18,
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
    }).addTo(map);
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
        weight: 2,
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