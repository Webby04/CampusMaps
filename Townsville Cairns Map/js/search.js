const searchInput = document.querySelector('.map-search-input');
const searchBar = document.querySelector('.map-search-bar');
const searchResults = document.querySelector('#map-search-results');
const clearSearchButton = document.querySelector('.map-search-clear');

let matchingResults = [];
let activeResultIndex = -1;

let cachedSearchData = null;
let buildingFuse = null;
let poiFuse = null;
let parkingFuse = null;

// ------- Recent Searches -------

const RECENT_SEARCHES_KEY = 'jcu-map-recent-searches';
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
    } catch {
        return [];
    }
}

function saveRecentSearch(result) {
    const recentSearches = getRecentSearches().filter(
        item => item.name.toLowerCase() !== result.name.toLowerCase()
    );

    recentSearches.unshift({name: result.name, type: result.type, resultType: result.resultType });
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.slice(0, MAX_RECENT_SEARCHES)));
}

// ------- Clear Search -------

if (searchInput && clearSearchButton) {
    searchInput.addEventListener('input', () => {
        clearSearchButton.hidden = searchInput.value.length === 0;
    });

    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchButton.hidden = true;
        restoreSearchableClusters();

        searchInput.focus();
        renderRecentSearches();
    });
}

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
    activeResultIndex = -1;
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

    if (!index || typeof Fuse === 'undefined') {
        console.warn('Search data or Fuse.js unavailable.');
        return [];
    }

    // Build the indexes only when the campus search data changes.
    if (cachedSearchData !== index) {
        cachedSearchData = index;
        buildingFuse = new Fuse(index.buildings || [], { keys: ['properties.buildingNumber', 'properties.buildingName', 'properties.keywords'],
            threshold: 0.35,
            ignoreLocation: true,
            includeScore: true,
        });

        // Only include POIs with a supported icon.
        const searchablePois = (index.pois || []).filter(feature => 
            getPOIIcon(feature.properties?.type) !== null
        );
        
        poiFuse = new Fuse(searchablePois, { keys: ['properties.description', 'properties.keywords'],
            threshold: 0.35,
            ignoreLocation: true,
            includeScore: true,
        });

        // Prepare parking entries using the existing display names.
        const searchableParking = (index.parking || []).map(feature => { 
            const parkType = feature.properties?.parkType;
            const name = getParkingDisplayName(parkType);
            return { feature, name, parkType, searchText: name ? `parking ${name} ${parkType || ''}` : '' };
        }).filter(item => item.name);
        
        parkingFuse = new Fuse(searchableParking, { 
            keys: ['name', 'parkType', 'searchText'],
            threshold: 0.35,
            ignoreLocation: true,
            includeScore: true,
        });
    }

    // Search buildings.
    let buildingResults;

    // For numeric searches, prioritize exact building numbers.
    if (/^\d+$/.test(query)) {
        // Match the full building number, ignoring leading zeros, or a standalone number in the building name
        buildingResults = (index.buildings || [])
            .filter(feature => {
                const properties = feature.properties || {};
                const buildingNumber = String(properties.buildingNumber ?? '').trim();
                const buildingName = String(properties.buildingName ?? '').trim();

                const numberMatches = /^\d+$/.test(buildingNumber) && Number(buildingNumber) === Number(query);
                const nameMatches = new RegExp(`(?:^|\\D)${query}(?:\\D|$)`).test(buildingName);
                return numberMatches || nameMatches;
            })
            .map(feature => ({ item: feature, score: 0 }));
    } else {
        buildingResults = buildingFuse.search(query);
    }
    const buildings = [...new Map(buildingResults.map(result => {
        const feature = result.item;
        const properties = feature.properties || {};
        const buildingNumber = properties.buildingNumber;
        const buildingName = properties.buildingName;
        const name = buildingNumber ? `${buildingNumber} - ${buildingName}` : String(buildingName || '');
        const uniqueKey = normaliseText(buildingNumber || buildingName);

        return [uniqueKey, { feature, name, type: 'Building', icon: 'fa-solid fa-building', resultType: 'building' , score: result.score ?? 1 }];
    })).values()];

    const pois = [];
    const seenPois = new Set();

    // Search points of interest (POIs).
    for (const result of poiFuse.search(query)) {
        const feature = result.item;
        const name = String(feature.properties?.description || '');
        const key = normaliseText(name);

        if (seenPois.has(key)) continue;
        seenPois.add(key);

        pois.push({
            feature,
            name,
            type: 'Point of Interest',
            icon: 'fa-solid fa-location-dot',
            resultType: 'poi',
            score: result.score ?? 1
        });
    }

    // Search Parking.
    const parking = [...new Map(parkingFuse.search(query).map(result => {
        const feature = result.item.feature;
        const parkType = feature.properties?.parkType;
        const name = result.item.name;

        return [normaliseText(name), { feature, name, type: 'Parking', icon: `fa-solid fa-square-parking ${getParkingIconClass(parkType)}`, resultType: 'parking', score: result.score ?? 1 }];
    })).values()];

    // Prefer names starting with the query, then better fuzzy matches.
    return [...buildings, ...pois, ...parking]
        .sort((a, b) => {
            const aStarts = normaliseText(a.name).startsWith(query);
            const bStarts = normaliseText(b.name).startsWith(query);

            if (aStarts !== bStarts) return aStarts ? -1 : 1;

            return a.score - b.score || a.name.localeCompare(b.name);
        })
        .slice(0, 5);
}

// ------- Render Suggestions -------

function renderSearchResults() {
    if (!searchInput || !searchResults) return;

    const query = normaliseText(searchInput.value);

    matchingResults = [];
    activeResultIndex = -1;

    const isNumericSearch = /^\d+$/.test(query);

    if (query.length < 3 && !isNumericSearch) {
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
        showSearchMessage("No matching buildings, points of interest, or parking.");
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

// ------- Render Recent Searches -------

function renderRecentSearches() {
    if (!searchInput || !searchResults) return;

    const recentSearches = getRecentSearches();
    matchingResults = [];
    activeResultIndex = -1;
    searchResults.replaceChildren();

    if (recentSearches.length === 0) {
        closeSearchResults();
        return;
    }

    recentSearches.forEach(recent => {
        // Find the matching feature in the current campus data.
        const result = getSearchMatches(recent.name).find(item => item.name === recent.name && item.resultType === recent.resultType);
        
        if (!result) return;

        const index = matchingResults.push(result) - 1;
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'map-search-result';

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

    if (matchingResults.length === 0) {
        closeSearchResults();
        return;
    }

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

    if (!result || !result.feature?.geometry) return;

    saveRecentSearch(result);

    const feature = result.feature;
    const geometry = feature.geometry;

    if (result.resultType === 'parking') {
        const matches = (window.jcuSearchIndex?.parking || []).filter(
            item => item.properties?.parkType === feature.properties?.parkType
        );

        filterSearchableClusters(matches);

        if (matches.length > 1) {
            searchInput.value = result.name;
            if (clearSearchButton) clearSearchButton.hidden = false;
            closeSearchResults();
            return;
        }
    } else if (result.resultType === 'poi') {
        const matches = (window.jcuSearchIndex?.pois || []).filter(
            item => item.properties?.description === feature.properties?.description
        );

        filterSearchableClusters(matches);

        if (matches.length > 1) {
            searchInput.value = result.name;
            if (clearSearchButton) clearSearchButton.hidden = false;
            closeSearchResults();
            return;
        }
    } else {
        restoreOriginalClusters();
    }

    // ------- Toggle POI and Parking Layers -------

    // if (result.resultType === 'poi') {
    //     map.addLayer(poiLayer);
    //     map.removeLayer(parkingLayer);
    // } else if (result.resultType === 'parking') {
    //     map.addLayer(parkingLayer);
    //     map.removeLayer(poiLayer);
    // }

    if (result.resultType === 'building') {
        highlightBuilding(feature);
    }

    // Fly to point features
    if (geometry.type === 'Point') {
        const [lng, lat] = geometry.coordinates;
        map.flyTo([lat, lng], Math.max(map.getZoom(), 19), {
            duration: 1
        });
    } else {
        // Fit buildings and parking areas within the map.
        const bounds = L.geoJSON(feature).getBounds();

        if (bounds.isValid()) {
            map.flyToBounds(bounds, {
                padding: [50, 50],
                maxZoom: 19,
                duration: 1
            });
        }
    }

    // Only update the search input.
    searchInput.value = result.name;

    if (clearSearchButton) {
        clearSearchButton.hidden = false;
    }

    closeSearchResults();
}

// ------- Search Input Events -------

if (searchInput && searchResults && searchBar) {
    searchInput.addEventListener('input', renderSearchResults);

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '') {
            renderRecentSearches();
        }
    });

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

        if (clearSearchButton) {
            clearSearchButton.hidden = true;
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
        
        if (clearSearchButton) {
            clearSearchButton.hidden = true;
        }
        closeSearchResults();
    });
});

// ------- Search Button -------

const searchButton = searchBar?.querySelector('button');

searchButton?.addEventListener('click', () => {
    searchInput.focus();

    if (searchInput.value.trim() === '') {
        renderRecentSearches();
    } else {
        renderSearchResults();
    }
});

// ------- Initial State -------

const selectedCampus = document.querySelector('input[name="campus"]:checked')?.value || 'tsv';
updateSearchPlaceholder(selectedCampus);