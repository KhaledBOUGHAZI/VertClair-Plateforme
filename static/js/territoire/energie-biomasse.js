function afficherPotentielBiomasse(ville) {

    let niveau = "Moyen";
    let couleur = "#f59e0b";

    const villeMin =
        (ville || "").toLowerCase();

    if (
        villeMin.includes("evreux") ||
        villeMin.includes("pacy") ||
        villeMin.includes("vernon")
    ) {
        niveau = "Favorable";
        couleur = "#16a34a";
    }

    document.getElementById(
        "blocBiomasseEnergie"
    ).innerHTML = `

        <div class="card shadow-sm border-0 mt-4">

            <div class="card-body">

                <h4>🌳 Biomasse territoriale</h4>

                <p>
                    Niveau :
                    <strong style="color:${couleur}">
                        ${niveau}
                    </strong>
                </p>

                <p class="text-muted">
                    La biomasse permet de valoriser les ressources
                    forestières, agricoles et les déchets verts
                    pour produire de l'énergie renouvelable.
                </p>

                <h5 class="mt-3">
                    ✅ Facteurs favorables
                </h5>

                <ul>
                    <li>Présence d'espaces agricoles ou forestiers.</li>
                    <li>Production de déchets verts valorisables.</li>
                    <li>Possibilité d'alimenter des chaufferies locales.</li>
                </ul>

                <h5 class="mt-3">
                    ⚠ Contraintes à vérifier
                </h5>

                <ul>
                    <li>Disponibilité durable de la ressource.</li>
                    <li>Transport et logistique d'approvisionnement.</li>
                    <li>Qualité de l'air et émissions associées.</li>
                </ul>

                <h5 class="mt-3">
                    🎯 Actions possibles
                </h5>

                <ul>
                    <li>Étudier une chaufferie bois communale.</li>
                    <li>Valoriser les déchets verts.</li>
                    <li>Développer un réseau de chaleur local.</li>
                    <li>Mobiliser les ressources agricoles locales.</li>
                </ul>

                <div class="alert alert-light mt-3 mb-0">

                    <strong>
                        Conseil VertClair :
                    </strong>

                    privilégier les ressources locales
                    et les circuits courts afin de limiter
                    les transports et les émissions associées.

                </div>

            </div>

        </div>

    `;
}

window.afficherPotentielBiomasse =
    afficherPotentielBiomasse;