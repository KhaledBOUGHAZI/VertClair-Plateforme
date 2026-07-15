var map = null;
var marker = null;
var coucheTrameVerte = null;
var coucheTrameBleue = null;
var couchesGeojson = {};

function initMap() {
    if (map !== null) return;

    map = L.map("map").setView([46.6, 2.4], 6);

    const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap",
            maxZoom: 19
        }
    );

    const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            attribution: "© Esri",
            maxZoom: 19
        }
    );

    // ===============================
    // Couches écologiques INPN
    // ===============================

    const znieff1 = L.tileLayer.wms(
    "https://data.geopf.fr/wms-r",
    {
        layers: "PROTECTEDAREAS.ZNIEFF1",
        format: "image/png",
        transparent: true,
        opacity: 0.8
    }
);

const znieff2 = L.tileLayer.wms(
    "https://data.geopf.fr/wms-r",
    {
        layers: "PROTECTEDAREAS.ZNIEFF2",
        format: "image/png",
        transparent: true,
        opacity: 0.7
    }
);

const natura2000 = L.tileLayer.wms(
    "https://data.geopf.fr/wms-r",
    {
        layers: "PROTECTEDAREAS.SIC",
        format: "image/png",
        transparent: true,
        opacity: 0.8
    }
);

const parcsNaturels = L.tileLayer.wms(
    "https://data.geopf.fr/wms-r",
    {
        layers: "PROTECTEDAREAS.PNR",
        format: "image/png",
        transparent: true,
        opacity: 0.6
    }
);

    // ===============================
    // Cours d’eau / trame bleue
    // ===============================

    const coursEau = L.tileLayer.wms(
        "https://wxs.ign.fr/topographie/geoportail/r/wms?",
        {
            layers: "HYDROGRAPHY.HYDROGRAPHY",
            format: "image/png",
            transparent: true,
            opacity: 0.9
        }
    );

    const trameBleue = L.layerGroup([
        L.tileLayer.wms(
            "https://wxs.ign.fr/topographie/geoportail/r/wms?",
            {
                layers: "HYDROGRAPHY.HYDROGRAPHY",
                format: "image/png",
                transparent: true,
                opacity: 0.9
            }
        )
    ]);

    // ===============================
    // Trame verte simplifiée
    // ===============================

    const trameVerte = L.layerGroup([
    L.tileLayer.wms(
        "https://ws.carmencarto.fr/WMS/119/fxx_inpn?",
        {
            layers: "Znieff1",
            format: "image/png",
            transparent: true,
            opacity: 0.65
        }
    ),
    L.tileLayer.wms(
        "https://ws.carmencarto.fr/WMS/119/fxx_inpn?",
        {
            layers: "Znieff2",
            format: "image/png",
            transparent: true,
            opacity: 0.45
        }
    ),
    L.tileLayer.wms(
        "https://ws.carmencarto.fr/WMS/119/fxx_inpn?",
        {
            layers: "Natura2000",
            format: "image/png",
            transparent: true,
            opacity: 0.55
        }
    )
]);

    osm.addTo(map);

    const fondsCarte = {
        "OpenStreetMap": osm,
        "Satellite": satellite
    };

    const couchesEcologiques = {};

    L.control.layers(
        fondsCarte,
        couchesEcologiques,
        {
            collapsed: false
        }
    ).addTo(map);

    L.control.scale({
        imperial: false
    }).addTo(map);

    setTimeout(function () {
        map.invalidateSize();
    }, 300);
}

async function rechercherCommune() {
    try {
        const commune = document.getElementById("commune").value.trim();

        if (!commune) {
            alert("Veuillez saisir une commune");
            return;
        }

        changerFenny("reflechir", "🗺️ Recherche en cours...");

        const url =
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(commune)}&fields=centre,nom,code,population&format=json&geometry=centre&boost=population&limit=10`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.length) {
            changerFenny("quiz", "😕 Commune introuvable.");
            return;
        }

        let ville = data.find(
            c => c.nom.toLowerCase() === commune.toLowerCase()
        );

        if (!ville) {
            ville = data[0];
        }

        const lon = ville.centre.coordinates[0];
        const lat = ville.centre.coordinates[1];

        map.setView([lat, lon], 12);
        chargerCouchesBiodiversite(lat, lon);
        afficherTramesLocales(lat, lon);

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([lat, lon]).addTo(map);

        marker.bindPopup(
            `<strong>${ville.nom}</strong><br>Commune localisée`
        ).openPopup();

        genererDiagnostic(ville.nom);

        changerFenny(
            "heureux",
            `🌿 J’ai trouvé <strong>${ville.nom}</strong> !`
        );

        setTimeout(function () {
            modeIdle();
        }, 3000);

        setTimeout(function () {
            map.invalidateSize();
        }, 300);

    } catch (error) {
        console.error("Erreur recherche commune :", error);
        changerFenny("alerte", "⚠️ Une erreur est survenue.");
    }
}
function afficherTramesLocales(lat, lon) {

    if (coucheTrameVerte) {
        map.removeLayer(coucheTrameVerte);
    }

    if (coucheTrameBleue) {
        map.removeLayer(coucheTrameBleue);
    }

    coucheTrameVerte = L.circle([lat, lon], {
        radius: 3500,
        color: "#166534",
        fillColor: "#22c55e",
        fillOpacity: 0.15,
        weight: 2
    }).addTo(map);

    coucheTrameVerte.bindPopup(`
        <strong>Trame verte locale</strong><br>
        Zone indicative de continuités écologiques terrestres à analyser.
    `);

    coucheTrameBleue = L.polyline([
        [lat - 0.035, lon - 0.045],
        [lat - 0.015, lon - 0.020],
        [lat + 0.005, lon + 0.000],
        [lat + 0.025, lon + 0.030],
        [lat + 0.040, lon + 0.055]
    ], {
        color: "#2563eb",
        weight: 5,
        opacity: 0.8
    }).addTo(map);

    coucheTrameBleue.bindPopup(`
        <strong>Trame bleue locale</strong><br>
        Axe hydrographique indicatif à confirmer avec les données publiques.
    `);
}
async function chargerCouchesBiodiversite(lat, lon) {
    try {
        const url = `/api/biodiversite/couches/?lat=${lat}&lon=${lon}&rayon=8`;
        const response = await fetch(url);
        const data = await response.json();

        // Supprimer les anciennes couches
        Object.values(couchesGeojson).forEach(couche => {
            map.removeLayer(couche);
        });

        couchesGeojson = {};

        couchesGeojson.cours_eau = L.geoJSON(data.cours_eau, {
            style: {
                color: "#2563eb",
                weight: 3,
                opacity: 0.9
            }
        }).addTo(map);

        couchesGeojson.znieff1 = L.geoJSON(data.znieff1, {
            style: {
                color: "#15803d",
                weight: 2,
                fillColor: "#22c55e",
                fillOpacity: 0.25
            }
        }).addTo(map);

        couchesGeojson.znieff2 = L.geoJSON(data.znieff2, {
            style: {
                color: "#65a30d",
                weight: 2,
                fillColor: "#84cc16",
                fillOpacity: 0.18
            }
        }).addTo(map);

        couchesGeojson.natura2000 = L.geoJSON(data.natura2000, {
            style: {
                color: "#7c3aed",
                weight: 2,
                fillColor: "#a78bfa",
                fillOpacity: 0.20
            }
        }).addTo(map);

        couchesGeojson.zones_humides = L.geoJSON(data.zones_humides, {
            style: {
                color: "#0891b2",
                weight: 2,
                fillColor: "#67e8f9",
                fillOpacity: 0.25
            }
        }).addTo(map);

        ajouterControleCouchesGeojson();

    } catch (error) {
        console.error("Erreur chargement couches biodiversité :", error);
    }
}

function ajouterControleCouchesGeojson() {
    const overlays = {
        "Cours d'eau": couchesGeojson.cours_eau,
        "ZNIEFF type 1": couchesGeojson.znieff1,
        "ZNIEFF type 2": couchesGeojson.znieff2,
        "Natura 2000": couchesGeojson.natura2000,
        "Zones humides": couchesGeojson.zones_humides
    };

    L.control.layers(null, overlays, {
        collapsed: false
    }).addTo(map);
}
window.initMap = initMap;
window.rechercherCommune = rechercherCommune;