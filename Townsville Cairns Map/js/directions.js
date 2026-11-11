const DIRECTIONS_DATA_PATH = "../data/mapsdata/";
const DIRECTIONS_CAMPUS = "tsv";
const MAX_PATH_SNAP_DISTANCE_METERS = 35;
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
let directionsLoadGeneration = 0;
let selectedBuildingHighlightLayer = null;

function normaliseBuildingNumber(value) {
    if (value === null || value === undefined) return "";

    const valueAsText = String(value).trim();

    return valueAsText.toUpperCase().replace(
        /^([A-Z]*)(\d+)$/,
        (_, prefix, digits) => prefix + String(Number(digits))
    );
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

    const loadedData = { buildings: building, pois: pois, paths: paths };

    console.log("Directions data loaded:", { campus, buildings: building.features?.length ?? 0, pois: pois.features?.length ?? 0, path: paths.features?.length ?? 0 });

    return loadedData;
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
                openBuildingDetails(feature, layer);
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

// ------- Building Highlight -------

function highlightBuilding(feature) {
    if (selectedBuildingHighlightLayer) {
        map.removeLayer(selectedBuildingHighlightLayer);
        selectedBuildingHighlightLayer = null;
    }

    if (!feature?.geometry) return;

    selectedBuildingHighlightLayer = L.geoJSON(feature, {
        interactive: false,
        style: {
            className: "directions-building-highlight-layer"
        }
    }).addTo(map);

    selectedBuildingHighlightLayer.bringToFront();
}

function drawDirectionsRoute(coordinates) {
    clearDirectionsRoute();

    if (!coordinates || coordinates.length < 2) {
        return;
    }

    const latLngs = coordinates.map(coordinate => L.latLng(coordinate[1], coordinate[0]));

    directionsRouteLayer = L.polyline(latLngs, {
        className: "directions-route-line"
    }).addTo(map);

    map.fitBounds(directionsRouteLayer.getBounds(), {
        padding: [50, 50]
    });
}

function projectLatLng(latLng) {
    const projected = L.CRS.EPSG3857.project(latLng);

    const referenceLat = -19.328;
    const scale = Math.cos(referenceLat * Math.PI / 180);

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

    const originalSegments = [];

    // First pass: collect all original segments.
    pathFeatures.forEach(feature => {
        const coordinateGroups = getPathCoordinateGroups(feature);

        coordinateGroups.forEach(coordinates => {
            if (coordinates.length < 2) return;

            for (let index = 0; index < coordinates.length - 1; index++) {
                const startCoordinate = coordinates[index];
                const endCoordinate = coordinates[index + 1];
                const startNodeId = findOrCreateGraphNode(graph, startCoordinate);
                const endNodeId = findOrCreateGraphNode(graph, endCoordinate);

                originalSegments.push({ startNodeId, endNodeId, start: graph.nodes[startNodeId].projected, end: graph.nodes[endNodeId].projected });
            }
        });
    });

    // Find intersections between segments and add shared graph nodes.
    originalSegments.forEach((segmentA, indexA) => {
        originalSegments.forEach((segmentB, indexB) => {
            if (indexB <= indexA) return;

            const intersection = getSegmentIntersection(
                segmentA.start,
                segmentA.end,
                segmentB.start,
                segmentB.end
            );

            if (!intersection) return;

            const { amountA, amountB } = intersection;

            // Ignore intersections that are only at segment endpoints.
            if (
                (amountA <= 0.000001 || amountA >= 0.999999) &&
                (amountB <= 0.000001 || amountB >= 0.999999)
            ) {
                return;
            }

            const coordinate = [
                graph.nodes[segmentA.startNodeId].coordinate[0] +
                amountA * (
                    graph.nodes[segmentA.endNodeId].coordinate[0] -
                    graph.nodes[segmentA.startNodeId].coordinate[0]
                ),
                graph.nodes[segmentA.startNodeId].coordinate[1] +
                amountA * (
                    graph.nodes[segmentA.endNodeId].coordinate[1] -
                    graph.nodes[segmentA.startNodeId].coordinate[1]
                )
            ];

            const nodeId = findOrCreateGraphNode(graph, coordinate);

            // Make the intersection available to the existing split pass.
            segmentA.intersectionNodeIds ??= [];
            segmentB.intersectionNodeIds ??= [];

            segmentA.intersectionNodeIds.push(nodeId);
            segmentB.intersectionNodeIds.push(nodeId);
        });
    });

    // Second pass: split segments at existing nodes along their interiors.
    originalSegments.forEach(segment => {
        const startNode = graph.nodes[segment.startNodeId];
        const endNode = graph.nodes[segment.endNodeId];

        const splitPoints = [{ id: startNode.id, amount: 0 }, { id: endNode.id, amount: 1 }];

        (segment.intersectionNodeIds || []).forEach(nodeId => {
            const result = distancePointToSegment(
                graph.nodes[nodeId].projected,
                startNode.projected,
                endNode.projected
            );

            splitPoints.push({
                id: nodeId,
                amount: result.amount
            });
        });

        graph.nodes.forEach(node => {
            if (node.id === startNode.id || node.id === endNode.id) return;

            const result = distancePointToSegment(node.projected, startNode.projected, endNode.projected);
            if (result.distance <= PATH_JOIN_TOLERANCE_METERS && result.amount > 0 && result.amount < 1) {
                splitPoints.push({ id: node.id, amount: result.amount });
            }
        });

        splitPoints.sort((a, b) => a.amount - b.amount);

        for (let index = 0; index < splitPoints.length - 1; index++) {
            const first = splitPoints[index];
            const second = splitPoints[index + 1];

            if (first.id === second.id) continue;

            const firstNode = graph.nodes[first.id];
            const secondNode = graph.nodes[second.id];

            firstNode.neighbours.add(second.id);
            secondNode.neighbours.add(first.id);

            graph.segments.push({
                startNodeId: first.id,
                endNodeId: second.id,
                start: firstNode.projected,
                end: secondNode.projected,
                startCoordinate: firstNode.coordinate,
                endCoordinate: secondNode.coordinate
            });
        }
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

function getSegmentIntersection(a, b, c, d) {
    const rx = b.x - a.x;
    const ry = b.y - a.y;
    const sx = d.x - c.x;
    const sy = d.y - c.y;

    const denominator = rx * sy - ry * sx;

    if (Math.abs(denominator) < 1e-9) return null;

    const qpx = c.x - a.x;
    const qpy = c.y - a.y;

    const amountA = (qpx * sy - qpy * sx) / denominator;
    const amountB = (qpx * ry - qpy * rx) / denominator;

    if (
        amountA < 0 || amountA > 1 ||
        amountB < 0 || amountB > 1
    ) {
        return null;
    }

    return { amountA, amountB };
}

function findNearestPathNode(latLng) {
    if (!directionsPathGraph) {
        return null;
    }

    const point = projectLatLng(latLng);

    let nearestResult = null;

    directionsPathGraph.segments.forEach((segment, segmentIndex) => {
        const result = distancePointToSegment(point, segment.start, segment.end);

        if (nearestResult === null || result.distance < nearestResult.distance) {

            const amount = result.amount;
            const snappedProjected = {
                x: segment.start.x + amount * (segment.end.x - segment.start.x),
                y: segment.start.y + amount * (segment.end.y - segment.start.y)
            };

            const snappedCoordinate = [
                segment.startCoordinate[0] + amount * (segment.endCoordinate[0] - segment.startCoordinate[0]),
                segment.startCoordinate[1] + amount * (segment.endCoordinate[1] - segment.startCoordinate[1])
            ];

            nearestResult = {
                segmentIndex,
                segment,
                snappedProjected,
                snappedCoordinate,
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

function findShortestPath(startNodeId, endNodeId, graph = directionsPathGraph) {
    const nodes = graph.nodes;
    const distances = new Array(nodes.length).fill(Infinity);
    const previous = new Array(nodes.length).fill(null);
    const unvisited = new Set(nodes.map(node => node.id));

    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
        let currentNodeId = null;
        let shortestDistance = Infinity;

        for (const nodeId of unvisited) {
            if (distances[nodeId] < shortestDistance) {
                shortestDistance = distances[nodeId];
                currentNodeId = nodeId;
            }
        }

        if (currentNodeId === null) break;
        if (currentNodeId === endNodeId) break;

        unvisited.delete(currentNodeId);

        const currentNode = nodes[currentNodeId];

        for (const neighbourId of currentNode.neighbours) {
            if (!unvisited.has(neighbourId)) continue;

            const neighbour = nodes[neighbourId];
            const edgeDistance = distanceBetweenProjectedPoints(currentNode.projected, neighbour.projected);

            const alternativeDistance = distances[currentNodeId] + edgeDistance;

            if (alternativeDistance < distances[neighbourId]) {
                distances[neighbourId] = alternativeDistance;
                previous[neighbourId] = currentNodeId;
            }
        }
    }

    if (!Number.isFinite(distances[endNodeId])) {
        return null;
    }

    const path = [];
    let currentNodeId = endNodeId;
    while (currentNodeId !== null) {
        path.unshift(currentNodeId);

        if (currentNodeId === startNodeId) break;

        currentNodeId = previous[currentNodeId];
    }

    if (path[0] !== startNodeId) {
        return null;
    }

    return path.map(nodeId => nodes[nodeId].coordinate);
}

function handleBuildingDirections(feature, layer) {
    highlightBuilding(feature);
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
        drawDirectionsRoute(routeResult.coordinates);

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

    if (!directionsPathGraph) {
        console.warn("The path graph has not been created.");
        return { success: false, reason: "NO_PATH_GRAPH" };
    }

    const userLocation = L.latLng(
        lastUserPosition.latitude,
        lastUserPosition.longitude
    );

    const startPath = findNearestPathNode(userLocation);
    const destinationPath = findNearestPathNode(destination);

    if (!startPath) {
        return { success: false, reason: "NO_START_PATH" };
    }

    if (!destinationPath) {
        return { success: false, reason: "NO_DESTINATION_PATH" };
    }

    const graph = {
        nodes: directionsPathGraph.nodes.map(node => ({ ...node, neighbours: new Set(node.neighbours) })),
        segments: directionsPathGraph.segments
    };

    function addTemporaryNode(snap) {
        const nodeId = graph.nodes.length;
        graph.nodes.push({ id: nodeId, coordinate: snap.snappedCoordinate, projected: snap.snappedProjected, neighbours: new Set() });

        const segment = snap.segment;
        const node = graph.nodes[nodeId];

        // Connect the snapped point to both ends of its segment.
        for (const endpointId of [segment.startNodeId, segment.endNodeId]) {
            node.neighbours.add(endpointId);
            graph.nodes[endpointId].neighbours.add(node.id);
        }

        return nodeId;
    }

    const startNodeId = addTemporaryNode(startPath);
    const destinationNodeId = addTemporaryNode(destinationPath);

    // If both snapped points lie on the same segment, connect them directly along the segment.
    if (startPath.segmentIndex === destinationPath.segmentIndex) {
        graph.nodes[startNodeId].neighbours.add(destinationNodeId);
        graph.nodes[destinationNodeId].neighbours.add(startNodeId);
    }

    console.log("Path snapping:", {
        startDistance: startPath.distance,
        destinationDistance: destinationPath.distance,
        sameSegment: startPath.segmentIndex === destinationPath.segmentIndex
    });

    const coordinates = findShortestPath(startNodeId, destinationNodeId, graph);

    if (!coordinates || coordinates.length < 2) {
        return { success: false, reason: "NO_ROUTE_FOUND" };
    }

    return { success: true, coordinates };
}

async function reloadDirections(campus) {
    const generation = ++directionsLoadGeneration;

    clearDirectionsRoute();

    if (directionsClickLayer) {
        map.removeLayer(directionsClickLayer);
        directionsClickLayer = null;
    }

    directionsPathGraph = null;

    const loadedData = await loadDirectionsData(campus);

    // Ignore an outdated load if the campus changed again.
    if (generation !== directionsLoadGeneration) {
        return;
    }

    directionsData = loadedData;
    directionsPathGraph = buildPathGraph();
    createBuildingClickLayer();
}

reloadDirections("tsv").catch(error => {
    console.error("Directions initialisation failed:", error);
});