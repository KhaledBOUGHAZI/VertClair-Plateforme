var map = null;
var markerCommune = null;

function initMap() {

    if (map !== null) return;

    map = L.map("map").setView([46.6, 2.4], 6);

    const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap"
        }
    );

    osm.addTo(map);

      
    if (typeof initialiserCoucheZonesInondablesTRI === "function") {
    console.log("appel initialiserCoucheZonesInondablesTRI");
    initialiserCoucheZonesInondablesTRI();
}

setTimeout(function () {
    map.invalidateSize();
}, 300);
}

async function centrerCarteSurCommune(ville) {

    const url =
        "https://api-adresse.data.gouv.fr/search/?q=" +
        encodeURIComponent(ville) +
        "&limit=1";

    const response = await fetch(url);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
        alert("Commune introuvable");
        return null;
    }

    const feature = data.features[0];

    const lon = feature.geometry.coordinates[0];
    const lat = feature.geometry.coordinates[1];

    map.setView([lat, lon], 12);

    if (markerCommune) {
        map.removeLayer(markerCommune);
    }

    markerCommune = L.marker([lat, lon]).addTo(map);

    markerCommune
        .bindPopup(`<strong>${feature.properties.label}</strong>`)
        .openPopup();

    return {
        nom: feature.properties.label,
        lat: lat,
        lon: lon
    };
}

function afficherLectureTerritorialeCarte(niveau) {

    const zone =
        document.getElementById("lectureTerritorialeCarte");

    if (!zone) return;

    let message = "";

    if (niveau === "Élevée") {
        message = `
            Le territoire présente une vulnérabilité climatique élevée.
            Les actions d’adaptation doivent être priorisées sur les secteurs
            urbanisés, les équipements publics et les zones exposées aux risques.
        `;
    } else if (niveau === "Moyenne") {
        message = `
            Le territoire présente une vulnérabilité climatique modérée.
            Une surveillance régulière et des actions progressives sont recommandées.
        `;
    } else {
        message = `
            Le territoire présente une vulnérabilité climatique faible à ce stade.
            Les actions peuvent viser la prévention et le renforcement de la résilience.
        `;
    }

    zone.innerHTML = `
        <div class="alert alert-info">
            <strong>Lecture territoriale :</strong><br>
            ${message}
        </div>
    `;
}

window.initMap = initMap;
window.centrerCarteSurCommune = centrerCarteSurCommune;
window.afficherLectureTerritorialeCarte = afficherLectureTerritorialeCarte;