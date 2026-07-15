function afficherPotentielEolien(ville) {

    const villeMin = (ville || "").toLowerCase();

    let niveau = "À étudier";
    let couleur = "#f59e0b";

    if (
        villeMin.includes("rouen") ||
        villeMin.includes("amiens") ||
        villeMin.includes("lille")
    ) {
        niveau = "Potentiel possible sous contraintes";
        couleur = "#f59e0b";
    }

    document.getElementById("blocEolienEnergie").innerHTML = `
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-body">

                <h4>🌬️ Potentiel éolien territorial</h4>

                <p>
                    Niveau :
                    <strong style="color:${couleur}">
                        ${niveau}
                    </strong>
                </p>

                <p class="text-muted">
                    Le potentiel éolien dépend fortement du vent local,
                    des distances aux habitations, des contraintes paysagères,
                    environnementales et réglementaires.
                </p>

                <h5 class="mt-3">✅ Facteurs favorables</h5>

                <ul>
                    <li>Présence éventuelle d’espaces ouverts ou agricoles.</li>
                    <li>Possibilité d’implantation hors zones urbanisées.</li>
                    <li>Intérêt possible pour une production locale d’électricité.</li>
                </ul>

                <h5 class="mt-3">⚠ Contraintes à vérifier</h5>

                <ul>
                    <li>Distance aux habitations.</li>
                    <li>Contraintes paysagères et patrimoniales.</li>
                    <li>Zones Natura 2000, ZNIEFF ou continuités écologiques.</li>
                    <li>Servitudes aéronautiques, radars ou militaires.</li>
                    <li>Acceptabilité locale et concertation avec les habitants.</li>
                </ul>

                <h5 class="mt-3">🎯 Actions possibles</h5>

                <ul>
                    <li>Identifier les zones théoriquement favorables.</li>
                    <li>Croiser le potentiel avec les contraintes biodiversité et urbanisme.</li>
                    <li>Lancer une étude de faisabilité éolienne.</li>
                    <li>Organiser une concertation locale en amont.</li>
                </ul>

                <div class="alert alert-light mt-3 mb-0">
                    <strong>Conseil VertClair :</strong>
                    considérer l’éolien comme un potentiel à étudier avec prudence,
                    en croisant systématiquement vent, biodiversité, paysage et proximité des habitants.
                </div>

            </div>
        </div>
    `;
}

window.afficherPotentielEolien =
    afficherPotentielEolien;