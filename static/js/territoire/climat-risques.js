async function chargerRisquesClimat(ville) {

    document.getElementById("resultatRisques").innerHTML = `
        <div class="alert alert-info">
            Chargement des risques climatiques...
        </div>
    `;

    try {

        const response =
            await fetch(
                "/api/risques-climat/?ville=" +
                encodeURIComponent(ville)
            );

        const data = await response.json();

        if (data.error) {

            document.getElementById("resultatRisques").innerHTML = `
                <div class="alert alert-warning">
                    ${data.error}
                </div>
            `;

            return;
        }

        let html = `
            <div class="card shadow-sm p-4 mt-4">

                <h3>⚠️ Risques climatiques</h3>

                <h5 class="mt-3">
                    ${data.commune}
                </h5>

                <h4 class="mt-3">
                    Indice de vulnérabilité climatique :
                    <span style="color:#dc2626;">
                        ${data.score_vulnerabilite}/100
                    </span>
                </h4>

                <p>
                    <strong>Niveau :</strong>
                    ${data.niveau}
                </p>

                <table class="table table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>Facteur</th>
                            <th>Contribution</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>🌡️ Chaleur</td>
                            <td>+${data.details_score.chaleur}</td>
                        </tr>

                        <tr>
                            <td>💧 Sécheresse</td>
                            <td>+${data.details_score.secheresse}</td>
                        </tr>

                        <tr>
                            <td>🌊 Inondation</td>
                            <td>+${data.details_score.inondation}</td>
                        </tr>

                        <tr>
                            <td>⛰️ Mouvement de terrain</td>
                            <td>+${data.details_score.mouvement_terrain}</td>
                        </tr>

                        <tr>
                            <td>🧱 Retrait-gonflement des argiles</td>
                            <td>+${data.details_score.argiles}</td>
                        </tr>

                        <tr>
                            <td>🌳 Faible végétation</td>
                            <td>+${data.details_score.vegetation}</td>
                        </tr>

                        <tr>
                            <td>🏢 Vulnérabilité bâtiments</td>
                            <td>+${data.details_score.batiments}</td>
                        </tr>
                    </tbody>
                </table>

                <hr>

                <p>
                    <strong>Retrait-gonflement des argiles :</strong>
                    ${data.risques.argiles}
                </p>

                <p>
                    <strong>Inondation :</strong>
                    ${data.risques.inondation}
                </p>

                <p>
                    <strong>Mouvement de terrain :</strong>
                    ${data.risques.mouvement_terrain}
                </p>

                <p>
                    <strong>Feu de forêt :</strong>
                    ${data.risques.feu_foret}
                </p>

                <hr>

                <h5>Risques détectés par Géorisques</h5>

                <ul>
                    ${(data.risques_detectes || []).map(r =>
                        `<li>${r}</li>`
                    ).join("")}
                </ul>

                <h5 class="mt-4">
                    Priorités d’adaptation
                </h5>

                <ul>
                    ${(data.priorites || []).map(p =>
                        `<li>${p}</li>`
                    ).join("")}
                </ul>

                <div class="text-muted mt-3">
                    Source : ${data.source}
                </div>

            </div>
        `;

        document.getElementById("resultatRisques").innerHTML = html;

    } catch (error) {

        console.error(error);

        document.getElementById("resultatRisques").innerHTML = `
            <div class="alert alert-danger">
                Erreur lors du chargement des risques climatiques.
            </div>
        `;
    }
}

window.chargerRisquesClimat = chargerRisquesClimat;
let coucheZonesInondablesTRI = null;

function initialiserCoucheZonesInondablesTRI() {

    coucheZonesInondablesTRI = L.tileLayer.wms(
    "https://www.georisques.gouv.fr/services",
    {
        layers: "PPRN_COMMUNE_RISQINOND_APPROUV",
        format: "image/png",
        transparent: true,
        attribution: "Géorisques"
    }
);

    const toggleZonesInondablesTRI =
        document.getElementById("toggleZonesInondablesTRI");

    if (toggleZonesInondablesTRI) {
        toggleZonesInondablesTRI.addEventListener("change", function () {

            if (this.checked) {
                coucheZonesInondablesTRI.addTo(map);
            } else {
                map.removeLayer(coucheZonesInondablesTRI);
            }
        });
    }
}

window.initialiserCoucheZonesInondablesTRI =
    initialiserCoucheZonesInondablesTRI;
    console.log("climat-risques.js chargé");
console.log("fonction TRI disponible");