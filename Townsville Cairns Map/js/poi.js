var poiLayer = null;

var transportIcons = createMarkerCluster();
var escooterIcons = createMarkerCluster();

// ------- POI Icon Function -------

function getPOIIcon(type) {
    let iconHTML;
    let iconClass;

    switch(type) {
        case 'MOTORC':
            iconHTML = `<span class="material-symbols-outlined">motorcycle</span>`;
            iconClass = 'poi-motorc';
            break;
        case 'ACCPARK':
            iconHTML = `<i class="fa-solid fa-wheelchair"></i>`;
            iconClass = 'poi-accpark'
            break;
        case 'TRANS':
            iconHTML = `<i class="fa-solid fa-bus-simple"></i>`;
            iconClass = 'poi-trans';
            break;
        case 'ESCOOTER':
            iconHTML = `<span class="material-symbols-outlined">electric_scooter</span>`;
            iconClass = 'poi-escooter';
            break;
        case 'EV_CHG':
            iconHTML = `<i class="fa-solid fa-bolt"></i>`;
            iconClass = 'poi-ev-chg';
            break;
        case 'BIKE':
            iconHTML = `<span class="material-symbols-outlined">directions_bike</span>`;
            iconClass = 'poi-bike';
            break;
        case 'BIKEWS':
            iconHTML = `<i class="fa-solid fa-wrench"></i>`;
            iconClass = 'poi-bikews';
            break;
        case 'CAFE':
        case 'KITCHENETTES':
        case 'FOODBEV':
            iconHTML = `<span class="material-symbols-outlined">restaurant</span>`;
            iconClass = 'poi-foodbev';
            break;
        case 'ATM':
            iconHTML = `<span class="material-symbols-outlined">attach_money</span>`;
            iconClass = 'poi-atm';
            break;
        case 'HELPPHONE':
            iconHTML = `<i class="fa-solid fa-phone"></i>`;
            iconClass = 'poi-helpphone';
            break;
        case 'SECURITY':
            iconHTML = `<i class="fa-solid fa-shield"></i>`;
            iconClass = 'poi-security';
            break;
        case 'DEFIB':
            iconHTML = `<i class="fa-solid fa-heart-crack"></i>`;
            iconClass = 'poi-defib';
            break; 
        case 'PARENT':
            iconHTML = `<i class="fa-solid fa-baby"></i>`;
            iconClass = 'poi-parent';
            break;      
        case 'INFO':
            iconHTML = `<i class="fa-solid fa-circle-info"></i>`;
            iconClass = 'poi-info';
            break; 
        case 'COMGARDEN':
        case 'WELLNESS':
            iconHTML = `<i class="fa-solid fa-leaf"></i>`;
            iconClass = 'poi-wellness';
            break;
        case 'SHWR':
            iconHTML = `<i class="fa-solid fa-shower"></i>`;
            iconClass = 'poi-shower';
            break;
        case 'PWD':
            iconHTML = `<i class="fa-solid fa-restroom"></i>`;
            iconClass = 'poi-pwd';
            break;
        default:
            return null;
    }

    return L.divIcon({
        html: iconHTML,
        className: `poi-icon ${iconClass}`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}