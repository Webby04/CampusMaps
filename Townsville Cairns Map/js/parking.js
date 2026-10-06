var parkingLayer = L.featureGroup().addTo(map);

var freeParkingLayer = null;
var freevPermitLayer = null;
var paidAllDayLayer = null;
var paid4hrMaxLayer = null;
var residentialLayer = null;
var premiumLayer = null;

// ------- Parking Icons -------

var parkingIcons = L.featureGroup().addTo(map);
var freeParkingIcons = L.featureGroup().addTo(map);
var freevPermitIcons = L.featureGroup().addTo(map);
var paidAllDayIcons = L.featureGroup().addTo(map);
var paid4hrMaxIcons = L.featureGroup().addTo(map);
var residentialIcons = L.featureGroup().addTo(map);
var premiumIcons = L.featureGroup().addTo(map);

var commercialIcons = L.featureGroup().addTo(map);
var reservedIcons = L.featureGroup().addTo(map);
var loadingIcons = L.featureGroup().addTo(map);
var visitorIcons = L.featureGroup().addTo(map);
var serviceIcons = L.featureGroup().addTo(map);

var motorcycleIcons = L.featureGroup().addTo(map);
var accessibleIcons = L.featureGroup().addTo(map);


// ------- Add Parking Icons -------

function addParkingIcon(feature, layer) {
    var center = layer.getBounds().getCenter();
    var parkType = feature.properties.parkType;

    var marker = L.marker(center, {
        icon: getParkingIcon(parkType)
    });

    if (parkType === "COMMERCIAL") {
        marker.addTo(commercialIcons);
    } else if (parkType === "RESERVED") {
        marker.addTo(reservedIcons);
    } else if (parkType === "LOADING") {
        marker.addTo(loadingIcons);
    } else if (parkType === "VISITOR") {
        marker.addTo(visitorIcons);
    } else if (parkType === "SERVICE") {
        marker.addTo(serviceIcons);
    } else {
        marker.addTo(parkingIcons);
    }
}


// ------- Parking Icon Function -------

function getParkingIcon(parkType) {
    let iconClass;

    switch (parkType) {
        case 'FREE':
            iconClass = 'parking-free';
            break;
        case 'FREEVPERMIT':
            iconClass = 'parking-freevpermit'
            break;
        case 'PAID-ALL':
            iconClass = 'parking-paid-all';
            break;
        case 'PAID-4HR':
            iconClass = 'parking-paid-4hr'
            break;
        case 'RESIDENTIAL':
            iconClass = 'parking-residential';
            break;
        case 'CEL-PREM':
            iconClass = 'parking-cel-prem'
            break;            
        case 'COMMERCIAL':
        case 'RESERVED':
        case 'LOADING':
        case 'VISITOR':
        case 'SERVICE':
            iconClass = 'parking-special';
            break;
    }

    return L.divIcon({
        html: `<i class="fa-solid fa-square-parking ${iconClass}"></i>`,
        className: 'parking-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    })
}