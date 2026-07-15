function qualiteDepuisCode(code) {
    const niveaux = {
        0: "Absent",
        1: "Bon",
        2: "Moyen",
        3: "Dégradé",
        4: "Mauvais",
        5: "Très mauvais",
        6: "Extrêmement mauvais",
        7: "Évènement"
    };

    return niveaux[code] || "Non disponible";
}

function couleurDepuisCode(code) {
    const couleurs = {
        1: "#45d9d0",
        2: "#ffe033",
        3: "#ff9f1c",
        4: "#ff4d4f",
        5: "#9c27b0",
        6: "#8b0038",
        7: "#9e9e9e"
    };

    return couleurs[code] || "#cccccc";
}

function pastille(code) {
    return `
        <span style="
            display:inline-block;
            width:14px;
            height:14px;
            border-radius:50%;
            background:${couleurDepuisCode(code)};
            margin-right:8px;
            vertical-align:middle;
        "></span>
    `;
}

function lignePolluant(nom, code) {
    return `
        <p>
            ${nom} :
            ${pastille(code)}
            ${qualiteDepuisCode(code)}
        </p>
    `;
}

function chargerQualiteAir() {
    const ville = document.getElementById("ville").value.trim();
    const resultatAir = document.getElementById("resultatAir");

    initMap();

    if (!ville) {
        alert("Veuillez entrer une ville");
        return;
    }

    resultatAir.innerHTML = `
        <div class="alert alert-info">
            Chargement des données pour ${ville}...
        </div>
    `;

    fetch("/api/indice-air/?ville=" + encodeURIComponent(ville))
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultatAir.innerHTML = `
                    <div class="alert alert-warning">${data.error}</div>
                `;
                return;
            }

            afficherCommuneSurCarte(data);

            if (!data.atmo || !data.atmo.features || data.atmo.features.length === 0) {
                resultatAir.innerHTML = `
                    <div class="alert alert-warning">
                        Aucune donnée Atmo disponible.
                    </div>
                `;
                return;
            }

            const infos = data.atmo.features[0].properties;

            resultatAir.innerHTML = `
                <h3 class="mb-1">${data.commune}</h3>

                <p style="color:#666; font-size:14px; margin-bottom:25px;">
                    Indices de qualité de l’air du ${infos.date_ech || new Date().toLocaleDateString("fr-FR")}
                </p>

                <div class="row mt-4">

                    <div class="col-md-6">
                        <p>
                            <strong>Qualité de l’air :</strong>
                            ${pastille(infos.code_qual)}
                            ${infos.lib_qual || qualiteDepuisCode(infos.code_qual)}
                        </p>

                        ${lignePolluant("NO₂", infos.code_no2)}
                        ${lignePolluant("O₃", infos.code_o3)}
                        ${lignePolluant("PM10", infos.code_pm10)}
                        ${lignePolluant("PM2.5", infos.code_pm25)}
                    </div>

                    <div class="col-md-6 border-start ps-4">
                        <h6 class="mb-3">Échelle de qualité de l’air</h6>
                        <p>${pastille(1)} 1 = Bon</p>
                        <p>${pastille(2)} 2 = Moyen</p>
                        <p>${pastille(3)} 3 = Dégradé</p>
                        <p>${pastille(4)} 4 = Mauvais</p>
                        <p>${pastille(5)} 5 = Très mauvais</p>
                        <p>${pastille(6)} 6 = Extrêmement mauvais</p>
                        <p>${pastille(7)} 7 = Évènement</p>
                    </div>

                </div>

                <hr class="mt-4">

                <p style="font-weight:bold; text-align:right; margin-top:15px; color:#555;">
                    Source des données : Atmo France / AASQA
                </p>
            `;
        })
        .catch(error => {
    console.error("ERREUR JS AIR :", error);

    resultatAir.innerHTML = `
        <div class="alert alert-danger">
            Erreur JS Air : ${error.message}
        </div>
    `;
});
}

/* =========================
EAU — VALEURS / SEUILS
========================= */
