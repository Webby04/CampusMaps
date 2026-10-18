var buildingLabels = [];

let campusLoadGeneration = 0;
let zoomEndHandler = null;


// ------- Building Labels -------

function addBuildingLabel(feature, layer) {
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
        })
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

    if (showAllCheckbox.checked && parkingCheckbox.checked) {
        map.addLayer(parkingIcons);
    } else {
        map.removeLayer(parkingIcons);
    }

    if (freeParkingCheckbox.checked) {
        map.addLayer(freeParkingIcons);
    } else {
        map.removeLayer(freeParkingIcons);
    }

    if (freevPermitCheckbox.checked) {
        map.addLayer(freevPermitIcons);
    } else {
        map.removeLayer(freevPermitIcons);
    }

    if (paidAllDayCheckbox.checked) {
        map.addLayer(paidAllDayIcons);
    } else {
        map.removeLayer(paidAllDayIcons);
    }

    if (paid4hrMaxCheckbox.checked) {
        map.addLayer(paid4hrMaxIcons);
    } else {
        map.removeLayer(paid4hrMaxIcons);
    }

    if (residentialCheckbox.checked) {
        map.addLayer(residentialIcons);
    } else {
        map.removeLayer(residentialIcons);
    }

    if (premiumCheckbox.checked) {
        map.addLayer(premiumIcons);
    } else {
        map.removeLayer(premiumIcons);
    }

    // ------- Special Parking -------

    if (commercialCheckbox.checked) {
        map.addLayer(commercialIcons);
    } else {
        map.removeLayer(commercialIcons);
    }

    if (reservedCheckbox.checked) {
        map.addLayer(reservedIcons);
    } else {
        map.removeLayer(reservedIcons);
    }

    if (loadingCheckbox.checked) {
        map.addLayer(loadingIcons);
    } else {
        map.removeLayer(loadingIcons);
    }

    if (visitorCheckbox.checked) {
        map.addLayer(visitorIcons);
    } else {
        map.removeLayer(visitorIcons);
    }

    if (serviceCheckbox.checked) {
        map.addLayer(serviceIcons);
    } else {
        map.removeLayer(serviceIcons);
    }

    // ------- Motorcycle / Accessible -------

    if (motorcycleCheckbox.checked) {
        map.addLayer(motorcycleIcons);
    } else {
        map.removeLayer(motorcycleIcons);
    }
    
    if (accessibleCheckbox.checked) {
        map.addLayer(accessibleIcons);
    } else {
        map.removeLayer(accessibleIcons);
    }

    // ------- POIs -------

    if (!showAllCheckbox.checked) {
        map.removeLayer(poiLayer);
    } else {
        map.addLayer(poiLayer);
    }
    

    if (transportCheckbox.checked) {
        map.addLayer(transportIcons);
    } else {
        map.removeLayer(transportIcons);
    }

    if (escooterCheckbox.checked) {
        map.addLayer(escooterIcons);
    } else {
        map.removeLayer(escooterIcons);
    }

    if (evChargingCheckbox.checked) {
        map.addLayer(evChargingIcons);
    } else {
        map.removeLayer(evChargingIcons);
    }

    if (bikeCheckbox.checked) {
        map.addLayer(bikeIcons);
    } else {
        map.removeLayer(bikeIcons);
    }

    if (bikewsCheckbox.checked) {
        map.addLayer(bikewsIcons);
    } else {
        map.removeLayer(bikewsIcons);
    }

    if (foodBevCheckbox.checked) {
        map.addLayer(foodBevIcons);
    } else {
        map.removeLayer(foodBevIcons);
    }

    if (atmCheckbox.checked) {
        map.addLayer(atmIcons);
    } else {
        map.removeLayer(atmIcons);
    }

    if (helpPhoneCheckbox.checked) {
        map.addLayer(helpPhoneIcons);
    } else {
        map.removeLayer(helpPhoneIcons);
    }

    if (securityCheckbox.checked) {
        map.addLayer(securityIcons);
    } else {
        map.removeLayer(securityIcons);
    }

    if (defibCheckbox.checked) {
        map.addLayer(defibIcons);
    } else {
        map.removeLayer(defibIcons);
    }

    if (parentRoomCheckbox.checked) {
        map.addLayer(parentRoomIcons);
    } else {
        map.removeLayer(parentRoomIcons);
    }

    if (infoCheckbox.checked) {
        map.addLayer(infoIcons);
    } else {
        map.removeLayer(infoIcons);
    }

    if (wellnessCheckbox.checked) {
        map.addLayer(wellnessIcons);
    } else {
        map.removeLayer(wellnessIcons);
    }

    if (showerCheckbox.checked) {
        map.addLayer(showerIcons);
    } else {
        map.removeLayer(showerIcons);
    }

    if (pwdCheckbox.checked) {
        map.addLayer(pwdIcons);
    } else {
        map.removeLayer(pwdIcons);
    }
}

// ------- Parent / Child Checkbox Synchronisation -------

function updateParentCheckbox(parent, children) {
    const checkedChildren = children.filter(child => child.checked).length;

    if (checkedChildren === 0) {
        parent.checked = false;
        parent.indeterminate = false;
    } else if (checkedChildren === children.length) {
        parent.checked = true;
        parent.indeterminate = false;
    } else {
        parent.checked = false;
        parent.indeterminate = true;
    }
}

const specialParkingChildren = [commercialCheckbox, reservedCheckbox, loadingCheckbox, visitorCheckbox, serviceCheckbox];
const parkingChildren = [freeParkingCheckbox, freevPermitCheckbox, paidAllDayCheckbox, paid4hrMaxCheckbox, residentialCheckbox, premiumCheckbox, ...specialParkingChildren, motorcycleCheckbox, accessibleCheckbox];
const poiChildren = [transportCheckbox, escooterCheckbox, evChargingCheckbox, bikeCheckbox, bikewsCheckbox, foodBevCheckbox, atmCheckbox, helpPhoneCheckbox, securityCheckbox, defibCheckbox, parentRoomCheckbox, infoCheckbox, wellnessCheckbox, showerCheckbox, pwdCheckbox];

[...parkingChildren, specialParkingCheckbox].forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(parkingCheckbox, parkingChildren);
        updateFilterVisibility();
    });
});

specialParkingChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(specialParkingCheckbox, specialParkingChildren);
        updateFilterVisibility();
    });
});

poiChildren.forEach(child => {
    child.addEventListener('change', () => {
        updateParentCheckbox(showOnMapCheckbox, poiChildren);
        updateFilterVisibility();
    });
});

// ------- Load Campus Data -------

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

    transportIcons.clearLayers();
    escooterIcons.clearLayers();
    evChargingIcons.clearLayers();
    bikeIcons.clearLayers();
    bikewsIcons.clearLayers();
    foodBevIcons.clearLayers();
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

    buildingLabels.forEach(function(building) {
        if (map.hasLayer(building.label)) {
            map.removeLayer(building.label);
        }
    });

    buildingLabels = [];


    // ------- Creeks -------

    let creekJSON = await fetch(`../data/mapsdata/${campus}_creeks.json`);
    let creekData = await creekJSON.json();
    
    if (generation !== campusLoadGeneration)  {
        return;
    }
    
    var creekLayer = L.geoJSON(creekData, {
        style: MAP_OBJECT_STYLES.CREEK
    })
    campusLayers.addLayer(creekLayer)


    // ------- Sports Fields -------

    let sportsfieldsJSON = await fetch(`../data/mapsdata/${campus}_sports_fields.json`);
    let sportsfieldsData = await sportsfieldsJSON.json();
    
    if (generation !== campusLoadGeneration)  {
        return;
    }
    var sportsfieldsLayer = L.geoJSON(sportsfieldsData, {
        style: MAP_OBJECT_STYLES.SPORTS_FIELD
    })
    campusLayers.addLayer(sportsfieldsLayer)

    // ------- Fences -------

    let fencesJSON = await fetch(`../data/mapsdata/${campus}_fences.json`);
    let fencesData = await fencesJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var fencesLayer = L.geoJSON(fencesData, {
        style: MAP_OBJECT_STYLES.FENCE
    })
    campusLayers.addLayer(fencesLayer)

    // ------- Road Areas -------

    let roadareasJSON = await fetch(`../data/mapsdata/${campus}_road_areas.json`);
    let roadareasData = await roadareasJSON.json();
    
    if (generation !== campusLoadGeneration)  {
        return;
    }

    var roadareasLayer = L.geoJSON(roadareasData, {
        style: MAP_OBJECT_STYLES.ROAD_AREA
    })
    campusLayers.addLayer(roadareasLayer)

    // ------- Path Areas -------

    let pathareasJSON = await fetch(`../data/mapsdata/${campus}_path_areas.json`);
    let pathareasData = await pathareasJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var pathareasLayer = L.geoJSON(pathareasData, {
        style: MAP_OBJECT_STYLES.PATH_AREA
    })
    campusLayers.addLayer(pathareasLayer)

    // ------- Path Center Lines -------

    let pathcenterlinesJSON = await fetch(`../data/mapsdata/${campus}_path_center_lines.json`);
    let pathcenterlinesData = await pathcenterlinesJSON.json();

    if (generation !== campusLoadGeneration)  {
        return;
    }

    var pathcenterlinesLayer = L.geoJSON(pathcenterlinesData, {
        style: MAP_OBJECT_STYLES.PATH_CENTER_LINE
    })
    campusLayers.addLayer(pathcenterlinesLayer)

    // ------- Parking -------

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


    // ------- Free Parking -------

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


    // ------- Free with Permit -------

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


    // ------- Paid All Day -------

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


    // ------- Paid 4 Hour -------

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


    // ------- Residential -------

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


    // ------- Premium -------

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


    // ------- Nature Paths -------

    let naturepathsJSON = await fetch(`../data/mapsdata/${campus}_nature_paths.json`);
    let naturepathsData = await naturepathsJSON.json();

    if (generation !== campusLoadGeneration)  {
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

    if (campus ==="tsv") {
        Landmarks = ["18", "26", "104", "134", "142", "500" ];
        BuildingNames = ["18", "26", "99", "104", "134", "142", "143", "145", "168", "191", "206", "283", "500" ];
    } else if (campus ==="cns") {
        Landmarks = ["B1", "D3", "F1"];
        BuildingNames = ["B1", "D3", "D4", "F1"];
    }

    if (generation !== campusLoadGeneration)  {
        return;
    }

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

    if (generation !== campusLoadGeneration)  {
        return;
    }

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
            
            if (type === "CAFE" || type === "KITCHENETTES" || type === "FOODBEV") {
                marker.addTo(foodBevIcons);
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
            ["CAFE", "KITCHENETTES", "FOODBEV"].some(type => poiTypes.has(type))
        );

        updateFilter(atmCheckbox, poiTypes.has("ATM"));
        updateFilter(helpPhoneCheckbox, poiTypes.has("HELPPHONE"));
        updateFilter(securityCheckbox, poiTypes.has("SECURITY"));
        updateFilter(defibCheckbox, poiTypes.has("DEFIB"));
        updateFilter(parentRoomCheckbox, poiTypes.has("PARENT"));
        updateFilter(infoCheckbox, poiTypes.has("INFO"));

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