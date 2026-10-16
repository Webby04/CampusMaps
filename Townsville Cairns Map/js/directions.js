const DIRECTIONS_DATA_PATH = "../data/mapsdata/";
const DIRECTIONS_CAMPUS = "tsv";
const MAX_PATH_SNAP_DISTANCE_METERS = 20;
const PATH_JOIN_TOLERANCE_METERS = 2;

const DIRECTIONS_FILES = {
    tsv: {
        buildings: "tsv_buildings.json",
        pois: "tsv_poi.json",
        path: "tsv_path_center_lines.json"
    },
    cns: {
        buildings: "cns_buildings.json",
        pois: "cns_poi.json",
        path: "cns_path_center_lines.json"
    }    
};

let directionsData = {};
let directionsClickLayer = null;
let directionsRouteLayer = null;
let directionsPathGraph = null;

function normaliseBuildingNumber(value) {
    if (value === null || value === undefined) return "";
    
    const valueAsText = String(value).trim();

    return /^\d+$/.test(valueAsText)
        ? String(Number(valueAsText))
        : valueAsText.toUpperCase();
}

function getBuildingNumber(feature) {
    const p = feature?.properties || {};

    return p.buildingNumber ?? p.buildingTag ?? p.buildingName ?? "";
}

function findDirectionBuilding(number) {
    const target = normaliseBuildingNumber(number);

    return directionsData.buildings?.features?.find(feature => normaliseBuildingNumber(getBuildingNumber(feature)) === target) || null;
}

function findDirectionFrontDoor(number) {
    const target = normaliseBuildingNumber(number);

    return directionsData.pois?.features?.find(feature => {
        const p = feature?.properties || {};
        const type = normaliseBuildingNumber(p.type).replace(/[\s_-]/g, "");

        const matchesBuilding = [p.description, p.buildingNumber, p.buildingTag, p.buildingName].some(value => value !== undefined && normaliseBuildingNumber(value) === target);
        return type === "FRONTDOOR" && matchesBuilding && feature.geometry?.type === "Point";
    }) || null;
}

async function loadDirectionsData(campus = DIRECTIONS_CAMPUS) {
    const files = DIRECTIONS_FILES[campus];

    if (!files) {
        throw new Error(`Unknown campus: ${campus}`);
    }

    async function loadFile(filename) {
        const response = await fetch(`${DIRECTIONS_DATA_PATH}${filename}`);

        if (!response.ok) {
            throw new Error(`Unable to load ${filename}: HTTP ${response.status}`);
        }

        return response.json();
    }

    const [building, pois, paths] = await Promise.all([
        loadFile(files.buildings),
        loadFile(files.pois),
        loadFile(files.path)
    ]);

    directionsData = { buildings: building, pois: pois, paths: paths };

    console.log("Directions data loaded:", {campus, buildings: building.features?.length ?? 0, pois: pois.features?.length ?? 0, path: paths.features?.length ?? 0 });
}

function createBuildingClickLayer() {
    if (directionsClickLayer) {
        map.removeLayer(directionsClickLayer);
    }

    directionsClickLayer = L.geoJSON(directionsData.buildings, {
        className: "directions-building-click-layer",

        onEachFeature: (feature, layer) => {
            layer.on("click", function () {
                console.log("Building clicked:", getBuildingNumber(feature));
                handleBuildingDirections(feature, layer);
            });
        }
    }).addTo(map);

    console.log("Directions click layer created:", directionsClickLayer);
}

function showDirectionsPopup(layer, message) {
    const location = layer.getBounds().getCenter();

    L.popup()
        .setLatLng(location)
        .setContent(message)
        .openOn(map);
}

function clearDirectionsRoute() {
    if (directionsRouteLayer) {
        map.removeLayer(directionsRouteLayer);
        directionsRouteLayer = null;
    }
}

function projectLatLng(latLng) {
    const projected = L.CRS.EPSG3857.project(latLng);
    const scale = Math.cos(latLng.lat * Math.PI / 180);
    
    return { x: projected.x * scale, y: projected.y * scale };
}

function projectCoordinate(coordinate) {
    const latLng = L.latLng(coordinate[1], coordinate[0]);
    return projectLatLng(latLng);
}

function distanceBetweenProjectedPoints(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function getPathCoordinateGroups(feature) {
    const geometry = feature?.geometry;
    if (!geometry) {
        return [];
    }

    if (geometry.type === "LineString") {
        return [geometry.coordinates];
    }
    if (geometry.type === "MultiLineString") {
        return geometry.coordinates;
    }

    return [];
}

function findOrCreateGraphNode(graph, coordinate) {
    const projected = projectCoordinate(coordinate);

    // Join coordinates that are effectively in the same location
    const existingNode = graph.nodes.find(node => distanceBetweenProjectedPoints(node.projected, projected) <= PATH_JOIN_TOLERANCE_METERS);
    if (existingNode) {
        return existingNode.id;
    }

    const node = { id: graph.nodes.length, coordinate, projected, neighbours: new Set() };
    graph.nodes.push(node);
    return node.id;
}

function buildPathGraph() {
    const graph = { nodes: [], segments: [] };

    const pathFeatures = directionsData.paths?.features || [];

    pathFeatures.forEach(feature => {
        const coordinateGroups = getPathCoordinateGroups(feature);

        coordinateGroups.forEach(coordinates => {
            if (coordinates.length < 2) {
                return;
            }

            for (let index = 0; index < coordinates.length - 1; index++) {
                const startCoordinate = coordinates[index];
                const endCoordinate = coordinates[index + 1];
                const startNodeId = findOrCreateGraphNode(graph, startCoordinate);
                const endNodeId = findOrCreateGraphNode(graph, endCoordinate);
                
                graph.nodes[startNodeId].neighbours.add(endNodeId);
                graph.nodes[endNodeId].neighbours.add(startNodeId);
                graph.segments.push({ startNodeId, endNodeId, start: graph.nodes[startNodeId].projected, end: graph.nodes[endNodeId].projected });
            }
        });
    });

    console.log("Path graph created:", {
        nodes: graph.nodes.length,
        segments: graph.segments.length
    });

    return graph;
}

function distancePointToSegment(point, start, end) {
    const segmentX = end.x - start.x;
    const segmentY = end.y - start.y;
    const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

    if (segmentLengthSquared === 0) {
        return { distance: distanceBetweenProjectedPoints(point, start), amount: 0 };
    }

    let amount = ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / segmentLengthSquared;
    amount = Math.max(0, Math.min(1, amount));

    const nearestPoint = {
        x: start.x + amount * segmentX,
        y: start.y + amount * segmentY
    };

    return { distance: distanceBetweenProjectedPoints(point, nearestPoint), amount };
}

function findNearestPathNode(latLng) {
    if (!directionsPathGraph) {
        return null;
    }

    const point = projectLatLng(latLng);

    let nearestResult = null;

    directionsPathGraph.segments.forEach(segment => {
        const result = distancePointToSegment(point, segment.start, segment.end);

        if (nearestResult === null || result.distance < nearestResult.distance) {
            // Both ends belong to the same connected segment.
            // Choose the closest end for the graph search.
            const startDistance = distanceBetweenProjectedPoints(point, segment.start);
            const endDistance = distanceBetweenProjectedPoints(point, segment.end);

            nearestResult = {
                nodeId:
                    startDistance <= endDistance
                        ? segment.startNodeId
                        : segment.endNodeId,
                distance: result.distance
            };
        }
    });

    if (!nearestResult || nearestResult.distance > MAX_PATH_SNAP_DISTANCE_METERS) {
        return null;
    }
    return nearestResult;
}

function pathNodesAreConnected(startNodeId, endNodeId) {
    if (startNodeId === endNodeId) {
        return true;
    }

    const visited = new Set([startNodeId]);
    const queue = [startNodeId];

    while (queue.length > 0) {
        const currentNodeId = queue.shift();
        const currentNode = directionsPathGraph.nodes[currentNodeId];

        for (const neighbourId of currentNode.neighbours) {
            if (neighbourId === endNodeId) {
                return true;
            }
            if (!visited.has(neighbourId)) {
                visited.add(neighbourId);
                queue.push(neighbourId);
            }
        }
    }

    return false;
}

function handleBuildingDirections(feature, layer) {
    clearDirectionsRoute();

    const buildingNumber = getBuildingNumber(feature);
    const frontDoor = findDirectionFrontDoor(buildingNumber);

    let destination;

    if (frontDoor) {
        // GeoJSON coordinates are [longitude, latitude]
        destination = L.latLng(
            frontDoor.geometry.coordinates[1],
            frontDoor.geometry.coordinates[0]
        );
        
        console.log("Using FRONTDOOR:", destination);
    } else {
        // Fall back to the centre of the building polygon
        destination = layer.getBounds().getCenter();

        console.log("No FRONTDOOR. Using building centre:", destination);
    }

    const routeResult = generatePathUsingCentreLines(destination);

    if (routeResult.success) {
        console.log("Route generated:", {
            buildingNumber,
            destination,
            routeResult
        });

        return;
    }

    if (routeResult.reason === "NO_USER_LOCATION") {
        showDirectionsPopup(
            layer,
            "Your location is not available. Please use the location button first."
        );

        return;
    }

    showDirectionsPopup(
        layer,
        `Walking directions could not be generated for building ${buildingNumber}.`
    );
}

function generatePathUsingCentreLines(destination) {
    if (!lastUserPosition) {
        return { success: false, reason: "NO_USER_LOCATION" };
    }

    const userLocation = L.latLng(
        lastUserPosition.latitude,
        lastUserPosition.longitude
    );

    if (!directionsPathGraph) {
        console.warn("The path graph has not been created.");
        return { success: false, reason: "NO_PATH_GRAPH" };
    }

    const startPath = findNearestPathNode(userLocation);
    const destinationPath = findNearestPathNode(destination);

    if (!startPath) {
        console.warn("The user is not close enough to a path centre line.");
        return { success: false, reason: "NO_START_PATH" };
    }

    if (!destinationPath) {
        console.warn("The building is not close enough to a path centre line.");
        return { success: false, reason: "NO_DESTINATION_PATH" };
    }

    const connected = pathNodesAreConnected(startPath.nodeId, destinationPath.nodeId);

    console.log("Path connectivity check:", {
        startDistance: startPath.distance,
        destinationDistance: destinationPath.distance,
        connected
    })

    return { success: connected, connected, reason: connected ? null : "DISCONNECTED_PATH" };
}

loadDirectionsData()
    .then(() => {
        directionsPathGraph = buildPathGraph();
        createBuildingClickLayer();
    })
    .catch(error => {
        console.error("Directions initialisation failed:", error);
    });
