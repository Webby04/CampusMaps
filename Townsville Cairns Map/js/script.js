var buildingLabels = [];

let campusLoadGeneration = 0;
let zoomEndHandler = null;


// ------- Building Labels -------


function addBuildingLabel(feature, layer) {
    // Handle clicks on the existing building layer.
    layer.on("click", function () {
        if (typeof handleBuildingDirections === "function") {
            handleBuildingDirections(feature, layer);
        }
    });

    var center = layer.getBounds().getCenter();

    var buildingNumber = feature.properties.buildingTag ??
        feature.properties.buildingNumber;

    if (buildingNumber == null) {
        return;
    }

    buildingNumber = String(buildingNumber);

    var buildingName = feature.properties.buildingName;

    var label = L.marker(center, {
        icon: L.divIcon({
            className: "building-label",
            html: buildingNumber,
            iconSize: [40, 20],
            iconAnchor: [20, 10]
        }),
        interactive: true,
        bubblingMouseEvents: false,
    });

    // Handle clicks directly on the building number/name Label.
    label.on("click", function () {
        if (typeof handleBuildingDirections === "function") {
            handleBuildingDirections(feature, layer);
        } else {
            console.error("handleBuildingDirections() is not defined.");
        }
    });

    buildingLabels.push({
        number: buildingNumber,
        name: buildingName,
        label: label
    });
}


// ------- Filter Visibility -------

function updateFilterVisibility() {

    // ------- Parking -------

    if ((standardParkingCheckbox.checked || standardParkingCheckbox.indeterminate) && freeParkingCheckbox.checked) {
        map.addLayer(freeParkingIcons);
    } else {
        map.removeLayer(freeParkingIcons);
    }

    if ((standardParkingCheckbox.checked || standardParkingCheckbox.indeterminate) && freevPermitCheckbox.checked) {
        map.addLayer(freevPermitIcons);
    } else {
        map.removeLayer(freevPermitIcons);
    }

    if ((standardParkingCheckbox.checked || standardParkingCheckbox.indeterminate) && paidAllDayCheckbox.checked) {
        map.addLayer(paidAllDayIcons);
    } else {
        map.removeLayer(paidAllDayIcons);
    }

    if ((standardParkingCheckbox.checked || standardParkingCheckbox.indeterminate) && paid4hrMaxCheckbox.checked) {
        map.addLayer(paid4hrMaxIcons);
    } else {
        map.removeLayer(paid4hrMaxIcons);
    }

    if ((restrictedParkingCheckbox.checked || restrictedParkingCheckbox.indeterminate) && residentialCheckbox.checked) {
        map.addLayer(residentialIcons);
    } else {
        map.removeLayer(residentialIcons);
    }

    if ((restrictedParkingCheckbox.checked || restrictedParkingCheckbox.indeterminate) && premiumCheckbox.checked) {
        map.addLayer(premiumIcons);
    } else {
        map.removeLayer(premiumIcons);
    }

    // ------- Special Parking -------

    if ((restrictedParkingCheckbox.checked || restrictedParkingCheckbox.indeterminate) && specialParkingCheckbox.checked && commercialCheckbox.checked) {
        map.addLayer(commercialIcons);
    } else {
        map.removeLayer(commercialIcons);
    }

    if ((restrictedParkingCheckbox.checked || restrictedParkingCheckbox.indeterminate) && specialParkingCheckbox.checked && reservedCheckbox.checked) {
        map.addLayer(reservedIcons);
    } else {
        map.removeLayer(reservedIcons);
    }

    if ((restrictedParkingCheckbox.checked || restrictedParkingCheckbox.indeterminate) && specialParkingCheckbox.checked && loadingCheckbox.checked) {
        map.addLayer(loadingIcons);
    } else {
        map.removeLayer(loadingIcons);
    }

    if ((restrictedParkingCheckbox.checked || restrictedParkingCheckbox.indeterminate) && specialParkingCheckbox.checked && visitorCheckbox.checked) {
        map.addLayer(visitorIcons);
    } else {
        map.removeLayer(visitorIcons);
    }

    if ((restrictedParkingCheckbox.checked || restrictedParkingCheckbox.indeterminate) && specialParkingCheckbox.checked && serviceCheckbox.checked) {
        map.addLayer(serviceIcons);
    } else {
        map.removeLayer(serviceIcons);
    }

    // ------- Motorcycle / Accessible -------

    if ((standardParkingCheckbox.checked || standardParkingCheckbox.indeterminate) && motorcycleCheckbox.checked) {
        map.addLayer(motorcycleIcons);
    } else {
        map.removeLayer(motorcycleIcons);
    }

    if ((standardParkingCheckbox.checked || standardParkingCheckbox.indeterminate) && accessibleCheckbox.checked) {
        map.addLayer(accessibleIcons);
    } else {
        map.removeLayer(accessibleIcons);
    }

    // ------- POIs -------

    if ((transportMobilityCheckbox.checked || transportMobilityCheckbox.indeterminate) && transportCheckbox.checked) {
        map.addLayer(transportIcons);
    } else {
        map.removeLayer(transportIcons);
    }

    if ((transportMobilityCheckbox.checked || transportMobilityCheckbox.indeterminate) && escooterCheckbox.checked) {
        map.addLayer(escooterIcons);
    } else {
        map.removeLayer(escooterIcons);
    }

    if ((transportMobilityCheckbox.checked || transportMobilityCheckbox.indeterminate) && evChargingCheckbox.checked) {
        map.addLayer(evChargingIcons);
    } else {
        map.removeLayer(evChargingIcons);
    }

    if ((transportMobilityCheckbox.checked || transportMobilityCheckbox.indeterminate) && bikeCheckbox.checked) {
        map.addLayer(bikeIcons);
    } else {
        map.removeLayer(bikeIcons);
    }

    if ((transportMobilityCheckbox.checked || transportMobilityCheckbox.indeterminate) && bikewsCheckbox.checked) {
        map.addLayer(bikewsIcons);
    } else {
        map.removeLayer(bikewsIcons);
    }

    if ((foodServicesCheckbox.checked || foodServicesCheckbox.indeterminate) && foodBevCheckbox.checked) {
        map.addLayer(foodBevIcons);
    } else {
        map.removeLayer(foodBevIcons);
    }

    if ((foodServicesCheckbox.checked || foodServicesCheckbox.indeterminate) && atmCheckbox.checked) {
        map.addLayer(atmIcons);
    } else {
        map.removeLayer(atmIcons);
    }

    if ((safetySecurityCheckbox.checked || safetySecurityCheckbox.indeterminate) && helpPhoneCheckbox.checked) {
        map.addLayer(helpPhoneIcons);
    } else {
        map.removeLayer(helpPhoneIcons);
    }

    if ((safetySecurityCheckbox.checked || safetySecurityCheckbox.indeterminate) && securityCheckbox.checked) {
        map.addLayer(securityIcons);
    } else {
        map.removeLayer(securityIcons);
    }

    if ((safetySecurityCheckbox.checked || safetySecurityCheckbox.indeterminate) && defibCheckbox.checked) {
        map.addLayer(defibIcons);
    } else {
        map.removeLayer(defibIcons);
    }

    if ((amenitiesCheckbox.checked || amenitiesCheckbox.indeterminate) && kitchenettesCheckbox.checked) {
        map.addLayer(kitchenettesIcons);
    } else {
        map.removeLayer(kitchenettesIcons);
    }

    if ((amenitiesCheckbox.checked || amenitiesCheckbox.indeterminate) && parentRoomCheckbox.checked) {
        map.addLayer(parentRoomIcons);
    } else {
        map.removeLayer(parentRoomIcons);
    }

    if ((amenitiesCheckbox.checked || amenitiesCheckbox.indeterminate) && wellnessCheckbox.checked) {
        map.addLayer(wellnessIcons);
    } else {
        map.removeLayer(wellnessIcons);
    }

    if ((amenitiesCheckbox.checked || amenitiesCheckbox.indeterminate) && showerCheckbox.checked) {
        map.addLayer(showerIcons);
    } else {
        map.removeLayer(showerIcons);
    }

    if ((amenitiesCheckbox.checked || amenitiesCheckbox.indeterminate) && pwdCheckbox.checked) {
        map.addLayer(pwdIcons);
    } else {
        map.removeLayer(pwdIcons);
    }

    if (infoCheckbox.checked) {
        map.addLayer(infoIcons);
    } else {
        map.removeLayer(infoIcons);
    }
}

// ------- Parent / Child Checkbox Synchronisation -------

function updateParentCheckbox(parent, children) {
    const availableChildren = children.filter(child => !child.disabled);
    const checkedChildren = availableChildren.filter(child => child.checked).length;

    if (checkedChildren === 0) {
        parent.checked = false;
        parent.indeterminate = false;
    } else if (checkedChildren === availableChildren.length) {
        parent.checked = true;
        parent.indeterminate = false;
    } else {
        parent.checked = false;
        parent.indeterminate = true;
    }
}

const standardParkingChildren = [freeParkingCheckbox, freevPermitCheckbox, paidAllDayCheckbox, paid4hrMaxCheckbox, motorcycleCheckbox, accessibleCheckbox];
const specialParkingChildren = [commercialCheckbox, reservedCheckbox, loadingCheckbox, visitorCheckbox, serviceCheckbox];
const restrictedParkingChildren = [residentialCheckbox, premiumCheckbox, specialParkingCheckbox];
const transportMobilityChildren = [transportCheckbox, escooterCheckbox, evChargingCheckbox, bikeCheckbox, bikewsCheckbox];
const amenitiesChildren = [kitchenettesCheckbox, parentRoomCheckbox, wellnessCheckbox, showerCheckbox, pwdCheckbox];
const safetySecurityChildren = [helpPhoneCheckbox, securityCheckbox, defibCheckbox];
const foodServicesChildren = [foodBevCheckbox, infoCheckbox, atmCheckbox];


standardParkingChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(standardParkingCheckbox, standardParkingChildren);
        updateFilterVisibility();
    });
});

[residentialCheckbox, premiumCheckbox, specialParkingCheckbox].forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(restrictedParkingCheckbox, restrictedParkingChildren);
        updateFilterVisibility();
    });
});

specialParkingChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(specialParkingCheckbox, specialParkingChildren);
        updateParentCheckbox(restrictedParkingCheckbox, restrictedParkingChildren);
        updateFilterVisibility();
    });
});

transportMobilityChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(transportMobilityCheckbox, transportMobilityChildren);
        updateFilterVisibility();
    });
});

amenitiesChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(amenitiesCheckbox, amenitiesChildren);
        updateFilterVisibility();
    });
});

safetySecurityChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(safetySecurityCheckbox, safetySecurityChildren);
        updateFilterVisibility();
    });
});

foodServicesChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(foodServicesCheckbox, foodServicesChildren);
        updateFilterVisibility();
    });
});

function setupParentCheckbox(parent, children) {
    parent.addEventListener('change', () => {
        children.forEach(child => {
            child.checked = parent.checked;
        });

        parent.indeterminate = false;
        updateFilterVisibility();
    });
}
setupParentCheckbox(standardParkingCheckbox, standardParkingChildren);

restrictedParkingCheckbox.addEventListener('change', () => {
    residentialCheckbox.checked = restrictedParkingCheckbox.checked;
    premiumCheckbox.checked = restrictedParkingCheckbox.checked;
    specialParkingCheckbox.checked = restrictedParkingCheckbox.checked;
    specialParkingCheckbox.indeterminate = false;

    specialParkingChildren.forEach(child => {
        child.checked = restrictedParkingCheckbox.checked;
    });

    restrictedParkingCheckbox.indeterminate = false;

    updateFilterVisibility();
});
setupParentCheckbox(specialParkingCheckbox, specialParkingChildren);
setupParentCheckbox(transportMobilityCheckbox, transportMobilityChildren);
setupParentCheckbox(amenitiesCheckbox, amenitiesChildren);
setupParentCheckbox(safetySecurityCheckbox, safetySecurityChildren);
setupParentCheckbox(foodServicesCheckbox, foodServicesChildren);

// ------- Save and Restore Map Filter Settings -------

const filterStorageKey = 'jcuMapFilterSettings';

const savedFilterSettings = localStorage.getItem(filterStorageKey);

if (savedFilterSettings) {
    // Restore the user's previous selections
    const settings = JSON.parse(savedFilterSettings);

    document.querySelectorAll(".filter-menu input[type='checkbox']").forEach(checkbox => {
        if (settings[checkbox.id] !== undefined) {
            checkbox.checked = settings[checkbox.id];
        }
    });
} else {
    // First visit: set the default filters
    document.querySelectorAll(".filter-menu input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    });

    freeParkingCheckbox.checked = true;
    transportCheckbox.checked = true;
    foodBevCheckbox.checked = true;
    infoCheckbox.checked = true;
    pwdCheckbox.checked = true;
}

// Recalculate parent checkbox states
updateParentCheckbox(standardParkingCheckbox, standardParkingChildren);
updateParentCheckbox(restrictedParkingCheckbox, restrictedParkingChildren);
updateParentCheckbox(specialParkingCheckbox, specialParkingChildren);
updateParentCheckbox(transportMobilityCheckbox, transportMobilityChildren);
updateParentCheckbox(amenitiesCheckbox, amenitiesChildren);
updateParentCheckbox(safetySecurityCheckbox, safetySecurityChildren);
updateParentCheckbox(foodServicesCheckbox, foodServicesChildren);

// Update the map
updateFilterVisibility();

// Save settigns whenever a checkbox changes
document.querySelector(".filter-menu").addEventListener("change", function (){
    const settings = {};
    document.querySelectorAll(".filter-menu input[type='checkbox']").forEach(checkbox => {
        settings[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem(filterStorageKey, JSON.stringify(settings));
});

// ------- Automatically Expand categories with Active Filters -------

function expandActiveFilterCategories() {
    function expandCategory(buttonID, chevronID, contentID, checkboxes) {
        const hasActiveFilters = checkboxes.some(checkbox => checkbox.checked);
        if (hasActiveFilters) {
            const button = document.getElementById(buttonID);
            const chevron = document.getElementById(chevronID);
            const content = document.getElementById(contentID);
            
            content.hidden = false;
            content.classList.remove("hidden");

            chevron.classList.remove("fa-chevron-down");
            chevron.classList.add("fa-chevron-up");

            button.setAttribute("aria-expanded", "true");
        }
    }

    // Standard Parking
    expandCategory("standardParkingExpand", "standardParkingChevron", "standardParkingFilters", 
        [freeParkingCheckbox, freevPermitCheckbox, paidAllDayCheckbox, paid4hrMaxCheckbox, motorcycleCheckbox, accessibleCheckbox]);

    // Restricted Parking
    expandCategory("restrictedParkingExpand", "restrictedParkingChevron", "restrictedParkingFilters",
        [residentialCheckbox, premiumCheckbox, commercialCheckbox, reservedCheckbox, loadingCheckbox, visitorCheckbox, serviceCheckbox]);

    // Special Parking
    expandCategory("specialParkingExpand", "specialParkingChevron", "specialParkingFilters",
        [commercialCheckbox, reservedCheckbox, loadingCheckbox, visitorCheckbox, serviceCheckbox]);

    // Transport & Mobility
    expandCategory("transportMobilityExpand", "transportMobilityChevron", "transportMobilityFilters",
        [transportCheckbox, escooterCheckbox, evChargingCheckbox, bikeCheckbox, bikewsCheckbox]);

    // Amenities
    expandCategory("amenitiesExpand", "amenitiesChevron", "amenitiesFilters",
        [kitchenettesCheckbox, parentRoomCheckbox, wellnessCheckbox, showerCheckbox, pwdCheckbox]);

    // Safety & Security
    expandCategory("safetySecurityExpand", "safetySecurityChevron", "safetySecurityFilters",
        [helpPhoneCheckbox, securityCheckbox, defibCheckbox]);

    // Food & Services
    expandCategory("foodServicesExpand", "foodServicesChevron", "foodServicesFilters",
        [foodBevCheckbox, atmCheckbox]);

    // Expand the main Map Filters section
    const filters = document.getElementById("filters");
    const showAllButton = document.getElementById("showAllExpand");
    const showAllChevron = document.getElementById("showAllChevron");

    const hasActiveFilters = document.querySelectorAll(".filter-menu input[type='checkbox']:checked").length > 0;

    if (hasActiveFilters) {
        filters.hidden = false;
        filters.classList.remove("hidden");
        showAllChevron.classList.remove("fa-chevron-down");
        showAllChevron.classList.add("fa-chevron-up");
        showAllButton.setAttribute("aria-expanded", "true");
    }
}

expandActiveFilterCategories();

// ------- Load Campus Data -------

async function callbacktest(campus) {
    const generation = ++campusLoadGeneration;

    // Reset search results whenever the selected campus changes.
    window.jcuSearchIndex = {
        campus: campus,
        buildings: [],
        pois: [],
        parking: []
    };

    reloadDirections(campus).catch(error => {
        console.error("Directions reload failed:", error);
    });

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

    transportIcons.clearLayers();
    escooterIcons.clearLayers();
    evChargingIcons.clearLayers();
    bikeIcons.clearLayers();
    bikewsIcons.clearLayers();
    foodBevIcons.clearLayers();
    kitchenettesIcons.clearLayers();
    atmIcons.clearLayers();
    helpPhoneIcons.clearLayers();
    securityIcons.clearLayers();
    defibIcons.clearLayers();
    parentRoomIcons.clearLayers();
    infoIcons.clearLayers();
    wellnessIcons.clearLayers();
    showerIcons.clearLayers();
    pwdIcons.clearLayers();

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

    buildingLabels.forEach(function (building) {
        if (map.hasLayer(building.label)) {
            map.removeLayer(building.label);
        }
    });

    buildingLabels = [];


    // ------- Creeks -------

    let creekJSON = await fetch(`../data/mapsdata/${campus}_creeks.json`);
    let creekData = await creekJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    var creekLayer = L.geoJSON(creekData, {
        style: MAP_OBJECT_STYLES.CREEK
    })
    campusLayers.addLayer(creekLayer)


    // ------- Sports Fields -------

    let sportsfieldsJSON = await fetch(`../data/mapsdata/${campus}_sports_fields.json`);
    let sportsfieldsData = await sportsfieldsJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }
    var sportsfieldsLayer = L.geoJSON(sportsfieldsData, {
        style: MAP_OBJECT_STYLES.SPORTS_FIELD
    })
    campusLayers.addLayer(sportsfieldsLayer)

    // ------- Fences -------

    let fencesJSON = await fetch(`../data/mapsdata/${campus}_fences.json`);
    let fencesData = await fencesJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    var fencesLayer = L.geoJSON(fencesData, {
        style: MAP_OBJECT_STYLES.FENCE
    })
    campusLayers.addLayer(fencesLayer)

    // ------- Road Areas -------

    let roadareasJSON = await fetch(`../data/mapsdata/${campus}_road_areas.json`);
    let roadareasData = await roadareasJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    var roadareasLayer = L.geoJSON(roadareasData, {
        style: MAP_OBJECT_STYLES.ROAD_AREA
    })
    campusLayers.addLayer(roadareasLayer)

    // ------- Path Areas -------

    let pathareasJSON = await fetch(`../data/mapsdata/${campus}_path_areas.json`);
    let pathareasData = await pathareasJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    var pathareasLayer = L.geoJSON(pathareasData, {
        style: MAP_OBJECT_STYLES.PATH_AREA
    })
    campusLayers.addLayer(pathareasLayer)

    // ------- Path Center Lines -------

    let pathcenterlinesJSON = await fetch(`../data/mapsdata/${campus}_path_center_lines.json`);
    let pathcenterlinesData = await pathcenterlinesJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    var pathcenterlinesLayer = L.geoJSON(pathcenterlinesData, {
        style: MAP_OBJECT_STYLES.PATH_CENTER_LINE
    })
    campusLayers.addLayer(pathcenterlinesLayer)

    // ------- Parking -------

    let parkingJSON = await fetch(`../data/mapsdata/${campus}_parking.json`);
    let parkingData = await parkingJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    window.jcuSearchIndex.parking = parkingData.features || [];

    var otherParkingLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return !["FREE", "FREEVPERMIT", "PAID-ALL", "PAID-4HR", "RESIDENTIAL", "CEL-PREM", "COMMERCIAL", "RESERVED", "LOADING", "VISITOR", "SERVICE"].includes(feature.properties.parkType);
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING,
            onEachFeature: addParkingIcon
        }
    );

    parkingLayer.addLayer(otherParkingLayer);


    // ------- Free Parking -------

    freeParkingLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "FREE";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(freeParkingLayer);

    freeParkingLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("FREE")
        });
        marker.feature = layer.feature;
        marker.addTo(freeParkingIcons);
    });


    // ------- Free with Permit -------

    freevPermitLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "FREEVPERMIT";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(freevPermitLayer);

    freevPermitLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("FREEVPERMIT")
        });
        marker.feature = layer.feature;
        marker.addTo(freevPermitIcons);
    });


    // ------- Paid All Day -------

    paidAllDayLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "PAID-ALL";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(paidAllDayLayer);

    paidAllDayLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("PAID-ALL")
        });
        marker.feature = layer.feature;
        marker.addTo(paidAllDayIcons);
    });


    // ------- Paid 4 Hour -------

    paid4hrMaxLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "PAID-4HR";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(paid4hrMaxLayer);

    paid4hrMaxLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("PAID-4HR")
        });
        marker.feature = layer.feature;
        marker.addTo(paid4hrMaxIcons);
    });


    // ------- Residential -------

    residentialLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "RESIDENTIAL";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(residentialLayer);

    residentialLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("RESIDENTIAL")
        });
        marker.feature = layer.feature;
        marker.addTo(residentialIcons);
    });


    // ------- Premium -------

    premiumLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "CEL-PREM";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(premiumLayer);

    premiumLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("CEL-PREM")
        });

        marker.feature = layer.feature;
        marker.addTo(premiumIcons);
    });

    // ------- Commercial -------

    commercialLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "COMMERCIAL";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(commercialLayer);

    commercialLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("COMMERCIAL")
        });
        marker.feature = layer.feature;
        marker.addTo(commercialIcons);
    });

    // ------- Reserved -------

    reservedLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "RESERVED";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(reservedLayer);

    reservedLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("RESERVED")
        });
        marker.feature = layer.feature;
        marker.addTo(reservedIcons);
    });

    // ------- Loading -------

    loadingLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "LOADING";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(loadingLayer);

    loadingLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("LOADING")
        });
        marker.feature = layer.feature;
        marker.addTo(loadingIcons);
    });

    // ------- Visitor -------

    visitorLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "VISITOR";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(visitorLayer);

    visitorLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("VISITOR")
        });
        marker.feature = layer.feature;
        marker.addTo(visitorIcons);
    });

    // ------- Service -------

    serviceLayer = L.geoJSON(
        {
            type: "FeatureCollection",
            features: parkingData.features.filter(function (feature) {
                return feature.properties.parkType === "SERVICE";
            })
        },
        {
            style: MAP_OBJECT_STYLES.PARKING
        }
    );

    parkingLayer.addLayer(serviceLayer);

    serviceLayer.eachLayer(function (layer) {
        var center = layer.getBounds().getCenter();

        var marker = L.marker(center, {
            icon: getParkingIcon("SERVICE")
        });
        marker.feature = layer.feature;
        marker.addTo(serviceIcons);
    });

    // ------- Nature Paths -------

    let naturepathsJSON = await fetch(`../data/mapsdata/${campus}_nature_paths.json`);
    let naturepathsData = await naturepathsJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    var naturepathsLayer = L.geoJSON(naturepathsData, {
        style: MAP_OBJECT_STYLES.NATURE_PATH
    })
    campusLayers.addLayer(naturepathsLayer)


    // ------- Buildings -------

    let buildingsJSON = await fetch(`../data/mapsdata/${campus}_buildings.json`);
    let buildingsData = await buildingsJSON.json();

    var Landmarks;
    var BuildingNames;

    if (campus === "tsv") {
        Landmarks = ["18", "26", "104", "134", "142", "500"];
        BuildingNames = ["18", "26", "99", "104", "134", "142", "143", "145", "168", "191", "206", "283", "500"];
    } else if (campus === "cns") {
        Landmarks = ["B1", "D3", "F1"];
        BuildingNames = ["B1", "D3", "D4", "F1"];
    }

    if (generation !== campusLoadGeneration) {
        return;
    }

    window.jcuSearchIndex.buildings = buildingsData.features || [];

    var buildingsLayer = L.geoJSON(buildingsData, {
        style: MAP_OBJECT_STYLES.BUILDING,
        onEachFeature: addBuildingLabel
    })
    campusLayers.addLayer(buildingsLayer)


    // ------- uilding Labels -------

    function updateBuildingLabels() {
        var zoom = map.getZoom();

        buildingLabels.forEach(function (building) {
            if (zoom <= 17) {
                if (Landmarks.includes(building.number)) {
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
                if (BuildingNames.includes(building.number)) {
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
                if (BuildingNames.includes(building.number)) {
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


    // ------- POIs -------

    let poiJSON = await fetch(`../data/mapsdata/${campus}_poi.json`);
    let poiData = await poiJSON.json();

    if (generation !== campusLoadGeneration) {
        return;
    }

    window.jcuSearchIndex.pois = poiData.features || [];

    // Invalidate cached Fuse indexes after all search data has loaded.
    invalidateSearchIndexes();

    updateCampusFilters(parkingData, poiData);

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

            marker.feature = feature;

            if (type === "MOTORC") {
                marker.addTo(motorcycleIcons);
                return;
            }

            if (type === "ACCPARK") {
                marker.addTo(accessibleIcons);
                return;
            }

            if (type === "TRANS") {
                marker.addTo(transportIcons);
                return;
            }

            if (type === "ESCOOTER") {
                marker.addTo(escooterIcons);
                return;
            }

            if (type === "EV_CHG") {
                marker.addTo(evChargingIcons);
                return;
            }

            if (type === "BIKE") {
                marker.addTo(bikeIcons);
                return;
            }

            if (type === "BIKEWS") {
                marker.addTo(bikewsIcons);
                return;
            }

            if (type === "CAFE" || type === "FOODBEV") {
                marker.addTo(foodBevIcons);
                return;
            }

            if (type === "KITCHENETTES") {
                marker.addTo(kitchenettesIcons);
                return;
            }

            if (type === "ATM") {
                marker.addTo(atmIcons);
                return;
            }

            if (type === "HELPPHONE") {
                marker.addTo(helpPhoneIcons);
                return;
            }

            if (type === "SECURITY") {
                marker.addTo(securityIcons);
                return;
            }

            if (type === "DEFIB") {
                marker.addTo(defibIcons);
                return;
            }

            if (type === "PARENT") {
                marker.addTo(parentRoomIcons);
                return;
            }

            if (type === "INFO") {
                marker.addTo(infoIcons);
                return;
            }

            if (type === "COMGARDEN" || type === "WELLNESS") {
                marker.addTo(wellnessIcons);
                return;
            }

            if (type === "SHWR") {
                marker.addTo(showerIcons);
                return;
            }

            if (type === "PWD") {
                marker.addTo(pwdIcons);
                return;
            }

            return marker;
        }
    })
    campusLayers.addLayer(poiLayer);


    // ------- Campus Bounds -------

    campusBounds = campusLayers.getBounds().pad(0.05);
    var campusCenter = campusBounds.getCenter();

    map.setView(campusCenter, 16);
    map.setMaxBounds(campusBounds);

    if (typeof checkUserLocationAgainstCampus === "function") {
        checkUserLocationAgainstCampus();
    }

    // ------- Update Filter Visibility -------

    updateFilterVisibility();

    saveOriginalClusterMarkers();
}

// ------- Campus Filter Visibility -------

function updateCampusFilters(parkingData, poiData) {

    const parkingTypes = new Set(
        parkingData.features.map(feature => feature.properties.parkType)
    );

    const poiTypes = new Set(
        poiData.features.map(feature => feature.properties.type)
    );

    function updateFilter(checkbox, available) {

        const filterElement = checkbox.closest(
            ".parking-option, .special-parking-option, .show-on-the-map-option"
        );

        if (filterElement) {
            filterElement.style.display = available ? "" : "none";
        }

        checkbox.disabled = !available;
    }

    // ------- Parking Filters -------

    updateFilter(freeParkingCheckbox, parkingTypes.has("FREE"));
    updateFilter(freevPermitCheckbox, parkingTypes.has("FREEVPERMIT"));
    updateFilter(paidAllDayCheckbox, parkingTypes.has("PAID-ALL"));
    updateFilter(paid4hrMaxCheckbox, parkingTypes.has("PAID-4HR"));
    updateFilter(residentialCheckbox, parkingTypes.has("RESIDENTIAL"));
    updateFilter(premiumCheckbox, parkingTypes.has("CEL-PREM"));

    // ------- Special Parking Filters -------

    updateFilter(commercialCheckbox, parkingTypes.has("COMMERCIAL"));
    updateFilter(reservedCheckbox, parkingTypes.has("RESERVED"));
    updateFilter(loadingCheckbox, parkingTypes.has("LOADING"));
    updateFilter(visitorCheckbox, parkingTypes.has("VISITOR"));
    updateFilter(serviceCheckbox, parkingTypes.has("SERVICE"));

    // ------- Motorcycle and Accessible -------

    updateFilter(motorcycleCheckbox, poiTypes.has("MOTORC"));
    updateFilter(accessibleCheckbox, poiTypes.has("ACCPARK"));

    // ------- POI Filters -------

    updateFilter(transportCheckbox, poiTypes.has("TRANS"));
    updateFilter(escooterCheckbox, poiTypes.has("ESCOOTER"));
    updateFilter(evChargingCheckbox, poiTypes.has("EV_CHG"));
    updateFilter(bikeCheckbox, poiTypes.has("BIKE"));
    updateFilter(bikewsCheckbox, poiTypes.has("BIKEWS"));

    updateFilter(
        foodBevCheckbox,
        ["CAFE", "FOODBEV"].some(type => poiTypes.has(type))
    );

    updateFilter(atmCheckbox, poiTypes.has("ATM"));
    updateFilter(helpPhoneCheckbox, poiTypes.has("HELPPHONE"));
    updateFilter(securityCheckbox, poiTypes.has("SECURITY"));
    updateFilter(defibCheckbox, poiTypes.has("DEFIB"));
    updateFilter(parentRoomCheckbox, poiTypes.has("PARENT"));
    updateFilter(infoCheckbox, poiTypes.has("INFO"));
    updateFilter(kitchenettesCheckbox, poiTypes.has("KITCHENETTES"));

    updateFilter(
        wellnessCheckbox,
        ["COMGARDEN", "WELLNESS"].some(type => poiTypes.has(type))
    );

    updateFilter(showerCheckbox, poiTypes.has("SHWR"));
    updateFilter(pwdCheckbox, poiTypes.has("PWD"));
}

// ------- Load Initial Campus -------

callbacktest("tsv");

document.querySelector('[data-campus="tsv"]').classList.add("selected");