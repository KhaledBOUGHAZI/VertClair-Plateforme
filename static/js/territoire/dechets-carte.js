let mapDechets = null;

let couchesDechets = {
    decheteries: null,
    collecte: null,
    reparation: null,
    reemploi: null,
    partage: null,
    achatRevente: null,
    autres: null
};

let marqueursActeursEco = {};


function initMapDechets() {
    if (mapDechets) return;

    mapDechets = L.map("mapDechets").setView([46.6, 2.4], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(mapDechets);

    initialiserCouchesDechets();
    initialiserFiltresCarteDechets();
}


function initialiserCouchesDechets() {

    couchesDechets.decheteries = L.layerGroup().addTo(mapDechets);
    couchesDechets.collecte = L.layerGroup().addTo(mapDechets);
    couchesDechets.reparation = L.layerGroup().addTo(mapDechets);
    couchesDechets.reemploi = L.layerGroup().addTo(mapDechets);
    couchesDechets.partage = L.layerGroup().addTo(mapDechets);
    couchesDechets.achatRevente = L.layerGroup().addTo(mapDechets);
    couchesDechets.autres = L.layerGroup().addTo(mapDechets);
}


function initialiserFiltresCarteDechets() {

    const filtres = [
        ["filtreDecheteries", "decheteries"],
        ["filtreCollecte", "collecte"],
        ["filtreReparation", "reparation"],
        ["filtreReemploi", "reemploi"],
        ["filtrePartage", "partage"],
        ["filtreAchatRevente", "achatRevente"]
    ];

    filtres.forEach(([idCheckbox, nomCouche]) => {

        const checkbox = document.getElementById(idCheckbox);

        if (!checkbox) return;

        checkbox.addEventListener("change", function () {

            if (checkbox.checked) {
                couchesDechets[nomCouche].addTo(mapDechets);
            } else {
                mapDechets.removeLayer(couchesDechets[nomCouche]);
            }
        });
    });
}


document.addEventListener("DOMContentLoaded", function () {
    initMapDechets();
});


function viderCouchesDechets() {

    Object.values(couchesDechets).forEach(couche => {
        if (couche) {
            couche.clearLayers();
        }
    });

    marqueursActeursEco = {};
}


function ajouterPointCarteDechets(couche, marker, id, points) {

    marker.addTo(couche);

    if (id) {
        marqueursActeursEco[id] = marker;
    }

    const latlng = marker.getLatLng();

    points.push([
        latlng.lat,
        latlng.lng
    ]);
}


function categoriePrincipaleActeur(acteur) {

    const categories =
        acteur.categories || [];

    const categorieTexte =
        acteur.categorie || "";

    if (categories.includes("collecte") || categorieTexte.includes("collecte")) {
        return "collecte";
    }

    if (categories.includes("reparation") || categorieTexte.includes("reparation")) {
        return "reparation";
    }

    if (categories.includes("reemploi") || categorieTexte.includes("reemploi")) {
        return "reemploi";
    }

    if (categories.includes("partage") || categorieTexte.includes("partage")) {
        return "partage";
    }

    if (categories.includes("achatRevente") || categorieTexte.includes("achatRevente")) {
        return "achatRevente";
    }

    return "autres";
}


function afficherEquipementsDechetsSurCarte(decheteries, acteursEco) {

    if (!mapDechets) return;

    viderCouchesDechets();

    const points = [];

    decheteries.forEach((d, index) => {

        const lat = parseFloat(d.lat);
        const lon = parseFloat(d.lon);

        if (isNaN(lat) || isNaN(lon)) return;

        const id = "decheterie_" + index;

        const marker = L.marker([lat, lon]);

        marker.bindPopup(`
            <strong>${d.nom || "Déchèterie"}</strong><br>
            Déchèterie<br>
            ${d.adresse || ""}<br>
            ${d.cp || ""} ${d.ville || ""}
        `);

        ajouterPointCarteDechets(
            couchesDechets.decheteries,
            marker,
            id,
            points
        );
    });


    acteursEco.forEach((a, index) => {

        const lat = parseFloat(a.lat);
        const lon = parseFloat(a.lon);

        if (isNaN(lat) || isNaN(lon)) return;

        const categorie =
            categoriePrincipaleActeur(a);

        let couleur = "#6b7280";

if (categorie === "collecte")
    couleur = "#2563eb";

if (categorie === "reparation")
    couleur = "#16a34a";

if (categorie === "reemploi")
    couleur = "#f97316";

if (categorie === "partage")
    couleur = "#9333ea";

if (categorie === "achatRevente")
    couleur = "#92400e";

const marker = L.circleMarker([lat, lon], {
    radius: 7,
    color: couleur,
    fillColor: couleur,
    fillOpacity: 0.8
});

        marker.bindPopup(`
            <strong>${a.nom || "Acteur"}</strong><br>
            ${a.service || ""}<br>
            Catégorie : ${a.categorie || categorie}<br>
            ${a.adresse || ""}<br>
            ${a.ville || ""}
        `);

        const id =
    a.id || "acteur_eco_" + index;
        ajouterPointCarteDechets(
            couchesDechets[categorie],
            marker,
            id,
            points
        );
    });


    if (points.length > 0) {
        mapDechets.fitBounds(points, {
            padding: [30, 30]
        });
    }
}


function centrerActeurEco(idActeur) {

    console.log("ID demandé :", idActeur);
    console.log("Marqueurs disponibles :", Object.keys(marqueursActeursEco));

    const marker =
        marqueursActeursEco[idActeur];

    if (!marker) {
        alert("Acteur introuvable sur la carte : " + idActeur);
        return;
    }

    const latlng =
        marker.getLatLng();

    mapDechets.setView(latlng, 17);
    marker.openPopup();
}


window.centrerActeurEco = centrerActeurEco;
window.afficherEquipementsDechetsSurCarte =
    afficherEquipementsDechetsSurCarte;