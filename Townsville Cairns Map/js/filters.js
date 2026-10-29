// ------- Sidebar -------

const mapSidebar = document.getElementById("map-sidebar");
const menuButton = document.getElementById("menu-button");
const closeButton = document.getElementById("close-button");


// ------- Campus Buttons -------

const campusButtons = document.querySelectorAll(".campus-button");
const campusOptions = document.querySelectorAll('input[name="campus"]');

campusButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const campus = button.dataset.campus;

        callbacktest(campus).catch(error => {
            console.error("Campus reload failed:", error);
        });

        campusButtons.forEach(function (campusButton) {
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

campusOptions.forEach(function (option) {
    option.addEventListener("click", function () {
        const campus = option.value;

        callbacktest(campus).catch(error => {
            console.error("Campus reload failed:", error);
        });

        campusButtons.forEach(function (campusButton) {
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

const standardParkingCheckbox = document.getElementById("standardParkingCheckbox");
const restrictedParkingCheckbox = document.getElementById("restrictedParkingCheckbox");
const transportMobilityCheckbox = document.getElementById("transportMobilityCheckbox");
const amenitiesCheckbox = document.getElementById("amenitiesCheckbox");
const safetySecurityCheckbox = document.getElementById("safetySecurityCheckbox");
const foodServicesCheckbox = document.getElementById("foodServicesCheckbox");
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

const transportCheckbox = document.getElementById("transportCheckbox");
const escooterCheckbox = document.getElementById("escooterCheckbox");
const evChargingCheckbox = document.getElementById("evChargingCheckbox");
const bikeCheckbox = document.getElementById("bikeCheckbox");
const bikewsCheckbox = document.getElementById("bikewsCheckbox");
const foodBevCheckbox = document.getElementById("foodBevCheckbox");
const kitchenettesCheckbox = document.getElementById("kitchenettesCheckbox");
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
    const checkboxes = [
        standardParkingCheckbox,
        restrictedParkingCheckbox,
        transportMobilityCheckbox,
        amenitiesCheckbox,
        safetySecurityCheckbox,
        foodServicesCheckbox,

        freeParkingCheckbox,
        freevPermitCheckbox,
        paidAllDayCheckbox,
        paid4hrMaxCheckbox,
        motorcycleCheckbox,
        accessibleCheckbox,

        residentialCheckbox,
        premiumCheckbox,
        specialParkingCheckbox,
        commercialCheckbox,
        reservedCheckbox,
        loadingCheckbox,
        visitorCheckbox,
        serviceCheckbox,

        transportCheckbox,
        escooterCheckbox,
        evChargingCheckbox,
        bikeCheckbox,
        bikewsCheckbox,
        
        kitchenettesCheckbox,
        parentRoomCheckbox,
        wellnessCheckbox,
        showerCheckbox,
        pwdCheckbox,

        helpPhoneCheckbox,
        securityCheckbox,
        defibCheckbox,

        foodBevCheckbox,
        atmCheckbox,

        infoCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Standard Parking -------

standardParkingCheckbox.addEventListener("change", function () {
    const checkboxes = [
        freeParkingCheckbox,
        freevPermitCheckbox,
        paidAllDayCheckbox,
        paid4hrMaxCheckbox,
        motorcycleCheckbox,
        accessibleCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Restricted Parking -------

restrictedParkingCheckbox.addEventListener("change", function () {
    const checkboxes = [
        residentialCheckbox,
        premiumCheckbox,
        specialParkingCheckbox,
        commercialCheckbox,
        reservedCheckbox,
        loadingCheckbox,
        visitorCheckbox,
        serviceCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Special Parking -------

specialParkingCheckbox.addEventListener("change", function () {
    const checkboxes = [
        commercialCheckbox,
        reservedCheckbox,
        loadingCheckbox,
        visitorCheckbox,
        serviceCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Transport & Mobility -------

transportMobilityCheckbox.addEventListener("change", function () {
    const checkboxes = [
        transportCheckbox,
        escooterCheckbox,
        evChargingCheckbox,
        bikeCheckbox,
        bikewsCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Amenities -------

amenitiesCheckbox.addEventListener("change", function () {
    const checkboxes = [
        kitchenettesCheckbox,
        parentRoomCheckbox,
        wellnessCheckbox,
        showerCheckbox,
        pwdCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Safety & Security -------

safetySecurityCheckbox.addEventListener("change", function () {
    const checkboxes = [
        helpPhoneCheckbox,
        securityCheckbox,
        defibCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Food & Services -------

foodServicesCheckbox.addEventListener("change", function () {
    const checkboxes = [
        foodBevCheckbox,
        atmCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Indiviual Filter Changes -------

const individualCheckboxes = [
    freeParkingCheckbox,
        freevPermitCheckbox,
        paidAllDayCheckbox,
        paid4hrMaxCheckbox,
        motorcycleCheckbox,
        accessibleCheckbox,

        residentialCheckbox,
        premiumCheckbox,
        specialParkingCheckbox,
        commercialCheckbox,
        reservedCheckbox,
        loadingCheckbox,
        visitorCheckbox,
        serviceCheckbox,

        transportCheckbox,
        escooterCheckbox,
        evChargingCheckbox,
        bikeCheckbox,
        bikewsCheckbox,

        kitchenettesCheckbox,
        parentRoomCheckbox,
        wellnessCheckbox,
        showerCheckbox,
        pwdCheckbox,

        helpPhoneCheckbox,
        securityCheckbox,
        defibCheckbox,

        foodBevCheckbox,
        atmCheckbox,

        infoCheckbox
];

individualCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        updateFilterVisibility();
    });
});


// ------- Chevron Controls -------

function setupChevron(buttonID, chevronID, contentID) {
    const button = document.getElementById(buttonID);
    const chevron = document.getElementById(chevronID);
    const content = document.getElementById(contentID);

    // Check that all required elements exist
    if (!button || !chevron || !content) {
        console.error(`Chevron elements not found:`, { buttonID, chevronID, contentID });
        return;
    }

    button.addEventListener("click", function () {
        const isOpen = !content.hidden && !content.classList.contains("hidden");

        if (isOpen) {
            content.hidden = true;
            content.classList.add("hidden");
            chevron.classList.remove("fa-chevron-up");
            chevron.classList.add("fa-chevron-down");
            button.setAttribute("aria-expanded", "false");
        } else {
            content.hidden = false;
            content.classList.remove("hidden");
            chevron.classList.remove("fa-chevron-down");
            chevron.classList.add("fa-chevron-up");
            button.setAttribute("aria-expanded", "true");
        }
    });
}

setupChevron("showAllExpand", "showAllChevron", "filters");
setupChevron("standardParkingExpand", "standardParkingChevron", "standardParkingFilters");
setupChevron("restrictedParkingExpand", "restrictedParkingChevron", "restrictedParkingFilters");
setupChevron("specialParkingExpand", "specialParkingChevron", "specialParkingFilters");
setupChevron("transportMobilityExpand", "transportMobilityChevron", "transportMobilityFilters");
setupChevron("amenitiesExpand", "amenitiesChevron", "amenitiesFilters");
setupChevron("safetySecurityExpand", "safetySecurityChevron", "safetySecurityFilters");
setupChevron("foodServicesExpand", "foodServicesChevron", "foodServicesFilters");
