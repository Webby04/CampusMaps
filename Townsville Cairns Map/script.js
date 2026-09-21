var map = L.map('map').setView([-19.328, 146.756], 16);

fetch("../data/mapsdata/tsv_fences.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });

fetch("../data/mapsdata/tsv_creeks.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });

fetch("../data/mapsdata/tsv_sports_fields.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });

fetch("../data/mapsdata/tsv_road_areas.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });

fetch("../data/mapsdata/tsv_parking.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });       

fetch("../data/mapsdata/tsv_path_areas.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });    

fetch("../data/mapsdata/tsv_nature_paths.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });   
    
fetch("../data/mapsdata/tsv_buildings.json")
    .then((response) => response.json())
    .then((data) => {
        L.geoJSON(data).addTo(map)
    });     