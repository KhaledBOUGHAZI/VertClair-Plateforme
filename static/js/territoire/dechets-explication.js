function afficherIndiceDechets(resultat) {

    document.getElementById("indiceDechets").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>📈 Indicateur de performance en économie circulaire</h4>

                <h2 class="mt-3" style="color:${resultat.niveau.couleur}">
                    ${resultat.total}/100
                </h2>

                <p class="mb-0">
                    <strong>${resultat.niveau.niveau}</strong>
                </p>
            </div>
        </div>
    `;
}


function afficherExplicationIndiceDechets(resultat) {

    const d = resultat.details;

    document.getElementById("explicationIndiceDechets").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">

                <h4>🔎 Détail de l’indicateur</h4>

                <table class="table table-sm mt-3">
                    <thead>
                        <tr>
                            <th>Critère</th>
                            <th>Donnée</th>
                            <th>Règle</th>
                            <th>Points</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>Accessibilité des services</td>
                            <td>${d.accessibilite.donnee}</td>
                            <td>${d.accessibilite.regle}</td>
                            <td>${d.accessibilite.points} / ${d.accessibilite.maximum}</td>
                        </tr>

                        <tr>
                            <td>Diversité des solutions</td>
                            <td>${d.diversite.donnee}</td>
                            <td>${d.diversite.regle}</td>
                            <td>${d.diversite.points} / ${d.diversite.maximum}</td>
                        </tr>

                        <tr>
                            <td>Réparation / réemploi</td>
                            <td>${d.reparationReemploi.donnee}</td>
                            <td>${d.reparationReemploi.regle}</td>
                            <td>${d.reparationReemploi.points} / ${d.reparationReemploi.maximum}</td>
                        </tr>

                        <tr>
                            <td>Économie circulaire locale</td>
                            <td>${d.economieLocale.donnee}</td>
                            <td>${d.economieLocale.regle}</td>
                            <td>${d.economieLocale.points} / ${d.economieLocale.maximum}</td>
                        </tr>

                    </tbody>
                </table>

                <div class="alert alert-light mt-3">

                    <h6>ℹ️ Comprendre le score</h6>

                    <ul class="mb-0">
                        <li>
                            <strong>Accessibilité :</strong>
                            présence de services essentiels comme une déchèterie
                            et une solution de collecte.
                        </li>

                        <li>
                            <strong>Diversité :</strong>
                            nombre de types de solutions disponibles :
                            collecte, réparation, réemploi, partage, achat/revente.
                        </li>

                        <li>
                            <strong>Réparation / réemploi :</strong>
                            capacité locale à prolonger la durée de vie des objets
                            et à éviter les déchets.
                        </li>

                        <li>
                            <strong>Économie circulaire locale :</strong>
                            diversité globale des services disponibles sur le territoire.
                        </li>
                    </ul>

                </div>

                <div class="alert alert-light mb-0">
                    <strong>
                        Score économie circulaire :
                        ${resultat.total} / 100
                    </strong>
                </div>

            </div>
        </div>
    `;
}


window.afficherIndiceDechets =
    afficherIndiceDechets;

window.afficherExplicationIndiceDechets =
    afficherExplicationIndiceDechets;