var map = null;
var marker = null;

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

    const parcsNaturels = L.tileLayer.wms(
        "https://ws.carmencarto.fr/WMS/119/fxx_inpn?",
        {
            layers: "Parcs_naturels_regionaux",
            format: "image/png",
            transparent: true,
            opacity: 0.35
        }
    );

    const znieff1 = L.tileLayer.wms(
        "https://ws.carmencarto.fr/WMS/119/fxx_inpn?",
        {
            layers: "Znieff1",
            format: "image/png",
            transparent: true,
            opacity: 0.65
        }
    );

    const znieff2 = L.tileLayer.wms(
        "https://ws.carmencarto.fr/WMS/119/fxx_inpn?",
        {
            layers: "Znieff2",
            format: "image/png",
            transparent: true,
            opacity: 0.35
        }
    );

    const natura2000 = L.tileLayer.wms(
        "https://ws.carmencarto.fr/WMS/119/fxx_inpn?",
        {
            layers: "Sites_d_importance_communautaire_JOUE__ZSC_SIC_",
            format: "image/png",
            transparent: true,
            opacity: 0.55
        }
    );

    const coursEau = L.tileLayer.wms(
        "https://wxs.ign.fr/topographie/geoportail/r/wms?",
        {
            layers: "HYDROGRAPHY.HYDROGRAPHY",
            format: "image/png",
            transparent: true,
            opacity: 0.9
        }
    );

    osm.addTo(map);

    L.control.layers(
        {
            "OpenStreetMap": osm,
            "Satellite": satellite
        },
        {
            "Parcs naturels régionaux": parcsNaturels,
            "ZNIEFF type 1": znieff1,
            "ZNIEFF type 2": znieff2,
            "Natura 2000": natura2000,
            "Cours d'eau": coursEau
        },
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

window.initMap = initMap;
window.rechercherCommune = rechercherCommune;