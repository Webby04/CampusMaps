// ------- User Location -------

let userLocationMarker = null;
let userAccuracyCircle = null;

let lastUserPosition = null;
let outsidePopupShown = false;

let locationWatcherId = null;

function updateLocateButtonVisibility(isInsideCampus) {
    const locateButton = document.querySelector(".user-location-button");

    if (!locateButton) return;

    locateButton.style.display = isInsideCampus ? "" : "none";
}

function showLocationPopup() {
    if (outsidePopupShown) return;

    outsidePopupShown = true;

    document.getElementById("location-warning-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "location-warning-overlay";
    overlay.className = "location-warning-overlay";
    
    overlay.innerHTML = `<div class="location-warning-popup" role="dialog" aria-modal="true" aria-labelledby="location-warning-title" tabindex="-1">
        <button class="location-warning-close" type="button" aria-label="Close popup">&times;</button>
        <h2 id="location-warning-title">Location unavailable</h2>
        <p>Your current location is outside the selected campus boundaries. Location features are only available within the campus map area.</p>
    </div>`;

    document.body.appendChild(overlay);
    
    const dialog = overlay.querySelector(".location-warning-popup");
    const closeButton = dialog.querySelector(".location-warning-close");
    const locateButton = document.querySelector(".user-location-button");
    const mapElement = document.getElementById("map");

    // Move keyboard focus into the popup
    dialog.focus();

    function closeLocationPopup() {
        overlay.remove();
        outsidePopupShown = false;

        // Return focus to a visible element
        if (locateButton && locateButton.getClientRects().length > 0) {
            locateButton.focus();
        } else if (mapElement) {
            mapElement.setAttribute("tabindex", "-1");
            mapElement.focus();
        }
    }

    // Close when the close button is clicked
    closeButton.addEventListener("click", closeLocationPopup);

    // Close on Escape and keep focus inside the dialog
    dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeLocationPopup();
        }

        if (event.key === "Tab") {
            event.preventDefault();
            closeButton.focus();
        }
    });
    
    // Close when clicking the overlay outside the popup
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeLocationPopup();
        }
    });
}

function removeUserLocation() {
    if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
        userLocationMarker = null;
    }

    if (userAccuracyCircle) {
        map.removeLayer(userAccuracyCircle);
        userAccuracyCircle = null;
    }

    updateLocateButton();
}

function checkUserLocationAgainstCampus() {
    if (!lastUserPosition || !campusBounds) return;

    const { latitude, longitude } = lastUserPosition;

    const isInsideCampus = campusBounds.contains([latitude, longitude]);

    if (!isInsideCampus) {
        removeUserLocation();
        updateLocateButtonVisibility(false);
        showLocationPopup();
        return;
    }

    updateLocateButtonVisibility(true);

    outsidePopupShown = false;

    const popup = document.getElementById("location-warning-overlay");

    if (popup) popup.remove();

    showUserLocation(latitude, longitude, lastUserPosition.accuracy);
}

function showUserLocation(latitude, longitude, accuracy) {
    const locationIcon = L.divIcon({
        className: 'user-location-icon',
        html: '<div class="user-location-dot"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
    
    if (userLocationMarker) {
        userLocationMarker.setLatLng([latitude, longitude]);
    } else {
        userLocationMarker = L.marker([latitude, longitude], { icon: locationIcon }).addTo(map);
    }

    // Accuracy circle
    if (userAccuracyCircle) {
        userAccuracyCircle.setLatLng([latitude, longitude]);
        userAccuracyCircle.setRadius(accuracy);
    } else {
        userAccuracyCircle = L.circle([latitude, longitude], {
            radius: accuracy,
            pane: `accuracyPane`,
            className: 'user-accuracy-circle',
            interactive: false
        }).addTo(map);
    }

    updateLocateButton();
}


function watchUserLocation() {
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        return;
    }

    if (locationWatcherId !== null) return;

    locationWatcherId = navigator.geolocation.watchPosition(
        (position) => {
            lastUserPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            checkUserLocationAgainstCampus();
        },
        (error) => {
            console.log("Error getting user location:", error);
            locationWatcherId = null;
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0
        }
    );
}