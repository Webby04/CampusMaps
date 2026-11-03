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



// ------- Show All -------

showAllCheckbox.addEventListener("change", function () {
    const checkboxes = [
        standardParkingCheckbox,
        restrictedParkingCheckbox,
        transportMobilityCheckbox,
        amenitiesCheckbox,
        safetySecurityCheckbox,
        foodServicesCheckbox
    ];

    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });

    updateFilterVisibility();
});

// ------- Category Filters -------

const categoryCheckboxes = [
    standardParkingCheckbox,
    restrictedParkingCheckbox,
    transportMobilityCheckbox,
    amenitiesCheckbox,
    safetySecurityCheckbox,
    foodServicesCheckbox
];

categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function () {
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
setupChevron("transportMobilityExpand", "transportMobilityChevron", "transportMobilityFilters");
setupChevron("amenitiesExpand", "amenitiesChevron", "amenitiesFilters");
setupChevron("safetySecurityExpand", "safetySecurityChevron", "safetySecurityFilters");
setupChevron("foodServicesExpand", "foodServicesChevron", "foodServicesFilters");
