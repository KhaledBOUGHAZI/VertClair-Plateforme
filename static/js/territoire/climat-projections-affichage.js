function afficherProjectionsClimatiques(data) {

    const zone =
        document.getElementById("projectionsClimatiques");

    if (!zone || !data.climat_officiel) return;

    const climat =
        data.climat_officiel;

    const indicateurs =
        climat.indicateurs || {};
        const interpretation =
    window.genererInterpretationProjections
        ? genererInterpretationProjections(data)
        : [];

    function valeur(horizon, cle, unite) {

        if (
            indicateurs[horizon] &&
            indicateurs[horizon][cle] !== null &&
            indicateurs[horizon][cle] !== undefined
        ) {
            return indicateurs[horizon][cle] + " " + unite;
        }

        return "Non disponible";
    }

    zone.innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">

                <h4>🌡️ Projections climatiques DRIAS / TRACC</h4>

                <p class="text-muted">
                    Les valeurs représentent des moyennes climatiques
                    calculées par Météo-France sur le point DRIAS
                    le plus proche de la commune.
                </p>

                <p class="text-muted">
                    Distance au point DRIAS :
                    ${climat.distance_point_km} km.
                </p>

                <table class="table table-sm">
                    <tr>
                        <th>Indicateur</th>
                        <th>Référence</th>
                        <th>2030</th>
                        <th>2050</th>
                        <th>2100</th>
                    </tr>

                    <tr>
                        <td>🌡️ Température moyenne annuelle</td>
                        <td>${valeur("reference", "temperature_moyenne", "°C")}</td>
                        <td>${valeur("2030", "temperature_moyenne", "°C")}</td>
                        <td>${valeur("2050", "temperature_moyenne", "°C")}</td>
                        <td>${valeur("2100", "temperature_moyenne", "°C")}</td>
                    </tr>

                    <tr>
                        <td>🔥 Jours ≥ 30°C</td>
                        <td>${valeur("reference", "jours_30", "jours/an")}</td>
                        <td>${valeur("2030", "jours_30", "jours/an")}</td>
                        <td>${valeur("2050", "jours_30", "jours/an")}</td>
                        <td>${valeur("2100", "jours_30", "jours/an")}</td>
                    </tr>

                    <tr>
                        <td>🥵 Jours ≥ 35°C</td>
                        <td>${valeur("reference", "jours_35", "jours/an")}</td>
                        <td>${valeur("2030", "jours_35", "jours/an")}</td>
                        <td>${valeur("2050", "jours_35", "jours/an")}</td>
                        <td>${valeur("2100", "jours_35", "jours/an")}</td>
                    </tr>

                    <tr>
                        <td>🌙 Nuits tropicales</td>
                        <td>${valeur("reference", "nuits_tropicales", "nuits/an")}</td>
                        <td>${valeur("2030", "nuits_tropicales", "nuits/an")}</td>
                        <td>${valeur("2050", "nuits_tropicales", "nuits/an")}</td>
                        <td>${valeur("2100", "nuits_tropicales", "nuits/an")}</td>
                    </tr>

                    <tr>
                        <td>💧 Jours de sol sec</td>
                        <td>${valeur("reference", "sol_sec", "jours/an")}</td>
                        <td>${valeur("2030", "sol_sec", "jours/an")}</td>
                        <td>${valeur("2050", "sol_sec", "jours/an")}</td>
                        <td>${valeur("2100", "sol_sec", "jours/an")}</td>
                    </tr>

                    <tr>
                        <td>⛈️ Pluies extrêmes</td>
                        <td>${valeur("reference", "pluies_extremes", "mm")}</td>
                        <td>${valeur("2030", "pluies_extremes", "mm")}</td>
                        <td>${valeur("2050", "pluies_extremes", "mm")}</td>
                        <td>${valeur("2100", "pluies_extremes", "mm")}</td>
                    </tr>
                </table>
                <div class="alert alert-warning mt-3">
    <h6>📈 Évolution climatique projetée</h6>

    <p class="mb-2">
        Entre la période de référence et 2100 :
    </p>

    <ul class="mb-0">
        ${interpretation.map(ligne => `
            <li>${ligne}</li>
        `).join("")}
    </ul>
</div>

                <div class="alert alert-light mt-3">

                    <h6>ℹ️ Comment lire ces résultats ?</h6>

                    <p class="mb-2">
                        <strong>Période de référence</strong> :
                        moyenne observée sur la période 1976-2005.
                        Elle sert de point de comparaison pour mesurer
                        l'évolution future du climat.
                    </p>

                    <p class="mb-2">
                        <strong>2030</strong> :
                        climat correspondant à un réchauffement
                        moyen d'environ +1,5°C en France.
                    </p>

                    <p class="mb-2">
                        <strong>2050</strong> :
                        climat correspondant à un réchauffement
                        moyen d'environ +2°C en France.
                    </p>

                    <p class="mb-0">
                        <strong>2100</strong> :
                        climat correspondant à un réchauffement
                        moyen d'environ +4°C en France
                        selon la trajectoire nationale TRACC.
                    </p>

                </div>

                <small class="text-muted">
                    Source : ${climat.source}
                </small>

            </div>
        </div>
    `;
}

window.afficherProjectionsClimatiques =
    afficherProjectionsClimatiques;