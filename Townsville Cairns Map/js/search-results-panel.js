// ------- Search Results Panel -------

const resultsPanel = document.querySelector("#map-results-panel");
const resultsList = document.querySelector("#map-results-list");
const resultsCount = document.querySelector("#map-results-count");
const closeResultsButton = document.querySelector("#map-results-close");

let currentPanelResults = [];
let activePanelResultIndex = -1;

// Temporary descriptions until real building data is available.
const placeholderDescriptions = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explore this campus location and its surroundings.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Discover more about this location.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Learn more about this campus facility."
];

// Temporary images for the prototype.
// These are illustrative images, not verified photos of JCU buildings.
const placeholderImages = [
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
];


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Convert your existing search results into panel display data.
function preparePanelResults(results) {
    return results.map((result, index) => {
        // Fuse.js search results may wrap the actual data in .item.
        const item = result.item ?? result;

        return {
            original: item,

            // Update these field names if your JSON uses different ones.
            name:
                item.name ??
                item.feature?.properties?.buildingName ??
                item.feature?.properties?.description ??
                item.buildingName ??
                item.description ??
                item.displayName ??
                "Unnamed location",

            number:
                item.buildingNumber ??
                item.number ??
                item.building_number ??
                "",

            description:
                item.panelDescription ??
                placeholderDescriptions[index % placeholderDescriptions.length],

            image:
                item.image ??
                placeholderImages[index % placeholderImages.length],

            lat: Number(item.lat ?? item.latitude),
            lng: Number(item.lng ?? item.longitude)
        };
    });
}

function showMapResults(results) {
    currentPanelResults = preparePanelResults(results);
    activePanelResultIndex = -1;

    resultsCount.textContent = 
        `${results.length} ${results.length === 1 ? "result" : "results"} found`;

    if (results.length === 0) {
        resultsList.innerHTML = `
            <div class="map-results-empty">
                <p><strong>No results found</strong></p>
                <p>Try another search term.</p>
            </div>
        `;

        resultsPanel.hidden = false;
        return;
    }

    resultsList.innerHTML = currentPanelResults.map((building, index) => `
        <article
            class="map-result-card"
            data-result-index="${index}"
            role="listitem"
            tabindex="0"
            aria-label="${escapeHTML(building.name)}"
        >
            <img
                class="map-result-image"
                src="${escapeHTML(building.image)}"
                alt="Illustrative image of ${escapeHTML(building.name)}"
                loading="${index < 2 ? "eager" : "lazy"}"
            >

            ${building.number !== "" ? `
                <span class="map-result-number">
                    Building ${escapeHTML(building.number)}
                </span>
            ` : ""}

            <h3 class="map-result-name">
                ${escapeHTML(building.name)}
            </h3>

            <p class="map-result-description">
                ${escapeHTML(building.description)}
            </p>

            <span class="map-result-action"> View location &rarr;</span>
        </article>
    `).join("");

    resultsPanel.hidden = false;

    // Focus the first result so the arrow-key navigation works immediately.
    const firstCard = resultsList.querySelector(".map-result-card");
    firstCard?.focus();
}

// Only focus on the map after the user selects a specific result.
function selectMapResult(index) {
    const result = currentPanelResults[index];
    if (!result) return;

    // Highlight the selected result card.
    resultsList.querySelectorAll(".map-result-card").forEach(card => card.classList.remove("selected"));

    const card = resultsList.querySelector(`[data-result-index="${index}"]`);
    card?.classList.add("selected");

    // use the shared search selection logic.
    selectSearchResultItem(result.original);
}

resultsList.addEventListener("click", (event) => {
    const card = event.target.closest(".map-result-card");
    if (!card) return;
    
    selectMapResult(Number(card.dataset.resultIndex));
});

resultsList.addEventListener("keydown", (event) => {
    const card = event.target.closest(".map-result-card");
    if (!card) return;

    const currentIndex = Number(card.dataset.resultIndex);

    // Navigate between result cards using arrow keys.
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        
        const nextIndex = (currentIndex + direction + currentPanelResults.length) % currentPanelResults.length;
        const nextCard = resultsList.querySelector(`[data-result-index="${nextIndex}"]`);

        nextCard?.focus();
        return;
    }
    
    // Select a result using Enter or Space.
    if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        selectMapResult(currentIndex);
        return;
    }

    // Close the results panel using Escape.
    if (event.key === "Escape") {
        resultsPanel.hidden = true;
    }
});

closeResultsButton.addEventListener("click", () => {
    resultsPanel.hidden = true;
});