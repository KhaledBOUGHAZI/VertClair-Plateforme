let map = null;
let markerCommune = null;

function initMap() {

    if (map !== null) return;

    map = L.map("map").setView([46.6, 2.4], 6);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }
    ).addTo(map);
}

function afficherCommuneSurCarte(data) {

    if (!data.centre) return;

    const lat = data.centre.coordinates[1];
    const lon = data.centre.coordinates[0];

    map.setView([lat, lon], 12);

    if (markerCommune) {
        map.removeLayer(markerCommune);
    }

    markerCommune = L.marker([lat, lon]).addTo(map);

    markerCommune.bindPopup(
        `<strong>${data.commune}</strong>`
    ).openPopup();
}

window.initMap = initMap;
window.afficherCommuneSurCarte = afficherCommuneSurCarte;