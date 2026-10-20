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

// ------- Parking Display Names -------

function getParkingDisplayName(parkType) {
    switch (normaliseText(parkType).toUpperCase()) {
        case 'FREE':
            return 'Free Parking';
            
        case 'FREEVPERMIT':
            return 'Free with vPermit';

        case 'PAID-ALL':
            return 'Paid All Day Parking';
            
        case 'PAID-4HR':
            return 'Paid 4 Hour Max Parking';

        case 'RESIDENTIAL':
            return 'Residential Parking';
            
        case 'CEL-PREM':
            return 'Premium Parking';
            
        case 'COMMERCIAL':
        case 'RESERVED':
        case 'LOADING':
        case 'VISITOR':
        case 'SERVICE': {
            const subtype = normaliseText(parkType).replace(/-/g, '');
            const formattedSubType = subtype.replace(/\b\w/g, character => character.toUpperCase());
            return `Special Parking - ${formattedSubType}`;
        }
        default:
            return null;
    }
}

// ------- Parking Icon Colour -------

function getParkingIconClass(parkType) {
    switch (normaliseText(parkType).toUpperCase()) {
        case 'FREE':
            return 'parking-free';
        case 'FREEVPERMIT':
            return 'parking-freevpermit';
        case 'PAID-ALL':
            return 'parking-paid-all';
        case 'PAID-4HR':
            return 'parking-paid-4hr';
        case 'RESIDENTIAL':
            return 'parking-residential';
        case 'CEL-PREM':
            return 'parking-cel-prem';
        case 'COMMERCIAL':
        case 'RESERVED':
        case 'LOADING':
        case 'VISITOR':
        case 'SERVICE':
            return 'parking-special';
        default:
            return 'parking-unknown';
    }
}

// ------- Search Data -------

function getSearchMatches(query) {
    const index = window.jcuSearchIndex;

    if (!index) return [];

    // Search buildings by number, name, and keywords.
    const buildings = (index.buildings || [])
        .filter(feature => {
            const properties = feature.properties || {};

            const searchableText = [
                properties.buildingNumber,
                properties.buildingName,
                properties.keywords || ''
            ].filter(Boolean).map(normaliseText);

            return searchableText.some(text => text.includes(query));
        })
        .map(feature => { 
            const properties = feature.properties || {};
            const buildingNumber = properties.buildingNumber;
            const buildingName = properties.buildingName;

            const name = buildingNumber ? `${buildingNumber} - ${buildingName}` : String(buildingName || '');
            return { feature, name, type: 'Building', icon: 'fa-solid fa-building', resultType: 'building' };
        }
    );

    // Search POIs by descriptions and keywords, excluding FRONTDOOR.
    const pois = (index.pois || [])
        .filter(feature => {
            const properties = feature.properties || {};
            
            if (normaliseText(properties.type) === 'frontdoor') return false;

            const searchableText = [
                properties.description,
                properties.keywords || ''
            ].filter(Boolean).map(normaliseText);

            return searchableText.some(text => text.includes(query));
        })
        .map(feature => ({ feature, name: String(feature.properties?.description || ''), type: 'Point of Interest', icon: 'fa-solid fa-location-dot', resultType: 'poi' })
    );

    // Search Parking by parkType and the word "parking".
    const parking = (index.parking || [])
        .filter(feature => {
            const parkType = feature.properties?.parkType;
            const displayName = getParkingDisplayName(parkType);

            if (!displayName) return false;

            const searchableText = [
                'parking',
                parkType,
                displayName
            ].filter(Boolean).map(normaliseText);

            return searchableText.some(text => text.includes(query));
        })
        .map(feature => ({ feature, name: getParkingDisplayName(feature.properties?.parkType), type: 'Parking', icon: `fa-solid fa-square-parking ${getParkingIconClass(feature.properties?.parkType)}`, resultType: 'parking' })
    );

    // Prioritise names starting with the query, then sort alphabetically.
    return [...buildings, ...pois, ...parking]
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