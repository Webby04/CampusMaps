// ------- Sidebar -------

const mapSidebar = document.getElementById("map-sidebar");
const menuButton = document.getElementById("menu-button");
const closeButton = document.getElementById("close-button");


// ------- Campus Buttons -------

const campusButtons = document.querySelectorAll(".campus-button");
const campusOptions = document.querySelectorAll('input[name="campus"]');

campusButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const campus = button.dataset.campus;

        callbacktest(campus);

        campusButtons.forEach(function(campusButton) {
            campusButton.classList.remove("selected");
            campusButton.setAttribute("aria-pressed", "false");
        });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");

        const radioButton = document.querySelector(
            `input[name="campus"][value="${campus}"]`
        );

        if (radioButton) {
            radioButton.checked = true;
        }

        mapSidebar.classList.remove("expanded");
    });
});

campusOptions.forEach(function(option) {
    option.addEventListener("click", function() {
        const campus = option.value;

        callbacktest(campus);

        campusButtons.forEach(function(campusButton) {
            campusButton.classList.remove("selected");
            campusButton.setAttribute("aria-pressed", "false");
        });

        const selectedButton = document.querySelector(
            `.campus-button[data-campus="${campus}"]`
        );

        if (selectedButton) {
            selectedButton.classList.add("selected");
            selectedButton.setAttribute("aria-pressed", "true");
        }
    });
}); 



// ------- Sidebar Buttons -------

menuButton.addEventListener("click", function () {
    mapSidebar.classList.toggle("expanded");
    map.invalidateSize();
});

closeButton.addEventListener("click", function () {
    mapSidebar.classList.remove("expanded");
    map.invalidateSize();
});


// ------- Filter Elements -------

const showAllExpand = document.getElementById("showAllExpand");
const showAllChevron = document.getElementById("showAllChevron");
const filters = document.getElementById("filters");

const showAllCheckbox = document.getElementById("showAllCheckbox");

const parkingCheckbox = document.getElementById("parkingCheckbox");
const freeParkingCheckbox = document.getElementById("freeParkingCheckbox");
const freevPermitCheckbox = document.getElementById("freevPermitCheckbox");
const paidAllDayCheckbox = document.getElementById("paidAllDayCheckbox");
const paid4hrMaxCheckbox = document.getElementById("paid4hrMaxCheckbox");
const residentialCheckbox = document.getElementById("residentialCheckbox");
const premiumCheckbox = document.getElementById("premiumCheckbox");

const specialParkingCheckbox = document.getElementById("specialParkingCheckbox");
const commercialCheckbox = document.getElementById("commercialCheckbox");
const reservedCheckbox = document.getElementById("reservedCheckbox");
const loadingCheckbox = document.getElementById("loadingCheckbox");
const visitorCheckbox = document.getElementById("visitorCheckbox");
const serviceCheckbox = document.getElementById("serviceCheckbox");

const motorcycleCheckbox = document.getElementById("motorcycleCheckbox");
const accessibleCheckbox = document.getElementById("accessibleCheckbox");

const showOnMapCheckbox = document.getElementById("showOnMapCheckbox");
const transportCheckbox = document.getElementById("transportCheckbox");
const escooterCheckbox = document.getElementById("escooterCheckbox");
const evChargingCheckbox = document.getElementById("evChargingCheckbox");
const bikeCheckbox = document.getElementById("bikeCheckbox");
const bikewsCheckbox = document.getElementById("bikewsCheckbox");
const foodBevCheckbox = document.getElementById("foodBevCheckbox");
const atmCheckbox = document.getElementById("atmCheckbox");
const helpPhoneCheckbox = document.getElementById("helpPhoneCheckbox");
const securityCheckbox = document.getElementById("securityCheckbox");
const defibCheckbox = document.getElementById("defibCheckbox");
const parentRoomCheckbox = document.getElementById("parentRoomCheckbox");
const infoCheckbox = document.getElementById("infoCheckbox");
const wellnessCheckbox = document.getElementById("wellnessCheckbox");
const showerCheckbox = document.getElementById("showerCheckbox");
const pwdCheckbox = document.getElementById("pwdCheckbox");



// ------- Show All -------

showAllCheckbox.addEventListener("change", function () {
    parkingCheckbox.checked = this.checked;
    freeParkingCheckbox.checked = this.checked;
    freevPermitCheckbox.checked = this.checked;
    paidAllDayCheckbox.checked = this.checked;
    paid4hrMaxCheckbox.checked = this.checked;
    residentialCheckbox.checked = this.checked;
    premiumCheckbox.checked = this.checked;
    specialParkingCheckbox.checked = this.checked;
    commercialCheckbox.checked = this.checked;
    reservedCheckbox.checked = this.checked;
    loadingCheckbox.checked = this.checked;
    visitorCheckbox.checked = this.checked;
    serviceCheckbox.checked = this.checked;
    motorcycleCheckbox.checked = this.checked;
    accessibleCheckbox.checked = this.checked;
    showOnMapCheckbox.checked = this.checked;
    transportCheckbox.checked = this.checked;
    escooterCheckbox.checked = this.checked;
    evChargingCheckbox.checked = this.checked;
    bikeCheckbox.checked = this.checked;
    bikewsCheckbox.checked = this.checked;
    foodBevCheckbox.checked = this.checked;
    atmCheckbox.checked = this.checked;
    helpPhoneCheckbox.checked = this.checked;
    securityCheckbox.checked = this.checked;
    defibCheckbox.checked = this.checked;
    parentRoomCheckbox.checked = this.checked;
    infoCheckbox.checked = this.checked;
    wellnessCheckbox.checked = this.checked;
    showerCheckbox.checked = this.checked;
    pwdCheckbox.checked = this.checked;

    if (this.checked) {
        map.addLayer(parkingIcons);
        map.addLayer(freeParkingIcons);
        map.addLayer(freevPermitIcons);
        map.addLayer(paidAllDayIcons);
        map.addLayer(paid4hrMaxIcons);
        map.addLayer(residentialIcons);
        map.addLayer(premiumIcons);
        map.addLayer(commercialIcons);
        map.addLayer(reservedIcons);
        map.addLayer(loadingIcons);
        map.addLayer(visitorIcons);
        map.addLayer(serviceIcons);
        map.addLayer(motorcycleIcons);
        map.addLayer(accessibleIcons);
        map.addLayer(transportIcons);
        map.addLayer(escooterIcons);
        map.addLayer(evChargingIcons);
        map.addLayer(bikeIcons);
        map.addLayer(bikewsIcons);
        map.addLayer(foodBevIcons);
        map.addLayer(atmIcons);
        map.addLayer(helpPhoneIcons);
        map.addLayer(securityIcons);
        map.addLayer(defibIcons);
        map.addLayer(parentRoomIcons);
        map.addLayer(infoIcons);
        map.addLayer(wellnessIcons);
        map.addLayer(showerIcons);
        map.addLayer(pwdIcons);
        map.addLayer(poiLayer);
    } else {
        map.removeLayer(parkingIcons);
        map.removeLayer(freeParkingIcons);  
        map.removeLayer(freevPermitIcons);
        map.removeLayer(paidAllDayIcons);
        map.removeLayer(paid4hrMaxIcons);
        map.removeLayer(residentialIcons);
        map.removeLayer(premiumIcons);
        map.removeLayer(commercialIcons);
        map.removeLayer(reservedIcons);
        map.removeLayer(loadingIcons);
        map.removeLayer(visitorIcons);
        map.removeLayer(serviceIcons);
        map.removeLayer(motorcycleIcons);
        map.removeLayer(accessibleIcons);
        map.removeLayer(transportIcons);
        map.removeLayer(escooterIcons);
        map.removeLayer(evChargingIcons);
        map.removeLayer(bikeIcons);
        map.removeLayer(bikewsIcons);
        map.removeLayer(foodBevIcons);
        map.removeLayer(atmIcons);
        map.removeLayer(helpPhoneIcons);
        map.removeLayer(securityIcons);
        map.removeLayer(defibIcons);
        map.removeLayer(parentRoomIcons);
        map.removeLayer(infoIcons);
        map.removeLayer(wellnessIcons);
        map.removeLayer(showerIcons);
        map.removeLayer(pwdIcons);
        map.removeLayer(poiLayer);
    }
});


// ------- Parking -------

parkingCheckbox.addEventListener("change", function () {
    freeParkingCheckbox.checked = this.checked;
    freevPermitCheckbox.checked = this.checked;
    paidAllDayCheckbox.checked = this.checked;
    paid4hrMaxCheckbox.checked = this.checked;
    residentialCheckbox.checked = this.checked;
    premiumCheckbox.checked = this.checked;
    specialParkingCheckbox.checked = this.checked;
    commercialCheckbox.checked = this.checked;
    reservedCheckbox.checked = this.checked;
    loadingCheckbox.checked = this.checked;
    visitorCheckbox.checked = this.checked;
    serviceCheckbox.checked = this.checked;
    motorcycleCheckbox.checked = this.checked;
    accessibleCheckbox.checked = this.checked;

    if (this.checked) {
        map.addLayer(parkingIcons);
        map.addLayer(freeParkingIcons);
        map.addLayer(freevPermitIcons);
        map.addLayer(paidAllDayIcons);
        map.addLayer(paid4hrMaxIcons);
        map.addLayer(residentialIcons);
        map.addLayer(premiumIcons);
        map.addLayer(commercialIcons);
        map.addLayer(reservedIcons);
        map.addLayer(loadingIcons);
        map.addLayer(visitorIcons);
        map.addLayer(serviceIcons);
        map.addLayer(motorcycleIcons);
        map.addLayer(accessibleIcons);
    } else {
        map.removeLayer(parkingIcons);
        map.removeLayer(freeParkingIcons);
        map.removeLayer(freevPermitIcons);
        map.removeLayer(paidAllDayIcons);
        map.removeLayer(paid4hrMaxIcons);
        map.removeLayer(residentialIcons);
        map.removeLayer(premiumIcons);
        map.removeLayer(commercialIcons);
        map.removeLayer(reservedIcons);
        map.removeLayer(loadingIcons);
        map.removeLayer(visitorIcons);
        map.removeLayer(serviceIcons);
        map.removeLayer(motorcycleIcons);
        map.removeLayer(accessibleIcons);
    }
});



// ------- Show on Map -------

showOnMapCheckbox.addEventListener("change", function () {
    transportCheckbox.checked = this.checked;
    escooterCheckbox.checked = this.checked;
    evChargingCheckbox.checked = this.checked;
    bikeCheckbox.checked = this.checked;
    bikewsCheckbox.checked = this.checked;
    foodBevCheckbox.checked = this.checked;
    atmCheckbox.checked = this.checked;
    helpPhoneCheckbox.checked = this.checked;
    securityCheckbox.checked = this.checked;
    defibCheckbox.checked = this.checked;
    parentRoomCheckbox.checked = this.checked;
    infoCheckbox.checked = this.checked;
    wellnessCheckbox.checked = this.checked;
    showerCheckbox.checked = this.checked;
    pwdCheckbox.checked = this.checked;

    if (this.checked) {
        map.addLayer(poiLayer);
        map.addLayer(transportIcons);
        map.addLayer(escooterIcons);
        map.addLayer(evChargingIcons);
        map.addLayer(bikeIcons);
        map.addLayer(bikewsIcons);
        map.addLayer(foodBevIcons);
        map.addLayer(atmIcons);
        map.addLayer(helpPhoneIcons);
        map.addLayer(securityIcons);
        map.addLayer(defibIcons);
        map.addLayer(parentRoomIcons);
        map.addLayer(infoIcons);
        map.addLayer(wellnessIcons);
        map.addLayer(showerIcons);
        map.addLayer(pwdIcons);
    } else {
        map.removeLayer(poiLayer);
        map.removeLayer(transportIcons);
        map.removeLayer(escooterIcons);
        map.removeLayer(evChargingIcons);
        map.removeLayer(bikeIcons);
        map.removeLayer(bikewsIcons);
        map.removeLayer(foodBevIcons);
        map.removeLayer(atmIcons);
        map.removeLayer(helpPhoneIcons);
        map.removeLayer(securityIcons);
        map.removeLayer(defibIcons);
        map.removeLayer(parentRoomIcons);
        map.removeLayer(infoIcons);
        map.removeLayer(wellnessIcons);
        map.removeLayer(showerIcons);
        map.removeLayer(pwdIcons);
    }
});

// ------- Individual Parking Filters -------

freeParkingCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(freeParkingIcons);
    } else {
        map.removeLayer(freeParkingIcons);
    }
});

freevPermitCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(freevPermitIcons);
    } else {
        map.removeLayer(freevPermitIcons);
    }
});

paidAllDayCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(paidAllDayIcons);
    } else {
        map.removeLayer(paidAllDayIcons);
    }
});

paid4hrMaxCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(paid4hrMaxIcons);
    } else {
        map.removeLayer(paid4hrMaxIcons);
    }
});
residentialCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(residentialIcons);
    } else {
        map.removeLayer(residentialIcons);
    }
});

premiumCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(premiumIcons);
    } else {
        map.removeLayer(premiumIcons);
    }
});

// ------- Special Parking -------

specialParkingCheckbox.addEventListener("change", function () {
    commercialCheckbox.checked = this.checked;
    reservedCheckbox.checked = this.checked;
    loadingCheckbox.checked = this.checked;
    visitorCheckbox.checked = this.checked;
    serviceCheckbox.checked = this.checked;

    if (this.checked) {
        map.addLayer(commercialIcons);
        map.addLayer(reservedIcons);
        map.addLayer(loadingIcons);
        map.addLayer(visitorIcons);
        map.addLayer(serviceIcons);
    } else {
        map.removeLayer(commercialIcons);
        map.removeLayer(reservedIcons);
        map.removeLayer(loadingIcons);
        map.removeLayer(visitorIcons);
        map.removeLayer(serviceIcons);
    }
});

commercialCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(commercialIcons);
    } else {
        map.removeLayer(commercialIcons);
    }
});

reservedCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(reservedIcons);
    } else {
        map.removeLayer(reservedIcons);
    }
});

loadingCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(loadingIcons);
    } else {
        map.removeLayer(loadingIcons);
    }
});

visitorCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(visitorIcons);
    } else {
        map.removeLayer(visitorIcons);
    }
});

serviceCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(serviceIcons);
    } else {
        map.removeLayer(serviceIcons);
    }
});


// ------- Motorcycle and Accessible -------

motorcycleCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(motorcycleIcons);
    } else {
        map.removeLayer(motorcycleIcons);
    }
});

accessibleCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(accessibleIcons);
    } else {
        map.removeLayer(accessibleIcons);
    }
});


// ------- Show on the Map -------

transportCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(transportIcons);
    } else {
        map.removeLayer(transportIcons);
    }
});

escooterCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(escooterIcons);
    } else {
        map.removeLayer(escooterIcons);
    }
});

evChargingCheckbox.addEventListener("change", function () {
    if (this.checked ) {
        map.addLayer(evChargingIcons);
    } else {
        map.removeLayer(evChargingIcons);
    }
});

bikeCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(bikeIcons);
    } else {
        map.removeLayer(bikeIcons);
    }
});

bikewsCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(bikewsIcons);
    } else {
        map.removeLayer(bikewsIcons);
    }
});

foodBevCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(foodBevIcons);
    } else {
        map.removeLayer(foodBevIcons);
    }
});

atmCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(atmIcons);
    } else {
        map.removeLayer(atmIcons);
    }
});

helpPhoneCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(helpPhoneIcons);
    } else {
        map.removeLayer(helpPhoneIcons);
    }
});

securityCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(securityIcons);
    } else {
        map.removeLayer(securityIcons);
    }
});

defibCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(defibIcons);
    } else {
        map.removeLayer(defibIcons);
    }
});

parentRoomCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(parentRoomIcons);
    } else {
        map.removeLayer(parentRoomIcons);
    }
});

infoCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(infoIcons);
    } else {
        map.removeLayer(infoIcons);
    }
});

wellnessCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(wellnessIcons);
    } else {
        map.removeLayer(wellnessIcons);
    }
});

showerCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(showerIcons);
    } else {
        map.removeLayer(showerIcons);
    }
});

pwdCheckbox.addEventListener("change", function () {
    if (this.checked) {
        map.addLayer(pwdIcons);
    } else {
        map.removeLayer(pwdIcons);
    }
});


// ------- Chevron Controls -------

function setupChevron(buttonID, chevronID, contentID) {
    const button = document.getElementById(buttonID);
    const chevron = document.getElementById(chevronID);
    const content = document.getElementById(contentID);

    button.addEventListener("click", () => {
        const isOpen = !content.classList.contains("hidden");

        if (isOpen) {
            content.classList.add("hidden");
            chevron.classList.remove("fa-chevron-up");
            chevron.classList.add("fa-chevron-down");
            button.setAttribute("aria-expanded", "false");
        } else {
            content.classList.remove("hidden");
            chevron.classList.remove("fa-chevron-down");
            chevron.classList.add("fa-chevron-up");
            button.setAttribute("aria-expanded", "true");
        }
    });
}

setupChevron("showAllExpand", "showAllChevron", "filters");
setupChevron("parkingExpand", "parkingChevron", "parkingFilters");
setupChevron("specialParkingExpand", "specialParkingChevron", "specialParkingFilters");
setupChevron("showOnMapExpand", "showOnMapChevron", "showOnMapFilters");
