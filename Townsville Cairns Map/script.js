var map = L.map('map').setView([-19.328, 146.756], 16);

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
        L.geoJSON(data, {
            style: {
                color: "rgba(68, 170, 221, 1.00)",
                weight: 1,
                fillColor: "rgba(102, 221, 255, 1.00)",
                fillOpacity: 1
            }
        }).addTo(map)
    });  
    
fetch("../data/mapsdata/tsv_poi.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });