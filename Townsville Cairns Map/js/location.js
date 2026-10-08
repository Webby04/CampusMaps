// ------- User Location -------

let userLocationMarker = null;

function showUserLocation(latitude, longitude) {
    const locationIcon = L.divIcon({
        className: 'user-location-icon',
        html: '<div class="user-location-dot"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    if (userLocationMarker) {
        userLocationMarker.setLatLng([latitude, longitude]);
    } else {
        userLocationMarker = L.marker([latitude, longitude], { icon: locationIcon }).addTo(map);
    }
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

            showUserLocation(latitude, longitude);

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