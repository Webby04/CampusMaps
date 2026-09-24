var map = L.map('map', {
    minZoom: 16,
    maxZoom: 19
}).setView([-19.328, 146.756], 16);

async function callbacktest() {
    let creekJSON = await fetch("../data/mapsdata/tsv_creeks.json");
    L.geoJSON(await creekJSON.json(), {
        style: {
            color: "rgba(188, 210, 255, 0.80)",
            weight: 1,
            fillColor: "rgba(211, 226, 234, 1.00)",
            fillOpacity: 1
        }
    }).addTo(map)

    let sportsfieldsJSON = await fetch("../data/mapsdata/tsv_sports_fields.json");
    L.geoJSON(await sportsfieldsJSON.json(), {
        style: {
            color: "rgba(188, 210, 255, 0.80)",
            weight: 1,
            fillColor: "rgba(211, 226, 234, 1.00)",
            fillOpacity: 1
        }
    }).addTo(map)

    let fencesJSON = await fetch("../data/mapsdata/tsv_fences.json");
    L.geoJSON(await fencesJSON.json(), {
        style: {
            color: "rgba(170, 136, 136, 1.00)"
        }
    }).addTo(map)

    let roadareasJSON = await fetch("../data/mapsdata/tsv_road_areas.json");
    L.geoJSON(await roadareasJSON.json(), {
        style: {
            color: "rgba(153, 153, 153, 1.00)",
            weight: 1,
            fillColor: "rgba(255, 255, 255, 1.00)",
            fillOpacity: 1
        }
    }).addTo(map)

    let pathareasJSON = await fetch("../data/mapsdata/tsv_path_areas.json");
    L.geoJSON(await pathareasJSON.json(), {
        style: {
            color: "rgba(119, 153, 170, 1.00)",
            weight: 1,
            fillColor: "rgba(119, 153, 170, 1.00)",
            fillOpacity: 1
        }
    }).addTo(map)

    let pathcenterlinesJSON = await fetch("../data/mapsdata/tsv_path_center_lines.json");
    L.geoJSON(await pathcenterlinesJSON.json(), {
        style: {
            color: "rgba(119, 153, 170, 1.00)",
            weight: 2,
            lineCap: "round",
            lineJoin: "miter"
        }
    }).addTo(map)

    let parkingJSON = await fetch("../data/mapsdata/tsv_parking.json");
    L.geoJSON(await parkingJSON.json(), {
        style: {
            color: "rgba(153, 153, 153, 1.00)",
            weight: 1,
            fillColor: "rgba(243, 243, 243, 1.00)",
            fillOpacity: 1
        },
        onEachFeature: function (feature, layer) {
            var center = layer.getBounds().getCenter();

            L.marker(center, {
                icon: getParkingIcon(feature.properties.parkType)
            }).addTo(map);
        }
    }).addTo(map)

    let naturepathsJSON = await fetch("../data/mapsdata/tsv_nature_paths.json");
    L.geoJSON(await naturepathsJSON.json(), {
        style: {
            color: "rgba(102, 0, 153, 1.00)",
            weight: 2,
            dashArray: "1.5, 2.5"
        }
    }).addTo(map)

    let buildingsJSON = await fetch("../data/mapsdata/tsv_buildings.json");
    var FirstZoomBuildings = ["018", "026", "104", "134", "142", "500" ];
    var SecondZoomBuildings = ["018", "026", "99", "104", "134", "142", "143", "145", "168", "191", "206", "283", "500" ];

    var buildingLabels = [];

    L.geoJSON(await buildingsJSON.json(), {
        style: {
            color: "rgba(68, 170, 221, 1.00)",
            weight: 1,
            fillColor: "rgba(102, 221, 255, 1.00)",
            fillOpacity: 1
        },
        onEachFeature: function (feature, layer) {
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
    }).addTo(map)

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
    
    map.on("zoomend", updateBuildingLabels);

    let poiJSON = await fetch("../data/mapsdata/tsv_poi.json");
    L.geoJSON(await poiJSON.json(), {
        pointToLayer: function (feature, latlng) {
            var icon = getPOIIcon(feature.properties.type);

            if (icon == null) {
                return;
            }

            return L.marker(latlng, {
                icon: icon
            });
        }
    }).addTo(map);
}

callbacktest();

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
        html: `<i class="ri-parking-box-fill ${iconClass}"></i>`,
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
            iconHTML = `<span class="material-symbols-outlined">accessible</span>`;
            iconClass = 'poi-accpark'
            break;
        case 'TRANS':
            iconHTML = `<i class="ri-bus-line"></i>`;
            iconClass = 'poi-trans';
            break;
        case 'BIKE':
            iconHTML = `<span class="material-symbols-outlined">directions_bike</span>`;
            iconClass = 'poi-bike';
            break;
        case 'BIKEWS':
            iconHTML = `<i class="ri-wrench-fill"></i>`;
            iconClass = 'poi-bikews';
            break;
        case 'FOODBEV':
            iconHTML = `<span class="material-symbols-outlined">restaurant</span>`;
            iconClass = 'poi-foodbev';
            break;
        case 'ATM':
            iconHTML = `<span class="material-symbols-outlined">attach_money</span>`;
            iconClass = 'poi-atm';
            break;
        case 'HELPPHONE':
            iconHTML = `<i class="ri-phone-fill"></i>`;
            iconClass = 'poi-helpphone';
            break;
        case 'SECURITY':
            iconHTML = `<span class="material-symbols-outlined">security</span>`;
            iconClass = 'poi-security';
            break;
        case 'DEFIB':
            iconHTML = `<span class="material-symbols-outlined">heart_broken</span>`;
            iconClass = 'poi-defib';
            break; 
        case 'PARENT':
            iconHTML = `<i class="ri-parent-fill"></i>`;
            iconClass = 'poi-parent';
            break;      
        case 'INFO':
            iconHTML = `<i class="ri-information-fill"></i>`;
            iconClass = 'poi-info';
            break; 
        case 'WELLNESS':
            iconHTML = `<span class="material-symbols-outlined">menstrual_health</span>`;
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