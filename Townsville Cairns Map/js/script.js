var buildingLabels = [];

let campusLoadGeneration = 0;
let zoomEndHandler = null;


// ------- Building Labels -------

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


    // ------- uilding Labels -------

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


    // ------- POIs -------

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

            if (type === "TRANS") {
                marker.addTo(transportIcons);
                return;
            }

            return marker;
        }
    })
    campusLayers.addLayer(poiLayer);


    // ------- Campus Bounds -------

    var campusBounds = campusLayers.getBounds().pad(0.05);
    var campusCenter = campusBounds.getCenter();

    map.setView(campusCenter, 16);
    map.setMaxBounds(campusBounds);


    // ------- Set Parking Visibility -------

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


    // ------- Set POI Visibility -------
    
    if (!showAllCheckbox.checked || !showOnMapCheckbox.checked) {
        map.removeLayer(poiLayer);
        map.removeLayer(transportIcons);
    } else {
        map.addLayer(poiLayer);

        if (transportCheckbox.checked) {
            map.addLayer(transportIcons);
        } else {
            map.removeLayer(transportIcons);
        }
    }

    if (!showAllCheckbox.checked) {
        map.removeLayer(poiLayer);
    }
}


// ------- Load Initial Campus -------

callbacktest("tsv");

document.querySelector('[data-campus="tsv"]').classList.add("selected");