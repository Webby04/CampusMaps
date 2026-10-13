// ------- User Location -------

let userLocationMarker = null;
let userAccuracyCircle = null;

let lastUserPosition = null;
let outsidePopupShown = false;

let locationWatcherId = null;
let centerMapLocationFound = false;

function updateLocateButtonVisibility(isInsideCampus) {
    const locateButton = document.querySelector(".user-location-button");

    if (!locateButton) return;

    locateButton.style.display = isInsideCampus ? "" : "none";
}

function showLocationPopup(title, message) {
    document.getElementById("location-warning-overlay")?.remove();

    const button = document.querySelector(".user-location-button");

    if (!button) return;

    const overlay = document.createElement("div");
    overlay.id = "location-warning-overlay";
    overlay.className = "location-warning-overlay";
    
    overlay.innerHTML = `<div class="location-warning-popup" role="dialog" aria-modal="false" aria-labelledby="location-warning-title" tabindex="-1">
        <button class="location-warning-close" type="button" aria-label="Close popup">&times;</button>
        <h2 id="location-warning-title"></h2>
        <p></p>
    </div>`;

    document.body.appendChild(overlay);
    
    const popup = overlay.querySelector(".location-warning-popup");
    const closeButton = popup.querySelector(".location-warning-close");

    popup.querySelector("h2").textContent = title;
    popup.querySelector("p").textContent = message;

    function positionPopup() {
        popup.classList.remove("callout-right", "callout-above");

        const buttonRect = button.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const gap = 12;
        const margin = 12;

        let left = buttonRect.left - popupRect.width - gap;
        let top = buttonRect.top + (buttonRect.height - popupRect.height) / 2;

        if (left < margin) {
            const rightPosition = buttonRect.right + gap;

            if (rightPosition + popupRect.width <= window.innerWidth - margin) {
                left = rightPosition;
                popup.classList.add("callout-right");
            } else {
                left = Math.max(margin, Math.min(buttonRect.left, window.innerWidth - popupRect.width - margin));
                top = buttonRect.top - popupRect.height - gap;
                popup.classList.add("callout-above");
            }
        }

        top = Math.max(margin, Math.min(top, window.innerHeight - popupRect.height - margin));
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }

    function closePopup() {
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", positionPopup);
        overlay.remove();
        button.focus();
    }

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            closePopup();
        }
    }

    // Close when the close button is clicked
    closeButton.addEventListener("click", closePopup);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", positionPopup);

    positionPopup();
    closeButton.focus();
    
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

    const { latitude, longitude, accuracy } = lastUserPosition;

    const isInsideCampus = campusBounds.contains([latitude, longitude]);

    if (!isInsideCampus) {
        locationButtonState = 'offCampus';

        removeUserLocation();
        updateLocateButtonVisibility(true);
        updateLocateButton();

        if (!outsidePopupShown) {
            outsidePopupShown = true;
            showLocationPopup(
                "Location is beyond map bounds",
                "You're outside the selected campus bounds. Location features are currently unavailable."
            );
        }
        return;
    }

    locationButtonState = 'onCampus';
    outsidePopupShown = false;

    document.getElementById("location-warning-overlay")?.remove();

    updateLocateButtonVisibility(true);
    updateLocateButton();

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

            if (centerMapLocationFound && userLocationMarker) {
                centerMapLocationFound = false;

                map.setView(userLocationMarker.getLatLng(), 18, {
                    animate: true
                });
            }
        },
        (error) => {
            if (locationWatcherId !== null) {
                navigator.geolocation.clearWatch(locationWatcherId);
            }

            locationWatcherId = null;
            centerMapLocationFound = false;
            lastUserPosition = null;
            removeUserLocation();
            
            if (error.code === 1) {
                locationButtonState = "permissionDenied";
                updateLocateButton();

                showLocationPopup(
                    "Location permission denied",
                    "Please enable location permissions in your browser settings."
                );
            } else {
                locationButtonState = "default";
                updateLocateButton();
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0
        }
    );
}

if (!navigator.geolocation) {
    updateLocateButtonVisibility(false);
} else {
    updateLocateButtonVisibility(true);
    updateLocateButton();

    if (navigator.permissions?.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
            if (permissionStatus.state === 'denied') {
                locationButtonState = "permissionDenied";
                updateLocateButton();
            }

            permissionStatus.onchange = () => {
                if (permissionStatus.state === 'denied') {
                    locationButtonState = "permissionDenied";
                    updateLocateButton();
                } else if (
                    locationButtonState === "permissionDenied"
                ) {
                    locationButtonState = "default";
                }

                updateLocateButton();
            };
        })
        .catch(() => {
            // Fall back to requesting location normallu.
        });
    }
}