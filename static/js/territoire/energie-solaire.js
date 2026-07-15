function afficherPotentielSolaire(ville) {

    let irradiation = 1250;
    let niveau = "Bon";
    let couleur = "#16a34a";

    const villeMin =
        (ville || "").toLowerCase();

    if (
        villeMin.includes("lille") ||
        villeMin.includes("rouen") ||
        villeMin.includes("amiens")
    ) {
        irradiation = 1100;
        niveau = "Moyen";
        couleur = "#f59e0b";
    }

    if (
        villeMin.includes("marseille") ||
        villeMin.includes("nice") ||
        villeMin.includes("montpellier")
    ) {
        irradiation = 1450;
        niveau = "Très favorable";
        couleur = "#16a34a";
    }

    const production100 =
        Math.round(irradiation * 0.18 * 100);

    const production500 =
        Math.round(irradiation * 0.18 * 500);

    const production1000 =
        Math.round(irradiation * 0.18 * 1000);

    const foyers100 =
        Math.round(production100 / 4500);

    const foyers500 =
        Math.round(production500 / 4500);

    const foyers1000 =
        Math.round(production1000 / 4500);

document.getElementById("blocSolaireEnergie").innerHTML = `
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-body">

                <h4>☀ Potentiel solaire territorial</h4>

                <p>
                    Niveau :
                    <strong style="color:${couleur}">
                        ${niveau}
                    </strong>
                </p>

                <p class="text-muted">
                    Cette estimation donne un ordre de grandeur du potentiel
                    photovoltaïque du territoire. Elle permet d’identifier les
                    opportunités sur les toitures publiques, les parkings et les
                    bâtiments tertiaires.
                </p>

                <h5 class="mt-3">Production estimée</h5>

                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Surface équipée</th>
                            <th>Production annuelle estimée</th>
                            <th>Équivalent foyers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>100 m²</td>
                            <td>${production100.toLocaleString()} kWh/an</td>
                            <td>≈ ${foyers100} foyers</td>
                        </tr>
                        <tr>
                            <td>500 m²</td>
                            <td>${production500.toLocaleString()} kWh/an</td>
                            <td>≈ ${foyers500} foyers</td>
                        </tr>
                        <tr>
                            <td>1 000 m²</td>
                            <td>${production1000.toLocaleString()} kWh/an</td>
                            <td>≈ ${foyers1000} foyers</td>
                        </tr>
                    </tbody>
                </table>

                <h5 class="mt-3">✅ Facteurs favorables</h5>

<ul>
    <li>Ensoleillement compatible avec le photovoltaïque.</li>
    <li>Valorisation possible des toitures publiques.</li>
    <li>Développement envisageable sur les parkings et zones artificialisées.</li>
</ul>

<h5 class="mt-3">⚠ Contraintes à vérifier</h5>

<ul>
    <li>Présence éventuelle d'ombrages (arbres, bâtiments voisins).</li>
    <li>Orientation et inclinaison des toitures.</li>
    <li>Capacité de raccordement au réseau électrique.</li>
    <li>Contraintes patrimoniales ou architecturales.</li>
</ul>

<h5 class="mt-3">🎯 Actions possibles</h5>

<ul>
    <li>Équiper les écoles et bâtiments publics.</li>
    <li>Installer des ombrières photovoltaïques sur les parkings.</li>
    <li>Étudier l’autoconsommation collective.</li>
    <li>Identifier les grandes toitures communales ou tertiaires.</li>
</ul>

<div class="alert alert-light mt-3 mb-0">
    <strong>Conseil VertClair :</strong>
    commencer par les bâtiments publics présentant une forte consommation énergétique
    et une toiture bien exposée.
</div>

            </div>
        </div>
    `;
}

window.afficherPotentielSolaire =
    afficherPotentielSolaire;