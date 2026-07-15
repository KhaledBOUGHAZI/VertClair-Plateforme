var coucheCavites = null;
var coucheArgiles = null;
var coucheMouvementsTerrain = null;
var coucheRemonteeNappeSocle = null;
var couchePPRInondation = null;

function initialiserCouchesReelles() {

    if (!map) return;

    coucheCavites = L.tileLayer.wms(
        "https://geoservices.brgm.fr/risques",
        {
            layers: "CAVITE_LOCALISEE",
            format: "image/png",
            transparent: true,
            attribution: "BRGM / Géorisques"
        }
    );

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

    ajouterControleCouchesPubliques();
}

function ajouterControleCouchesPubliques() {

    const overlays = {
        "🕳️ Cavités souterraines": coucheCavites,
        "🧱 Retrait-gonflement des argiles": coucheArgiles,
        "⛰️ Mouvements de terrain": coucheMouvementsTerrain,
        "💦 Remontées de nappes": coucheRemonteeNappeSocle,
        "🌊 PPR inondation": couchePPRInondation
    };

    L.control.layers(null, overlays, {
        collapsed: false
    }).addTo(map);

    map.on("overlayadd", function (event) {

        if (event.layer === coucheCavites) {
            afficherFicheCouche("cavites");
        }

        if (event.layer === coucheArgiles) {
            afficherFicheCouche("argiles");
        }

        if (event.layer === coucheMouvementsTerrain) {
            afficherFicheCouche("mouvements");
        }

        if (event.layer === coucheRemonteeNappeSocle) {
            afficherFicheCouche("nappes");
        }

        if (event.layer === couchePPRInondation) {
            afficherFicheCouche("ppr");
        }
    });

    map.on("overlayremove", function () {

        if (
            !map.hasLayer(coucheCavites) &&
            !map.hasLayer(coucheArgiles) &&
            !map.hasLayer(coucheMouvementsTerrain) &&
            !map.hasLayer(coucheRemonteeNappeSocle) &&
            !map.hasLayer(couchePPRInondation)
        ) {
            afficherFicheCouche(null);
        }
    });
}

window.initialiserCouchesReelles =
    initialiserCouchesReelles;