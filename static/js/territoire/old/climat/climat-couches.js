let coucheVulnerabilite = null;
let coucheChaleur = null;
let coucheInondation = null;
let coucheSecheresse = null;
let coucheArgiles = null;
let coucheMouvementsTerrain = null;
let coucheRemonteeNappeSedim = null;
let coucheRemonteeNappeSocle = null;
let couchePPRInondation = null;

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

    const checkbox =
        document.getElementById("toggleVulnerabilite");

    if (!checkbox || !map || !coucheVulnerabilite) return;

    if (checkbox.checked) {
        coucheVulnerabilite.addTo(map);
    } else {
        map.removeLayer(coucheVulnerabilite);
    }
    afficherDiagnosticCouchesReelles();
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
    afficherDiagnosticCouchesReelles();
}
function initialiserCouchesReelles() {

    if (!map) return;

    coucheArgiles = L.tileLayer.wms(
        "https://geoservices.brgm.fr/risques",
        {
            layers: "ALEARG",
            format: "image/png",
            transparent: true,
            attribution: "BRGM / Géorisques"
        }
    );

    coucheMouvementsTerrain = L.tileLayer.wms(
        "https://geoservices.brgm.fr/risques",
        {
            layers: "MVT_LOCALISE",
            format: "image/png",
            transparent: true,
            attribution: "BRGM / Géorisques"
        }
    );
    
coucheRemonteeNappeSocle = L.tileLayer.wms(
    "https://geoservices.brgm.fr/risques",
    {
        layers: "REMNAPPE",
        styles: "",
        format: "image/png",
        transparent: true,
        attribution: "BRGM / Géorisques"
    }
);
couchePPRInondation = L.tileLayer.wms(
    "https://www.georisques.gouv.fr/services",
    {
        layers: "PPRN_COMMUNE_RISQINOND_APPROUV",
        format: "image/png",
        transparent: true,
        attribution: "Géorisques"
    }
);
}
function toggleCoucheRemonteesNappes() {

    const checkbox =
        document.getElementById("toggleRemonteesNappes");

    if (!checkbox || !map || !coucheRemonteeNappeSocle) return;

    console.log("remontées nappes cliqué :", checkbox.checked);

    if (checkbox.checked) {
        coucheRemonteeNappeSocle.addTo(map);
        coucheRemonteeNappeSocle.setOpacity(0.7);
        coucheRemonteeNappeSocle.bringToFront();
    } else {
        map.removeLayer(coucheRemonteeNappeSocle);
    }
    afficherDiagnosticCouchesReelles();
}

window.toggleCoucheRemonteesNappes =
    toggleCoucheRemonteesNappes;

function toggleCoucheArgiles() {

    
    const checkbox =
        document.getElementById("toggleArgiles");

    if (!checkbox || !map || !coucheArgiles) return;

    if (checkbox.checked) {
        coucheArgiles.addTo(map);
        coucheArgiles.bringToFront();
        } else {
        map.removeLayer(coucheArgiles);
        }
        afficherDiagnosticCouchesReelles();
}
function toggleCoucheMouvementsTerrain() {

    const checkbox =
        document.getElementById("toggleMouvementsTerrain");

    if (!checkbox || !map || !coucheMouvementsTerrain) return;

    if (checkbox.checked) {
        coucheMouvementsTerrain.addTo(map);
        coucheMouvementsTerrain.bringToFront();
    } else {
        map.removeLayer(coucheMouvementsTerrain);
    }
    afficherDiagnosticCouchesReelles();
}
function toggleCoucheZonesInondablesTRI() {
    // future couche TRI
    afficherDiagnosticCouchesReelles();
}
function toggleCouchePPRInondation() {

    const checkbox =
        document.getElementById("toggleZonesInondablesTRI");

    if (!checkbox || !map || !couchePPRInondation) return;

    console.log("PPR inondation cliqué :", checkbox.checked);

    if (checkbox.checked) {
        couchePPRInondation.addTo(map);
        couchePPRInondation.bringToFront();
    } else {
        map.removeLayer(couchePPRInondation);
    }
    afficherDiagnosticCouchesReelles();
}
function afficherDiagnosticCouchesReelles() {

    const zone =
        document.getElementById("diagnosticCouchesReelles");

    if (!zone) return;

    const nappes =
        document.getElementById("toggleRemonteesNappes")?.checked;

    const inondation =
        document.getElementById("toggleZonesInondablesTRI")?.checked;

    const argiles =
        document.getElementById("toggleArgiles")?.checked;

    const mouvements =
        document.getElementById("toggleMouvementsTerrain")?.checked;

    let lignes = [];

    if (nappes) {
        lignes.push("💧 Sensibilité potentielle aux remontées de nappes.");
    }

    if (inondation) {
        lignes.push("🌊 Commune concernée par un PPR inondation approuvé ou prescrit.");
    }

    if (argiles) {
        lignes.push("🧱 Exposition possible au retrait-gonflement des argiles.");
    }

    if (mouvements) {
        lignes.push("⛰️ Présence possible de mouvements de terrain recensés.");
    }

    if (lignes.length === 0) {
        zone.innerHTML = "";
        return;
    }

    zone.innerHTML = `
        <div class="alert alert-warning">
            <strong>Lecture des couches réelles :</strong>
            <ul class="mb-0 mt-2">
                ${lignes.map(l => `<li>${l}</li>`).join("")}
            </ul>
        </div>
    `;
}

window.afficherDiagnosticCouchesReelles =
    afficherDiagnosticCouchesReelles;

window.toggleCouchePPRInondation = toggleCouchePPRInondation;
window.afficherZoneVulnerabilite = afficherZoneVulnerabilite;
window.afficherCouchesClimatiques = afficherCouchesClimatiques;
window.toggleCoucheVulnerabilite = toggleCoucheVulnerabilite;
window.toggleCouchesClimatiques = toggleCouchesClimatiques;
window.initialiserCouchesReelles = initialiserCouchesReelles;

window.toggleCoucheArgiles = toggleCoucheArgiles;

window.toggleCoucheMouvementsTerrain =
    toggleCoucheMouvementsTerrain;

window.toggleCoucheRemonteesNappes =
    toggleCoucheRemonteesNappes;

window.toggleCoucheZonesInondablesTRI =
    toggleCoucheZonesInondablesTRI;