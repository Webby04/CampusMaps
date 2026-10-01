var map = L.map('map', {
    minZoom: 16,
    maxZoom: 19,
    maxBoundsViscosity: 1.0
}).setView([-19.328, 146.756], 16);

var campusLayers = L.featureGroup().addTo(map);

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

function addParkingIcon(feature, layer) {
    var center = layer.getBounds().getCenter();

    L.marker(center, {
        icon: getParkingIcon(feature.properties.parkType)
    }).addTo(campusLayers);
}

var buildingLabels = [];

function addBuildingLabel(feature, layer) {
    var center = layer.getBounds().getCenter();

    var buildingNumber = String(feature.properties.buildingNumber);
    var buildingName = feature.properties.buildingName;

    var label = L.marker(center, {
        icon: L.divIcon({
            className: "building-label",
            html: buildingNumber,
            iconSize: [40, 20],
            iconAnchor: [20, 10]
        })
    });

    buildingLabels.push({
        number: buildingNumber,
        name: buildingName,
        label: label
    });
}

let campusLoadGeneration = 0;
let zoomEndHandler = null;

async function callbacktest(campus) {
    const generation = ++campusLoadGeneration;

    campusLayers.clearLayers();

    buildingLabels.forEach(function(building) {
        if (map.hasLayer(building.label)) {
            map.removeLayer(building.label);
        }
    });

    buildingLabels = [];

    let creekJSON = await fetch(`../data/mapsdata/${campus}_creeks.json`);
    let creekData = await creekJSON.json();
    
    if (generation !== campusLoadGeneration)  {
        return;
    }
    
    var creekLayer = L.geoJSON(creekData, {
        style: MAP_OBJECT_STYLES.CREEK
    })
    campusLayers.addLayer(creekLayer)

    let sportsfieldsJSON = await fetch(`../data/mapsdata/${campus}_sports_fields.json`);
    let sportsfieldsData = await sportsfieldsJSON.json();
    
    if (generation !== campusLoadGeneration)  {
        return;
    }
    var sportsfieldsLayer = L.geoJSON(sportsfieldsData, {
        style: MAP_OBJECT_STYLES.SPORTS_FIELD
    })
    campusLayers.addLayer(sportsfieldsLayer)

    let fencesJSON = await fetch(`../data/mapsdata/${campus}_fences.json`);
    let fencesData = await fencesJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var fencesLayer = L.geoJSON(fencesData, {
        style: MAP_OBJECT_STYLES.FENCE
    })
    campusLayers.addLayer(fencesLayer)

    let roadareasJSON = await fetch(`../data/mapsdata/${campus}_road_areas.json`);
    let roadareasData = await roadareasJSON.json();
    
    if (generation !== campusLoadGeneration)  {
        return;
    }

    var roadareasLayer = L.geoJSON(roadareasData, {
        style: MAP_OBJECT_STYLES.ROAD_AREA
    })
    campusLayers.addLayer(roadareasLayer)

    let pathareasJSON = await fetch(`../data/mapsdata/${campus}_path_areas.json`);
    let pathareasData = await pathareasJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var pathareasLayer = L.geoJSON(pathareasData, {
        style: MAP_OBJECT_STYLES.PATH_AREA
    })
    campusLayers.addLayer(pathareasLayer)

    let pathcenterlinesJSON = await fetch(`../data/mapsdata/${campus}_path_center_lines.json`);
    let pathcenterlinesData = await pathcenterlinesJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var pathcenterlinesLayer = L.geoJSON(pathcenterlinesData, {
        style: MAP_OBJECT_STYLES.PATH_CENTER_LINE
    })
    campusLayers.addLayer(pathcenterlinesLayer)

    let parkingJSON = await fetch(`../data/mapsdata/${campus}_parking.json`);
    let parkingData = await parkingJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var parkingLayer = L.geoJSON(parkingData, {
        style: MAP_OBJECT_STYLES.PARKING,
        onEachFeature: addParkingIcon
    })
    campusLayers.addLayer(parkingLayer)

    let naturepathsJSON = await fetch(`../data/mapsdata/${campus}_nature_paths.json`);
    let naturepathsData = await naturepathsJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var naturepathsLayer = L.geoJSON(naturepathsData, {
        style: MAP_OBJECT_STYLES.NATURE_PATH
    })
    campusLayers.addLayer(naturepathsLayer)

    let buildingsJSON = await fetch(`../data/mapsdata/${campus}_buildings.json`);
    let buildingsData = await buildingsJSON.json();

    var FirstZoomBuildings;
    var SecondZoomBuildings;

    if (campus ==="tsv") {
        FirstZoomBuildings = ["018", "026", "104", "134", "142", "500" ];
        SecondZoomBuildings = ["018", "026", "99", "104", "134", "142", "143", "145", "168", "191", "206", "283", "500" ];
    } else if (campus ==="cns") {
        FirstZoomBuildings = ["B001", "D003", "F001"];
        SecondZoomBuildings = ["B001", "D003", "D004", "F001"];
    }

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var buildingsLayer = L.geoJSON(buildingsData, {
        style: MAP_OBJECT_STYLES.BUILDING,
        onEachFeature: addBuildingLabel
    })
    campusLayers.addLayer(buildingsLayer)

    function updateBuildingLabels() {
        var zoom = map.getZoom();

        buildingLabels.forEach(function (building) {
            if (zoom <= 17) {
                if (FirstZoomBuildings.includes(building.number)) {
                    building.label.setIcon(
                        L.divIcon({
                            className: "building-label",
                            html: building.number + "<br>" + building.name,
                            iconSize: [150, 40],
                            iconAnchor: [75, 20]
                        })
                    );
                    building.label.addTo(map)
                } else { 
                    map.removeLayer(building.label)
                }
            }

            else if (zoom === 18) {
                if (SecondZoomBuildings.includes(building.number)) {
                    building.label.setIcon(
                        L.divIcon({
                            className: "building-label",
                            html: building.number + "<br>" + building.name,
                            iconSize: [150, 40],
                            iconAnchor: [75, 20]
                        })
                    );
                    building.label.addTo(map)
                } else { 
                    map.removeLayer(building.label)
                }
            }

            else if (zoom >= 19) {
                if (SecondZoomBuildings.includes(building.number)) {
                    building.label.setIcon(
                        L.divIcon({
                            className: "building-label",
                            html: building.number + "<br>" + building.name,
                            iconSize: [150, 40],
                            iconAnchor: [75, 20]
                        })
                    );
                } else {
                    building.label.setIcon(
                        L.divIcon({
                            className: "building-label",
                            html: building.number,
                            iconSize: [40, 20],
                            iconAnchor: [20, 10]
                        })
                    );
                }
                building.label.addTo(map);
            }
        });
    }
    updateBuildingLabels();
    
    if (zoomEndHandler) {
        map.off("zoomend", zoomEndHandler);
    }

    zoomEndHandler = updateBuildingLabels;
    map.on("zoomend", zoomEndHandler);

    let poiJSON = await fetch(`../data/mapsdata/${campus}_poi.json`);
    let poiData = await poiJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }
    var poiLayer = L.geoJSON(poiData, {
        pointToLayer: function (feature, latlng) {
            var icon = getPOIIcon(feature.properties.type);

            if (icon == null) {
                return;
            }

            return L.marker(latlng, {
                icon: icon
            });
        }
    })
    campusLayers.addLayer(poiLayer);

    var campusBounds = campusLayers.getBounds().pad(0.05);
    var campusCenter = campusBounds.getCenter();

    map.setView(campusCenter, 16);
    map.setMaxBounds(campusBounds);
}

callbacktest("tsv");

document.querySelector('[data-campus="tsv"]').classList.add("selected");

function getParkingIcon(parkType) {
    let iconClass;

    switch (parkType) {
        case 'FREE':
            iconClass = 'parking-free';
            break;
        case 'FREEVPERMIT':
            iconClass = 'parking-freevpermit'
            break;
        case 'PAID-ALL':
            iconClass = 'parking-paid-all';
            break;
        case 'PAID-4HR':
            iconClass = 'parking-paid-4hr'
            break;
        case 'RESIDENTIAL':
            iconClass = 'parking-residential';
            break;
        case 'CEL-PREM':
            iconClass = 'parking-cel-prem'
            break;            
        case 'COMMERCIAL':
        case 'RESERVED':
        case 'LOADING':
        case 'VISITOR':
            iconClass = 'parking-special';
            break;
    }

    return L.divIcon({
        html: `<i class="fa-solid fa-square-parking ${iconClass}"></i>`,
        className: 'parking-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    })
}

function getPOIIcon(type) {
    let iconHTML;
    let iconClass;

    switch(type) {
        case 'MOTORC':
            iconHTML = `<span class="material-symbols-outlined">motorcycle</span>`;
            iconClass = 'poi-motorc';
            break;
        case 'ACCPARK':
            iconHTML = `<i class="fa-solid fa-wheelchair"></i>`;
            iconClass = 'poi-accpark'
            break;
        case 'TRANS':
            iconHTML = `<i class="fa-solid fa-bus-simple"></i>`;
            iconClass = 'poi-trans';
            break;
        case 'ESCOOTER':
            iconHTML = `<span class="material-symbols-outlined">electric_scooter</span>`;
            iconClass = 'poi-escooter';
            break;
        case 'EV_CHG':
            iconHTML = `<i class="fa-solid fa-bolt"></i>`;
            iconClass = 'poi-ev-chg';
            break;
        case 'BIKE':
            iconHTML = `<span class="material-symbols-outlined">directions_bike</span>`;
            iconClass = 'poi-bike';
            break;
        case 'BIKEWS':
            iconHTML = `<i class="fa-solid fa-wrench"></i>`;
            iconClass = 'poi-bikews';
            break;
        case 'CAFE':
        case 'KITCHENETTES':
        case 'FOODBEV':
            iconHTML = `<span class="material-symbols-outlined">restaurant</span>`;
            iconClass = 'poi-foodbev';
            break;
        case 'ATM':
            iconHTML = `<span class="material-symbols-outlined">attach_money</span>`;
            iconClass = 'poi-atm';
            break;
        case 'HELPPHONE':
            iconHTML = `<i class="fa-solid fa-phone"></i>`;
            iconClass = 'poi-helpphone';
            break;
        case 'SECURITY':
            iconHTML = `<i class="fa-solid fa-shield"></i>`;
            iconClass = 'poi-security';
            break;
        case 'DEFIB':
            iconHTML = `<i class="fa-solid fa-heart-crack"></i>`;
            iconClass = 'poi-defib';
            break; 
        case 'PARENT':
            iconHTML = `<i class="fa-solid fa-baby"></i>`;
            iconClass = 'poi-parent';
            break;      
        case 'INFO':
            iconHTML = `<i class="fa-solid fa-circle-info"></i>`;
            iconClass = 'poi-info';
            break; 
        case 'COMGARDEN':
        case 'WELLNESS':
            iconHTML = `<i class="fa-solid fa-leaf"></i>`;
            iconClass = 'poi-wellness';
            break;
        case 'SHWR':
            iconHTML = `<i class="fa-solid fa-shower"></i>`;
            iconClass = 'poi-shower';
            break;
        case 'PWD':
            iconHTML = `<i class="fa-solid fa-restroom"></i>`;
            iconClass = 'poi-pwd';
            break;
        default:
            return null;
    }

    return L.divIcon({
        html: iconHTML,
        className: `poi-icon ${iconClass}`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

const mapSidebar = document.getElementById("map-sidebar");
const menuButton = document.getElementById("menu-button");
const closeButton = document.getElementById("close-button");
const campusButtons = document.querySelectorAll(".campus-button");
const campusOptions = document.querySelectorAll('input[name="campus"]');

campusButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const campus = button.dataset.campus;

        callbacktest(campus);

        campusButtons.forEach(function(campusButton) {
            campusButton.classList.remove("selected");
            campusButton.setAttribute("aria-pressed", "false");
        });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");

        const radioButton = document.querySelector(
            `input[name="campus"][value="${campus}"]`
        );

        if (radioButton) {
            radioButton.checked = true;
        }

        mapSidebar.classList.remove("expanded");
    });
});

campusOptions.forEach(function(option) {
    option.addEventListener("click", function() {
        const campus = option.value;

        callbacktest(campus);

        campusButtons.forEach(function(campusButton) {
            campusButton.classList.remove("selected");
            campusButton.setAttribute("aria-pressed", "false");
        });

        const selectedButton = document.querySelector(
            `.campus-button[data-campus="${campus}"]`
        );

        if (selectedButton) {
            selectedButton.classList.add("selected");
            selectedButton.setAttribute("aria-pressed", "true");
        }
    });
}); 

menuButton.addEventListener("click", function () {
    mapSidebar.classList.toggle("expanded");
});

closeButton.addEventListener("click", function () {
    mapSidebar.classList.remove("expanded");
});