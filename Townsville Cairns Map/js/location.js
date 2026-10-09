// ------- User Location -------

let userLocationMarker = null;
let userAccuracyCircle = null;

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

    navigator.geolocation.watchPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            showUserLocation(latitude, longitude, accuracy);

            console.log("User location updated:", latitude, longitude);
        },
        (error) => {
            console.log("Error getting user location:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0
        }
    );
}

watchUserLocation();