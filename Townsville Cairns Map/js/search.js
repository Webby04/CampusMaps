const searchInput = document.querySelector('.map-search-input');
const searchBar = document.querySelector('.map-search-bar');
const searchResults = document.querySelector('#map-search-results');

let matchingResults = [];
let activeResultsIndex = -1;

// ------- Search Placeholder -------

function updateSearchPlaceholder(campus) {
    if (!searchInput) return;

    if (campus === "tsv") {
        searchInput.placeholder = `Search the Townsville Campus...`;
    } else if (campus === "cns") {
        searchInput.placeholder = `Search the Cairns Campus...`;
    }
}

// ------- Search Results UI -------

function closeSearchResults() {
    if (!searchResults || !searchInput) return;

    searchResults.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.removeAttribute('aria-activedescendant');
    activeResultsIndex = -1;
}

function showSearchMessage(message) {
    searchResults.replaceChildren();

    const element = document.createElement('div');
    element.className = 'map-search-message';
    element.textContent = message;
    searchResults.appendChild(element);
    searchResults.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
    searchInput.removeAttribute('aria-activedescendant');
}

function normaliseText(value) {
    return String(value ?? '')
        .toLocaleLowerCase()
        .trim();
}

// ------- Search Data -------

function getSearchMatches(query) {
    const index = window.jcuSearchIndex;

    if (!index) return [];

    // Search buidlings by buildingName only.
    const buildings = (index.buildings || [])
        .filter(feature => {
            const name = feature.properties?.buildingName;

            return name && normaliseText(name).includes(query);
        })
        .map(feature => ({ feature, name: String(feature.properties?.buildingName), type: 'Building', icon: 'fa-solid fa-building', resultType: 'building' })
    );

    // Search points of interest by description only.
    const pois = (index.pois || [])
        .filter(feature => {
            const description = feature.properties?.description;

            return description && normaliseText(description).includes(query);
        })
        .map(feature => ({ feature, name: String(feature.properties?.description), type: 'Point of Interest', icon: 'fa-solid fa-location-dot', resultType: 'poi' })
    );

    // Prioritise names that start with the query, then sort alphabetically.
    return [...buildings, ...pois]
        .sort((a, b) => {
            const aStarts = normaliseText(a.name).startsWith(query);
            const bStarts = normaliseText(b.name).startsWith(query);

            if (aStarts !== bStarts) return aStarts ? -1 : 1;

            return a.name.localeCompare(b.name);
        })
        .slice(0, 5);
}

// ------- Render Suggestions -------

function renderSearchResults() {
    if (!searchInput || !searchResults) return;

    const query = normaliseText(searchInput.value);

    matchingResults = [];
    activeResultIndex = -1;

    if (query.length < 3) {
        closeSearchResults();
        return;
    }

    if (!window.jcuSearchIndex) {
        closeSearchResults();
        return;
    }

    matchingResults = getSearchMatches(query);
    searchResults.replaceChildren();

    if (matchingResults.length === 0) {
        showSearchMessage("No matching buildings or points of interest.");
        return;
    }

    matchingResults.forEach((result, index) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'map-search-result';
        button.id = `map-search-result-${index}`;
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', 'false');

        // Result icon.
        const icon = document.createElement('span');
        icon.className = 'map-search-result-icon';
        const iconElement = document.createElement('i');
        iconElement.className = result.icon;
        iconElement.setAttribute('aria-hidden', 'true');
        icon.appendChild(iconElement);

        // Result text.
        const text = document.createElement('span');
        text.className = 'map-search-result-text';

        const name = document.createElement('span');
        name.className = 'map-search-result-name';
        name.textContent = result.name;
        
        const type = document.createElement('span');
        type.className = 'map-search-result-type';
        type.textContent = result.type;
        text.append(name);
        button.append(icon, text);

        // Prevent the input from losing focus before selection.
        button.addEventListener('mousedown', (event) => {
            event.preventDefault();
        });

        // Selecting a suggestion does not interact with the map.
        button.addEventListener('click', () => {
            selectSearchResult(index);
        });

        searchResults.appendChild(button);
    });

    searchResults.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
}

// ------- Keyboard Navigation -------

function setActiveResult(index) {
    const buttons = searchResults.querySelectorAll('.map-search-result');

    if (!buttons.length) return;

    activeResultIndex = (index + buttons.length) % buttons.length;
    
    buttons.forEach((button, i) => {
        const active = i === activeResultIndex;

        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
    });

    searchInput.setAttribute('aria-activedescendant', buttons[activeResultIndex].id);

    buttons[activeResultIndex].scrollIntoView({ block: 'nearest' });
}

// ------- Select a Result -------

function selectSearchResult(index) {
    const result = matchingResults[index];

    if (!result) return;

    // Only update the search input.
    searchInput.value = result.name;

    closeSearchResults();
}

// ------- Search Input Events -------

if (searchInput && searchResults && searchBar) {
    searchInput.addEventListener('input', renderSearchResults);

    searchInput.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown') {
            if (searchResults.hidden) {
                renderSearchResults();
            }

            if (!searchResults.hidden && matchingResults.length > 0) {
                event.preventDefault();
                setActiveResult(activeResultIndex + 1);
            }
        } else if (event.key === 'ArrowUp') {
            if (!searchResults.hidden) {
                event.preventDefault();

                setActiveResult(activeResultIndex <= 0 ? matchingResults.length - 1 : activeResultIndex - 1);
            }
        } else if (event.key === 'Enter') {
            if (!searchResults.hidden && activeResultIndex >= 0) {
                event.preventDefault();
                selectSearchResult(activeResultIndex);
            } else {
                renderSearchResults();

                if (matchingResults.length > 0) {
                    event.preventDefault();
                    selectSearchResult(0);
                }
            }
        } else if (event.key === 'Escape') {
            closeSearchResults();
        }
    });

    // ------- Close Dropdown -------

    document.addEventListener('click', event => {
        if (!searchBar.contains(event.target)) {
            closeSearchResults();
        }
    });
}

// ------- Campus Changes -------
    
document.querySelectorAll('input[name="campus"]').forEach(campusInput => {
    campusInput.addEventListener('change', () => {
        updateSearchPlaceholder(campusInput.value);
        if (searchInput) {
            searchInput.value = '';
        }

        closeSearchResults();
    });
});

document.querySelectorAll('.campus-button').forEach(campusButton => {
    campusButton.addEventListener('click', () => {
        updateSearchPlaceholder(campusButton.dataset.campus);
        if (searchInput) {
            searchInput.value = '';
        }
        
        closeSearchResults();
    });
});

// ------- Search Button -------

const searchButton = searchBar?.querySelector('button');

searchButton?.addEventListener('click', () => {
    searchInput.focus();
    renderSearchResults();
});

// ------- Initial State -------

const selectedCampus = document.querySelector('input[name="campus"]:checked')?.value || 'tsv';
updateSearchPlaceholder(selectedCampus);