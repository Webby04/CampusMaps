var map = L.map('map', {
    minZoom: 16,
    maxZoom: 19,
    maxBoundsViscosity: 1.0
}).setView([-19.328, 146.756], 16);

var campusLayers = L.featureGroup().addTo(map);
var parkingLayer = L.featureGroup().addTo(map);
var freeParkingLayer = null;
var parkingIcons = L.featureGroup().addTo(map);
var freeParkingIcons = L.featureGroup().addTo(map);
var freevPermitLayer = null;
var freevPermitIcons = L.featureGroup().addTo(map);
var paidAllDayLayer = null;
var paidAllDayIcons = L.featureGroup().addTo(map);
var paid4hrMaxLayer = null;
var paid4hrMaxIcons = L.featureGroup().addTo(map);
var residentialLayer = null;
var residentialIcons = L.featureGroup().addTo(map);
var premiumLayer = null;
var premiumIcons = L.featureGroup().addTo(map);
var commercialIcons = L.featureGroup().addTo(map);
var reservedIcons = L.featureGroup().addTo(map);
var loadingIcons = L.featureGroup().addTo(map);
var visitorIcons = L.featureGroup().addTo(map);
var serviceIcons = L.featureGroup().addTo(map);
var motorcycleIcons = L.featureGroup().addTo(map);
var accessibleIcons = L.featureGroup().addTo(map);

var poiLayer = null;

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
    var parkType = feature.properties.parkType;

    var marker = L.marker(center, {
        icon: getParkingIcon(parkType)
    });

    if (parkType === "COMMERCIAL") {
        marker.addTo(commercialIcons);
    } else if (parkType === "RESERVED") {
        marker.addTo(reservedIcons);
    } else if (parkType === "LOADING") {
        marker.addTo(loadingIcons);
    } else if (parkType === "VISITOR") {
        marker.addTo(visitorIcons);
    } else if (parkType === "SERVICE") {
        marker.addTo(serviceIcons);
    } else {
        marker.addTo(parkingIcons);
    }
}

var buildingLabels = [];

function addBuildingLabel(feature, layer) {
    var center = layer.getBounds().getCenter();

    var buildingNumber = String(feature.properties.buildingTag);
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

    parkingIcons.clearLayers();
    freeParkingIcons.clearLayers();
    freevPermitIcons.clearLayers();
    paidAllDayIcons.clearLayers();
    paid4hrMaxIcons.clearLayers();
    residentialIcons.clearLayers();
    premiumIcons.clearLayers();

    commercialIcons.clearLayers();
    reservedIcons.clearLayers();
    loadingIcons.clearLayers();
    visitorIcons.clearLayers();
    serviceIcons.clearLayers();

    motorcycleIcons.clearLayers();
    accessibleIcons.clearLayers();

    campusLayers.clearLayers();
    parkingLayer.clearLayers();

    if (freeParkingLayer) {
        map.removeLayer(freeParkingLayer);
    }
    if (freevPermitLayer) {
        map.removeLayer(freevPermitLayer);
    }
    if (paidAllDayLayer) {
        map.removeLayer(paidAllDayLayer);
    }
    if (paid4hrMaxLayer) {
        map.removeLayer(paid4hrMaxLayer);
    }
    if (residentialLayer) {
        map.removeLayer(residentialLayer);
    }
    if (premiumLayer) {
        map.removeLayer(premiumLayer);
    }

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

    var otherParkingLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function(feature) {
                return feature.properties.parkType !== "FREE" &&
                feature.properties.parkType !== "FREEVPERMIT" &&
                feature.properties.parkType !== "PAID-ALL" &&
                feature.properties.parkType !== "PAID-4HR" &&
                feature.properties.parkType !== "RESIDENTIAL" &&
                feature.properties.parkType !== "CEL-PREM";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING,
            onEachFeature: addParkingIcon
        }
    );

    parkingLayer.addLayer(otherParkingLayer);

    freeParkingLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function(feature) {
                return feature.properties.parkType === "FREE";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(freeParkingLayer);

    freeParkingLayer.eachLayer(function(layer) {
        var center = layer.getBounds().getCenter();

        L.marker(center, {
            icon: getParkingIcon("FREE")
        }).addTo(freeParkingIcons);
    });

    freevPermitLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function(feature) {
                return feature.properties.parkType === "FREEVPERMIT";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(freevPermitLayer);

    freevPermitLayer.eachLayer(function(layer) {
        var center = layer.getBounds().getCenter();

        L.marker(center, {
            icon: getParkingIcon("FREEVPERMIT")
        }).addTo(freevPermitIcons);
    });

    paidAllDayLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function(feature) {
                return feature.properties.parkType === "PAID-ALL";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(paidAllDayLayer);

    paidAllDayLayer.eachLayer(function(layer) {
        var center = layer.getBounds().getCenter();

        L.marker(center, {
            icon: getParkingIcon("PAID-ALL")
        }).addTo(paidAllDayIcons);
    });

    paid4hrMaxLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function(feature) {
                return feature.properties.parkType === "PAID-4HR";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(paid4hrMaxLayer);

    paid4hrMaxLayer.eachLayer(function(layer) {
        var center = layer.getBounds().getCenter();

        L.marker(center, {
            icon: getParkingIcon("PAID-4HR")
        }).addTo(paid4hrMaxIcons);
    });

    residentialLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function(feature) {
                return feature.properties.parkType === "RESIDENTIAL";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(residentialLayer);

    residentialLayer.eachLayer(function(layer) {
        var center = layer.getBounds().getCenter();

        L.marker(center, {
            icon: getParkingIcon("RESIDENTIAL")
        }).addTo(residentialIcons);
    });

    premiumLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function(feature) {
                return feature.properties.parkType === "CEL-PREM";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(premiumLayer);

    premiumLayer.eachLayer(function(layer) {
        var center = layer.getBounds().getCenter();

        L.marker(center, {
            icon: getParkingIcon("CEL-PREM")
        }).addTo(premiumIcons);
    });

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
        FirstZoomBuildings = ["18", "26", "104", "134", "142", "500" ];
        SecondZoomBuildings = ["18", "26", "99", "104", "134", "142", "143", "145", "168", "191", "206", "283", "500" ];
    } else if (campus ==="cns") {
        FirstZoomBuildings = ["B1", "D3", "F1"];
        SecondZoomBuildings = ["B1", "D3", "D4", "F1"];
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
    poiLayer = L.geoJSON(poiData, {
        pointToLayer: function (feature, latlng) {
            var type = feature.properties.type;
            var icon = getPOIIcon(type);

            if (icon == null) {
                return;
            }

            var marker = L.marker(latlng, {
                icon: icon
            });

            if (type === "MOTORC") {
                marker.addTo(motorcycleIcons);
                return;
            }

            if (type === "ACCPARK") {
                marker.addTo(accessibleIcons);
                return;
            }

            return marker;
        }
    })
    campusLayers.addLayer(poiLayer);

    var campusBounds = campusLayers.getBounds().pad(0.05);
    var campusCenter = campusBounds.getCenter();

    map.setView(campusCenter, 16);
    map.setMaxBounds(campusBounds);

    if (!showAllCheckbox.checked || !parkingCheckbox.checked) {
        map.removeLayer(parkingIcons);
    } else {
        map.addLayer(parkingIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !freeParkingCheckbox.checked) {
        map.removeLayer(freeParkingIcons);
    } else {
        map.addLayer(freeParkingIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !freevPermitCheckbox.checked) {
        map.removeLayer(freevPermitIcons);
    } else {
        map.addLayer(freevPermitIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !paidAllDayCheckbox.checked) {
        map.removeLayer(paidAllDayIcons);
    } else {
        map.addLayer(paidAllDayIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !paid4hrMaxCheckbox.checked) {
        map.removeLayer(paid4hrMaxIcons);
    } else {
        map.addLayer(paid4hrMaxIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !residentialCheckbox.checked) {
        map.removeLayer(residentialIcons);
    } else {
        map.addLayer(residentialIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !premiumCheckbox.checked) {
        map.removeLayer(premiumIcons);
    } else {
        map.addLayer(premiumIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !motorcycleCheckbox.checked) {
        map.removeLayer(motorcycleIcons);
    } else {
        map.addLayer(motorcycleIcons);
    }
    
    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !accessibleCheckbox.checked) {
        map.removeLayer(accessibleIcons);
    } else {
        map.addLayer(accessibleIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !specialParkingCheckbox.checked ||!commercialCheckbox.checked) {
        map.removeLayer(commercialIcons);
    } else {
        map.addLayer(commercialIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !specialParkingCheckbox.checked ||!reservedCheckbox.checked) {
        map.removeLayer(reservedIcons);
    } else {
        map.addLayer(reservedIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !specialParkingCheckbox.checked ||!loadingCheckbox.checked) {
        map.removeLayer(loadingIcons);
    } else {
        map.addLayer(loadingIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !specialParkingCheckbox.checked ||!visitorCheckbox.checked) {
        map.removeLayer(visitorIcons);
    } else {
        map.addLayer(visitorIcons);
    }

    if (!showAllCheckbox.checked || !parkingCheckbox.checked || !specialParkingCheckbox.checked || !serviceCheckbox.checked) {
        map.removeLayer(serviceIcons);
    } else {
        map.addLayer(serviceIcons);
    }

    if (!showAllCheckbox.checked) {
        map.removeLayer(poiLayer);
    }
}

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
        case 'SERVICE':
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
    map.invalidateSize();
});

closeButton.addEventListener("click", function () {
    mapSidebar.classList.remove("expanded");
    map.invalidateSize();
});

const showAllExpand = document.getElementById("showAllExpand");
const showAllChevron = document.getElementById("showAllChevron");
const filters = document.getElementById("filters");
const showAllCheckbox = document.getElementById("showAllCheckbox");
const parkingCheckbox = document.getElementById("parkingCheckbox");
const freeParkingCheckbox = document.getElementById("freeParkingCheckbox");
const freevPermitCheckbox = document.getElementById("freevPermitCheckbox");
const paidAllDayCheckbox = document.getElementById("paidAllDayCheckbox");
const paid4hrMaxCheckbox = document.getElementById("paid4hrMaxCheckbox");
const residentialCheckbox = document.getElementById("residentialCheckbox");
const premiumCheckbox = document.getElementById("premiumCheckbox");
const specialParkingCheckbox = document.getElementById("specialParkingCheckbox");
const commercialCheckbox = document.getElementById("commercialCheckbox");
const reservedCheckbox = document.getElementById("reservedCheckbox");
const loadingCheckbox = document.getElementById("loadingCheckbox");
const visitorCheckbox = document.getElementById("visitorCheckbox");
const serviceCheckbox = document.getElementById("serviceCheckbox");
const motorcycleCheckbox = document.getElementById("motorcycleCheckbox");
const accessibleCheckbox = document.getElementById("accessibleCheckbox");


showAllCheckbox.addEventListener("change", function () {
    parkingCheckbox.checked = this.checked;
    freeParkingCheckbox.checked = this.checked;
    freevPermitCheckbox.checked = this.checked;
    paidAllDayCheckbox.checked = this.checked;
    paid4hrMaxCheckbox.checked = this.checked;
    residentialCheckbox.checked = this.checked;
    premiumCheckbox.checked = this.checked;
    specialParkingCheckbox.checked = this.checked;
    commercialCheckbox.checked = this.checked;
    reservedCheckbox.checked = this.checked;
    loadingCheckbox.checked = this.checked;
    visitorCheckbox.checked = this.checked;
    serviceCheckbox.checked = this.checked;
    motorcycleCheckbox.checked = this.checked;
    accessibleCheckbox.checked = this.checked;

    if (this.checked) {
        map.addLayer(parkingIcons);
        map.addLayer(freeParkingIcons);
        map.addLayer(freevPermitIcons);
        map.addLayer(paidAllDayIcons);
        map.addLayer(paid4hrMaxIcons);
        map.addLayer(residentialIcons);
        map.addLayer(premiumIcons);
        map.addLayer(commercialIcons);
        map.addLayer(reservedIcons);
        map.addLayer(loadingIcons);
        map.addLayer(visitorIcons);
        map.addLayer(serviceIcons);
        map.addLayer(motorcycleIcons);
        map.addLayer(accessibleIcons);
        map.addLayer(poiLayer);
    } else {
        map.removeLayer(parkingIcons);
        map.removeLayer(freeParkingIcons);  
        map.removeLayer(freevPermitIcons);
        map.removeLayer(paidAllDayIcons);
        map.removeLayer(paid4hrMaxIcons);
        map.removeLayer(residentialIcons);
        map.removeLayer(premiumIcons);
        map.removeLayer(commercialIcons);
        map.removeLayer(reservedIcons);
        map.removeLayer(loadingIcons);
        map.removeLayer(visitorIcons);
        map.removeLayer(serviceIcons);
        map.removeLayer(motorcycleIcons);
        map.removeLayer(accessibleIcons);
        map.removeLayer(poiLayer);
    }
});

parkingCheckbox.addEventListener("change", function () {
    freeParkingCheckbox.checked = this.checked;
    freevPermitCheckbox.checked = this.checked;
    paidAllDayCheckbox.checked = this.checked;
    paid4hrMaxCheckbox.checked = this.checked;
    residentialCheckbox.checked = this.checked;
    premiumCheckbox.checked = this.checked;
    specialParkingCheckbox.checked = this.checked;
    commercialCheckbox.checked = this.checked;
    reservedCheckbox.checked = this.checked;
    loadingCheckbox.checked = this.checked;
    visitorCheckbox.checked = this.checked;
    serviceCheckbox.checked = this.checked;
    motorcycleCheckbox.checked = this.checked;
    accessibleCheckbox.checked = this.checked;

    if (this.checked) {
        map.addLayer(parkingIcons);
        map.addLayer(freeParkingIcons);
        map.addLayer(freevPermitIcons);
        map.addLayer(paidAllDayIcons);
        map.addLayer(paid4hrMaxIcons);
        map.addLayer(residentialIcons);
        map.addLayer(premiumIcons);
        map.addLayer(commercialIcons);
        map.addLayer(reservedIcons);
        map.addLayer(loadingIcons);
        map.addLayer(visitorIcons);
        map.addLayer(serviceIcons);
        map.addLayer(motorcycleIcons);
        map.addLayer(accessibleIcons);
    } else {
        map.removeLayer(parkingIcons);
        map.removeLayer(freeParkingIcons);
        map.removeLayer(freevPermitIcons);
        map.removeLayer(paidAllDayIcons);
        map.removeLayer(paid4hrMaxIcons);
        map.removeLayer(residentialIcons);
        map.removeLayer(premiumIcons);
        map.removeLayer(commercialIcons);
        map.removeLayer(reservedIcons);
        map.removeLayer(loadingIcons);
        map.removeLayer(visitorIcons);
        map.removeLayer(serviceIcons);
        map.removeLayer(motorcycleIcons);
        map.removeLayer(accessibleIcons);
    }
});

freeParkingCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(freeParkingIcons);
    } else {
        map.removeLayer(freeParkingIcons);
    }
});

freevPermitCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(freevPermitIcons);
    } else {
        map.removeLayer(freevPermitIcons);
    }
});

paidAllDayCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(paidAllDayIcons);
    } else {
        map.removeLayer(paidAllDayIcons);
    }
});

paid4hrMaxCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(paid4hrMaxIcons);
    } else {
        map.removeLayer(paid4hrMaxIcons);
    }
});
residentialCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(residentialIcons);
    } else {
        map.removeLayer(residentialIcons);
    }
});

premiumCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(premiumIcons);
    } else {
        map.removeLayer(premiumIcons);
    }
});

specialParkingCheckbox.addEventListener("change", function () {
    commercialCheckbox.checked = this.checked;
    reservedCheckbox.checked = this.checked;
    loadingCheckbox.checked = this.checked;
    visitorCheckbox.checked = this.checked;
    serviceCheckbox.checked = this.checked;

    if (this.checked) {
        map.addLayer(commercialIcons);
        map.addLayer(reservedIcons);
        map.addLayer(loadingIcons);
        map.addLayer(visitorIcons);
        map.addLayer(serviceIcons);
    } else {
        map.removeLayer(commercialIcons);
        map.removeLayer(reservedIcons);
        map.removeLayer(loadingIcons);
        map.removeLayer(visitorIcons);
        map.removeLayer(serviceIcons);
    }
});

commercialCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(commercialIcons);
    } else {
        map.removeLayer(commercialIcons);
    }
});

motorcycleCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(motorcycleIcons);
    } else {
        map.removeLayer(motorcycleIcons);
    }
});

accessibleCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(accessibleIcons);
    } else {
        map.removeLayer(accessibleIcons);
    }
});

reservedCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(reservedIcons);
    } else {
        map.removeLayer(reservedIcons);
    }
});

loadingCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(loadingIcons);
    } else {
        map.removeLayer(loadingIcons);
    }
});

visitorCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(visitorIcons);
    } else {
        map.removeLayer(visitorIcons);
    }
});

serviceCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(serviceIcons);
    } else {
        map.removeLayer(serviceIcons);
    }
});

function setupChevron(buttonID, chevronID, contentID) {
    const button = document.getElementById(buttonID);
    const chevron = document.getElementById(chevronID);
    const content = document.getElementById(contentID);

    button.addEventListener("click", () => {
        const isOpen = !content.classList.contains("hidden");

        if (isOpen) {
            content.classList.add("hidden");
            chevron.classList.remove("fa-chevron-up");
            chevron.classList.add("fa-chevron-down");
            button.setAttribute("aria-expanded", "false");
        } else {
            content.classList.remove("hidden");
            chevron.classList.remove("fa-chevron-down");
            chevron.classList.add("fa-chevron-up");
            button.setAttribute("aria-expanded", "true");
        }
    });
}

setupChevron("showAllExpand", "showAllChevron", "filters");
setupChevron("parkingExpand", "parkingChevron", "parkingFilters");
setupChevron("specialParkingExpand", "specialParkingChevron", "specialParkingFilters");

callbacktest("tsv");

document.querySelector('[data-campus="tsv"]').classList.add("selected");