const searchInput = document.querySelector('.map-search-input');

function updateSearchPlaceholder(campus) {
    if (!searchInput) return;

    if (campus === "tsv") {
        searchInput.placeholder = `Search the Townsville Campus...`;
    } else if (campus === "cns") {
        searchInput.placeholder = `Search the Cairns Campus...`;
    }
}

document.querySelectorAll('input[name="campus"]').forEach(campusInput => {
    campusInput.addEventListener('change', () => {
        updateSearchPlaceholder(campusInput.value);
    });
});

document.querySelectorAll('.campus-button').forEach(campusButton => {
    campusButton.addEventListener('click', () => {
        updateSearchPlaceholder(campusButton.dataset.campus);
    });
});

const selectedCampus = document.querySelector('input[name="campus"]:checked')?.value;

if (selectedCampus) {
    updateSearchPlaceholder(selectedCampus);
}