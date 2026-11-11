
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


// ------- Open Building Details -------


function openBuildingDetails(feature, layer) {
    if (!feature || !layer) return;

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

    highlightBuilding(feature);
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