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

        callbacktest(campus).catch(error => {
            console.error("Campus reload failed:", error);
        });

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

        callbacktest(campus).catch(error => {
            console.error("Campus reload failed:", error);
        });

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

    updateFilterVisibility();
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

    updateFilterVisibility();
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

    updateFilterVisibility();
});

// ------- Individual Parking Filters -------

freeParkingCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

freevPermitCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

paidAllDayCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

paid4hrMaxCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});
residentialCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

premiumCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

// ------- Special Parking -------

specialParkingCheckbox.addEventListener("change", function () {
    commercialCheckbox.checked = this.checked;
    reservedCheckbox.checked = this.checked;
    loadingCheckbox.checked = this.checked;
    visitorCheckbox.checked = this.checked;
    serviceCheckbox.checked = this.checked;

    updateFilterVisibility();
});

commercialCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

reservedCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

loadingCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

visitorCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

serviceCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});


// ------- Motorcycle and Accessible -------

motorcycleCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

accessibleCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});


// ------- Show on the Map -------

transportCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

escooterCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

evChargingCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

bikeCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

bikewsCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

foodBevCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

atmCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

helpPhoneCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

securityCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

defibCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

parentRoomCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

infoCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

wellnessCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

showerCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
});

pwdCheckbox.addEventListener("change", function () {
    updateFilterVisibility();
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