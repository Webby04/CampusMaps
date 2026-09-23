var map = L.map('map', {
    minZoom: 16,
    maxZoom: 19
}).setView([-19.328, 146.756], 16);

fetch("../data/mapsdata/tsv_creeks.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(188, 210, 255, 0.80)",
                weight: 1,
                fillColor: "rgba(211, 226, 234, 1.00)",
                fillOpacity: 1
            }
        }).addTo(map)
    });

fetch("../data/mapsdata/tsv_sports_fields.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(170, 221, 170, 1.00)",
                weight: 1,
                fillColor: "rgba(204, 228, 204, 1.00)",
                fillOpacity: 1
            }
        }).addTo(map)
    });

fetch("../data/mapsdata/tsv_fences.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(170, 136, 136, 1.00)"
            }
        }).addTo(map)
    });

fetch("../data/mapsdata/tsv_road_areas.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(153, 153, 153, 1.00)",
                weight: 1,
                fillColor: "rgba(255, 255, 255, 1.00)",
                fillOpacity: 1
            }
        }).addTo(map)
    });     

fetch("../data/mapsdata/tsv_path_areas.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(119, 153, 170, 1.00)",
                weight: 1,
                fillColor: "rgba(119, 153, 170, 1.00)",
                fillOpacity: 1
            }
        }).addTo(map)
    });

fetch("../data/mapsdata/tsv_path_center_lines.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(119, 153, 170, 1.00)",
                weight: 2,
                lineCap: "round",
                lineJoin: "miter"
            }
        }).addTo(map)
    }); 

fetch("../data/mapsdata/tsv_parking.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(153, 153, 153, 1.00)",
                weight: 1,
                fillColor: "rgba(243, 243, 243, 1.00)",
                fillOpacity: 1
            }
        }).addTo(map)
    });

fetch("../data/mapsdata/tsv_nature_paths.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data, {
            style: {
                color: "rgba(102, 0, 153, 1.00)",
                weight: 2,
                dashArray: "1.5, 2.5"
            }
        }).addTo(map)
    });   
    
fetch("../data/mapsdata/tsv_buildings.json")
    .then((response) => response.json())
    .then((data) => {
        var FirstZoomBuildings = ["018", "026", "104", "134", "142", "500" ];
        var SecondZoomBuildings = ["018", "026", "99", "104", "134", "142", "143", "145", "168", "191", "206", "283", "500" ];

        var buildingLabels = [];

        L.geoJSON(data, {
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
            })
        }
        updateBuildingLabels();

        map.on("zoomend", updateBuildingLabels)
    });  
    
// fetch("../data/mapsdata/tsv_poi.json")
//     .then((response) => response.json())
//     .then((data) => {
//         L.geoJSON(data).addTo(map)
//     });