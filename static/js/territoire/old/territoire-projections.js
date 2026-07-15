function afficherProjectionsClimatiques(score) {

    const zone =
        document.getElementById("projectionsClimatiques");

    if (!zone) return;

    let niveau = "Modéré";
    let couleur = "warning";

    if (score >= 70) {
        niveau = "Élevé";
        couleur = "danger";
    } else if (score < 40) {
        niveau = "Faible";
        couleur = "success";
    }

    zone.innerHTML = `
        <div class="card shadow-sm border-0 p-4 mb-4">

            <h4>🌡️ Projections climatiques 2030 / 2050</h4>

            <div class="alert alert-${couleur} mt-3">
                <strong>Niveau projeté :</strong> ${niveau}
            </div>

            <table class="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Horizon</th>
                        <th>Évolution probable</th>
                        <th>Impacts territoriaux</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>2030</td>
                        <td>Hausse des températures et épisodes chauds plus fréquents</td>
                        <td>Confort d’été, santé, espaces publics</td>
                    </tr>

                    <tr>
                        <td>2050</td>
                        <td>Aggravation chaleur / sécheresse / ruissellement</td>
                        <td>Bâtiments, voiries, eau, sols, biodiversité</td>
                    </tr>
                </tbody>
            </table>

            <h5 class="mt-4">Priorités recommandées</h5>

            <ul>
                <li>Renforcer la végétalisation et les îlots de fraîcheur.</li>
                <li>Limiter l’imperméabilisation des sols.</li>
                <li>Adapter les bâtiments sensibles aux fortes chaleurs.</li>
                <li>Préserver les zones humides et les continuités écologiques.</li>
            </ul>

        </div>
    `;
}

window.afficherProjectionsClimatiques =
    afficherProjectionsClimatiques;