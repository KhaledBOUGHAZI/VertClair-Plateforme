let coucheVulnerabilite = null;
let coucheChaleur = null;
let coucheInondation = null;
let coucheSecheresse = null;

function afficherZoneVulnerabilite(lat, lon, niveau) {

    if (!map) return;

    if (coucheVulnerabilite) {
        map.removeLayer(coucheVulnerabilite);
    }

    let couleur = "#facc15";

    if (niveau === "Élevée") {
        couleur = "#dc2626";
    }

    if (niveau === "Faible") {
        couleur = "#16a34a";
    }

    coucheVulnerabilite = L.circle([lat, lon], {
        radius: 700,
        color: couleur,
        fillColor: couleur,
        fillOpacity: 0.25
    }).addTo(map);

    coucheVulnerabilite.bindPopup(`
        <strong>Vulnérabilité climatique locale</strong><br>
        Niveau : ${niveau}<br>
        Cette zone illustre le secteur communal prioritaire à analyser.
    `);
}

function afficherCouchesClimatiques(lat, lon) {

    if (!map) return;

    if (coucheChaleur) map.removeLayer(coucheChaleur);
    if (coucheInondation) map.removeLayer(coucheInondation);
    if (coucheSecheresse) map.removeLayer(coucheSecheresse);

    coucheChaleur = L.circle([lat + 0.01, lon], {
        radius: 500,
        color: "#dc2626",
        fillColor: "#dc2626",
        fillOpacity: 0.25
    }).bindPopup("Vulnérabilité chaleur");

    coucheInondation = L.circle([lat, lon + 0.01], {
        radius: 500,
        color: "#2563eb",
        fillColor: "#2563eb",
        fillOpacity: 0.25
    }).bindPopup("Vulnérabilité inondation");

    coucheSecheresse = L.circle([lat - 0.01, lon], {
        radius: 500,
        color: "#ca8a04",
        fillColor: "#ca8a04",
        fillOpacity: 0.25
    }).bindPopup("Vulnérabilité sécheresse");

    toggleCouchesClimatiques();
}

function toggleCoucheVulnerabilite() {

    const checkbox = document.getElementById("toggleVulnerabilite");

    if (!checkbox || !map || !coucheVulnerabilite) return;

    if (checkbox.checked) {
        coucheVulnerabilite.addTo(map);
    } else {
        map.removeLayer(coucheVulnerabilite);
    }
}

function toggleCouchesClimatiques() {

    if (!map) return;

    const chaleur = document.getElementById("toggleChaleur");
    const inondation = document.getElementById("toggleInondation");
    const secheresse = document.getElementById("toggleSecheresse");

    if (coucheChaleur) {
        chaleur && chaleur.checked
            ? coucheChaleur.addTo(map)
            : map.removeLayer(coucheChaleur);
    }

    if (coucheInondation) {
        inondation && inondation.checked
            ? coucheInondation.addTo(map)
            : map.removeLayer(coucheInondation);
    }

    if (coucheSecheresse) {
        secheresse && secheresse.checked
            ? coucheSecheresse.addTo(map)
            : map.removeLayer(coucheSecheresse);
    }
}

window.afficherZoneVulnerabilite = afficherZoneVulnerabilite;
window.afficherCouchesClimatiques = afficherCouchesClimatiques;
window.toggleCoucheVulnerabilite = toggleCoucheVulnerabilite;
window.toggleCouchesClimatiques = toggleCouchesClimatiques;