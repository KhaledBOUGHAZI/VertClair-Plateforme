function afficherPotentielGeothermie(ville) {

    let niveau = "Moyen";
    let couleur = "#f59e0b";

    const villeMin =
        (ville || "").toLowerCase();

    if (
        villeMin.includes("paris") ||
        villeMin.includes("melun") ||
        villeMin.includes("orleans")
    ) {
        niveau = "Favorable";
        couleur = "#16a34a";
    }

    document.getElementById(
        "blocGeothermieEnergie"
    ).innerHTML = `

        <div class="card shadow-sm border-0 mt-4">

            <div class="card-body">

                <h4>🌡️ Potentiel géothermique territorial</h4>

                <p>
                    Niveau :
                    <strong style="color:${couleur}">
                        ${niveau}
                    </strong>
                </p>

                <p class="text-muted">
                    La géothermie permet d'exploiter la chaleur du sous-sol
                    pour chauffer ou rafraîchir les bâtiments.
                </p>

                <h5 class="mt-3">
                    ✅ Facteurs favorables
                </h5>

                <ul>
                    <li>Présence potentielle de nappes souterraines.</li>
                    <li>Disponibilité de bâtiments publics importants.</li>
                    <li>Réduction durable des consommations énergétiques.</li>
                </ul>

                <h5 class="mt-3">
                    ⚠ Contraintes à vérifier
                </h5>

                <ul>
                    <li>Étude géologique préalable nécessaire.</li>
                    <li>Investissement initial plus élevé.</li>
                    <li>Faisabilité variable selon le sous-sol local.</li>
                </ul>

                <h5 class="mt-3">
                    🎯 Actions possibles
                </h5>

                <ul>
                    <li>Étudier la mairie et les écoles.</li>
                    <li>Identifier les bâtiments les plus consommateurs.</li>
                    <li>Évaluer un réseau de chaleur local.</li>
                    <li>Consulter les données BRGM.</li>
                </ul>

                <div class="alert alert-light mt-3 mb-0">

                    <strong>
                        Conseil VertClair :
                    </strong>

                    la géothermie est particulièrement pertinente
                    pour les bâtiments publics ayant des besoins
                    énergétiques importants toute l'année.

                </div>

            </div>

        </div>

    `;
}

window.afficherPotentielGeothermie =
    afficherPotentielGeothermie;