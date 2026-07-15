let mapAlimentation = null;
let markerAlimentation = null;
let marqueursBio = [];
let marqueursBioParNom = {};

function initMapAlimentation() {

    if (mapAlimentation) return;

    mapAlimentation =
        L.map("mapAlimentation").setView(
            [46.6, 2.4],
            6
        );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap"
        }
    ).addTo(mapAlimentation);
}


function afficherCommuneAlimentationSurCarte(data) {

    if (!mapAlimentation) return;

    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);

    if (isNaN(lat) || isNaN(lon)) return;

    if (markerAlimentation) {
        mapAlimentation.removeLayer(markerAlimentation);
    }

    marqueursBio.forEach(m => {
        mapAlimentation.removeLayer(m);
    });

    marqueursBio = [];
    marqueursBioParNom = {};

    markerAlimentation =
        L.marker([lat, lon]).addTo(mapAlimentation);

    markerAlimentation.bindPopup(`
        <strong>${data.commune}</strong><br>
        Diagnostic alimentation durable<br>
        Code INSEE : ${data.code_insee}
    `);

    const operateurs =
        data.operateurs_bio_carte || [];

    operateurs.forEach((op, index) => {

        const opLat = parseFloat(op.lat);
        const opLon = parseFloat(op.lon);

        if (isNaN(opLat) || isNaN(opLon)) return;

        const idActeur =
    op.id_carte || "bio_" + index;

        const marker =
            L.circleMarker(
                [opLat, opLon],
                {
                    radius: 8,
                    color: "#16a34a",
                    fillColor: "#16a34a",
                    fillOpacity: 0.85
                }
            ).addTo(mapAlimentation);

        const activites =
            Array.isArray(op.activites)
                ? op.activites.join(", ")
                : op.activites || "";

        const productions =
            Array.isArray(op.productions)
                ? op.productions.join(", ")
                : op.productions || "";

        const venteDirecte =
            op.vente_particuliers === true
                ? "Oui"
                : op.vente_particuliers === false
                    ? "Non"
                    : "Non renseigné";

        marker.bindPopup(`
            <strong>${op.nom || "Opérateur bio"}</strong><br>
            <strong>Activités :</strong> ${activites || "Non renseigné"}<br>
            <strong>Productions :</strong> ${productions || "Non renseigné"}<br>
            <strong>Vente directe :</strong> ${venteDirecte}<br>
            <strong>Distance :</strong> ${op.distance || "-"} km<br>
            <strong>Adresse :</strong> ${op.adresse || ""}<br>
            ${op.code_postal || ""} ${op.ville || ""}<br>
            <span class="text-muted">Source : Agence Bio</span>
        `);

        marqueursBio.push(marker);
        marqueursBioParNom[idActeur] = marker;
    });

    setTimeout(function () {

    mapAlimentation.invalidateSize(true);

    mapAlimentation.setView(
        [lat, lon],
        14
    );

    markerAlimentation.openPopup();

}, 500);
}


function zoomerActeurBio(idActeur) {

    const marker =
        marqueursBioParNom[idActeur];

    if (!marker) return;

    document
        .getElementById("mapAlimentation")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    const latlng =
        marker.getLatLng();

    setTimeout(function () {

        mapAlimentation.invalidateSize(true);

        mapAlimentation.setView(
            latlng,
            17
        );

        marker.openPopup();

    }, 400);
}


document.addEventListener(
    "DOMContentLoaded",
    function () {
        initMapAlimentation();
    }
);

window.afficherCommuneAlimentationSurCarte =
    afficherCommuneAlimentationSurCarte;

window.zoomerActeurBio =
    zoomerActeurBio;