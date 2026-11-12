
// ------- Map Details Panel -------

const detailsPanel = document.getElementById("map-details-panel");
const detailsTitleElement = document.getElementById("map-details-title");
const detailsSubtitleElement = document.getElementById("map-details-subtitle");
const detailsCloseButton = document.getElementById("map-details-close");

const buildingImage = document.getElementById("map-building-image");
const buildingDirectionsButton = document.getElementById("map-building-directions");

let selectedBuilding = null;

// ------- Open Map Details Panel -------


function openDetailsPanel(title, subtitle = "", searchText = null) {
    detailsTitleElement.textContent = title;
    detailsSubtitleElement.textContent = subtitle;
    detailsSubtitleElement.hidden = !subtitle;

    // Reset building-only elements
    buildingImage.hidden = true;
    buildingImage.removeAttribute("src");
    buildingDirectionsButton.hidden = true;
    selectedBuilding = null;

    // Hide search results panel
    const resultsPanel = document.getElementById("map-results-panel");

    if (resultsPanel) {
        resultsPanel.hidden = true;
    }

    // Hide search suggestions
    const searchResults = document.getElementById("map-search-results");

    if (searchResults) {
        searchResults.hidden = true;
    }

    // Update search bar
    const searchInput = document.querySelector(".map-search-input");
    const searchClearButton = document.querySelector(".map-search-clear");

    if (searchInput) {
        searchInput.value = searchText ?? title;
    }

    if (searchClearButton) {
        searchClearButton.hidden = false;
    }

    // Open details panel
    detailsPanel.hidden = false;
}

// ------- Fly to Selected Feature -------

function flyToSelectedFeature(feature, layer) {
    if (layer?.getBounds) {
        const bounds = layer.getBounds();

        if (bounds.isValid()) {
            map.flyTo(bounds.getCenter(), Math.max(map.getZoom(), 19), {
                duration: 0.8
            });
            return;
        }
    }

    if (layer?.getLatLng) {
        map.flyTo(layer.getLatLng(), Math.max(map.getZoom(), 19), {
            duration: 0.8
        });
        return;
    }

    if (feature?.geometry) {
        const bounds = L.geoJSON(feature).getBounds();

        if (bounds.isValid()) {
            map.flyTo(bounds.getCenter(), Math.max(map.getZoom(), 19), {
                duration: 0.8
            });
        }
    }
}

// ------- Open Building Details -------

function openBuildingDetails(feature, layer) {
    if (!feature || !layer) return;

    clearPOIHighlight();
    clearParkingHighlight();
    highlightBuilding(feature);
    flyToSelectedFeature(feature, layer);

    const number = getBuildingNumber(feature);
    const name = feature.properties?.buildingName || "Building";

    // Format: number - name
    const searchText = number !== ""
        ? `${number} - ${name}`
        : name;

    openDetailsPanel(
        number !== "" ? `Building ${number}` : "Building",
        name,
        searchText
    );

    // Store selected building
    selectedBuilding = { feature, layer };

    // Building-only image
    buildingImage.src = placeholderImages[0];
    buildingImage.alt = `Illustrative image of ${name}`;
    buildingImage.hidden = false;

    // Building-only directions button
    buildingDirectionsButton.hidden = false;
}

// ------- Map Feature Display Names -------

function getMapFeatureDisplayName(type) {
    const displayNames = {
        // ------- Standard Parking -------
        "FREE": "Free Parking",
        "FREEVPERMIT": "Free with vPermit",
        "PAID-ALL": "Paid All Day Parking",
        "PAID-4HR": "Paid 4 Hour Max",
        "MOTORC": "Motorcycle Parking",
        "ACCPARK": "Accessible Parking",

        // ------- Restricted Parking -------
        "RESIDENTIAL": "Residential Parking",
        "CEL-PREM": "Premium Parking",
        "COMMERCIAL": "Special Parking",
        "RESERVED": "Special Parking",
        "LOADING": "Special Parking",
        "VISITOR": "Special Parking",
        "SERVICE": "Special Parking",

        // ------- Transport & Mobility -------
        "TRANS": "Bus Stops",
        "ESCOOTER": "Electric Scooters",
        "EV_CHG": "Electric Charging Bays",
        "BIKE": "Bicycle Racks",
        "BIKEWS": "Bicycle Repair Station",

        // ------- Amenities -------
        "KITCHENETTES": "Kitchenettes",
        "PARENT": "Parents Room",
        "WELLNESS": "Wellness",
        "COMGARDEN": "Wellness",
        "SHWR": "Shower",
        "PWD": "Accessible Toilets",

        // ------- Safety & Security -------
        "HELPPHONE": "Help Phone",
        "SECURITY": "Security",
        "DEFIB": "Defibrillator",

        // ------- Food & Services -------
        "CAFE": "Food & Beverage/Cafe",
        "FOODBEV": "Food & Beverage/Cafe",
        "INFO": "Information",
        "ATM": "ATM"
    };

    return displayNames[type] || type;
}

// ------- POI Highlight -------

let selectedPOILayer = null;

function clearPOIHighlight() {
    if (selectedPOILayer) {
        const element = selectedPOILayer.getElement?.();

        if (element) {
            element.classList.remove("poi-selected-highlight");
        }

        selectedPOILayer = null;
    }
}

function highlightPOI(layer) {
    clearPOIHighlight();

    if (!layer) return;

    const element = layer.getElement?.();

    if (element) {
        element.classList.add("poi-selected-highlight");
        selectedPOILayer = layer;
    }
}

// ------- Open POI Details -------

function openPOIDetails(feature, layer) {
    if (!feature) return;

    clearBuildingHighlight();
    clearParkingHighlight();
    highlightPOI(layer);
    flyToSelectedFeature(feature, layer);

    const properties = feature.properties || {};
    const type = properties.type || "";
    const name = properties.description || getMapFeatureDisplayName(type);
    const category = getMapFeatureDisplayName(type);

    openDetailsPanel(name, category, name);
}

// ------- Parking Highlight -------

let selectedParkingHighlightLayer = null;

function clearParkingHighlight() {
    if (selectedParkingHighlightLayer) {
        map.removeLayer(selectedParkingHighlightLayer);
        selectedParkingHighlightLayer = null;
    }
}

function highlightParking(feature) {
    clearParkingHighlight();

    if (!feature?.geometry) return;

    selectedParkingHighlightLayer = L.geoJSON(feature, {
        interactive: false,
        style: {
            className: "parking-highlight-layer"
        }
    }).addTo(map);

    selectedParkingHighlightLayer.bringToFront();
}

// ------- Open Parking Details -------

function openParkingDetails(feature, layer) {
    if (!feature) return;

    clearPOIHighlight();
    clearBuildingHighlight();
    highlightParking(feature);
    flyToSelectedFeature(feature, layer);

    const properties = feature.properties || {};
    const type = properties.parkType || "";
    const name = getParkingDisplayName(type) || getMapFeatureDisplayName(type);
    const category = getMapFeatureDisplayName(type);

    openDetailsPanel(name, category, name);
}

// ------- Building Directions -------

buildingDirectionsButton.addEventListener("click", function () {
    if (!selectedBuilding) return;

    const { feature, layer } = selectedBuilding;

    detailsPanel.hidden = true;

    // Existing building directions functionality
    handleBuildingDirections(feature, layer);
});

// ------- Close Map Details Panel -------

function closeDetailsPanel() {
    detailsPanel.hidden = true;
    selectedBuilding = null;
}

detailsCloseButton.addEventListener("click", closeDetailsPanel);

// ------- Escape Key -------

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !detailsPanel.hidden) {
        closeDetailsPanel();
    }
});

// ------- Close Details Panel When Search Is Cleared -------

document.querySelector(".map-search-clear").addEventListener("click", function () {
    closeDetailsPanel();
});