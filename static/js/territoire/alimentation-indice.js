function calculerIndiceAlimentation(data) {

    const categories = data.categories_bio || {};

    const producteurs = categories.producteurs || [];
    const agroalimentaire = categories.agroalimentaire || [];
    const commerces = categories.commerces || [];
    const restauration = categories.restauration || [];
    const logistique = categories.logistique || [];

    const tousActeurs = [
        ...producteurs,
        ...agroalimentaire,
        ...commerces,
        ...restauration,
        ...logistique
    ];

    const aMoinsDe10km = acteurs =>
        acteurs.some(a => a.distance && a.distance <= 10);

    const producteurProche = aMoinsDe10km(producteurs);
    const commerceProche = aMoinsDe10km(commerces);

    const venteDirecteProche = tousActeurs.some(a =>
        a.distance &&
        a.distance <= 10 &&
        a.vente_particuliers === true
    );

    const pointsAccessibilite =
        (producteurProche ? 10 : 0) +
        (commerceProche ? 10 : 0) +
        (venteDirecteProche ? 10 : 0);

    const diversite = [
        producteurs,
        agroalimentaire,
        commerces,
        restauration,
        logistique
    ].filter(c => c.length > 0).length;

    const pointsDiversite = diversite * 4;

    const population = data.population || 1;

    const densiteBio =
        ((data.operateurs_bio || 0) / population) * 1000;

    let pointsDensite = 0;

    if (densiteBio >= 1) pointsDensite = 20;
    else if (densiteBio >= 0.5) pointsDensite = 15;
    else if (densiteBio >= 0.2) pointsDensite = 10;
    else pointsDensite = 5;

    const venteDirecte = tousActeurs.some(a =>
        a.vente_particuliers === true
    );

    const pointsCircuitsCourts =
        (producteurs.length > 0 ? 5 : 0) +
        (venteDirecte ? 5 : 0) +
        (producteurProche ? 5 : 0);

    const productionLocale = producteurs.length > 0;
    const transformationLocale = agroalimentaire.length > 0;
    const distributionLocale = commerces.length > 0;

    const pointsResilience =
        (productionLocale ? 5 : 0) +
        (transformationLocale ? 5 : 0) +
        (distributionLocale ? 5 : 0);

    const total =
        pointsAccessibilite +
        pointsDiversite +
        pointsDensite +
        pointsCircuitsCourts +
        pointsResilience;

    let niveau = {
        label: "Faible",
        couleur: "#dc2626"
    };

    if (total >= 70) {
        niveau = {
            label: "Bon",
            couleur: "#16a34a"
        };
    } else if (total >= 40) {
        niveau = {
            label: "Moyen",
            couleur: "#f59e0b"
        };
    }

    return {
        total,
        niveau,
        details: {
            accessibilite: {
                donnee:
                    `Producteur proche : ${producteurProche ? "oui" : "non"}, ` +
                    `commerce proche : ${commerceProche ? "oui" : "non"}, ` +
                    `vente directe proche : ${venteDirecteProche ? "oui" : "non"}`,
                points: pointsAccessibilite,
                maximum: 30,
                regle: "10 pts par service accessible : producteur, commerce, vente directe à moins de 10 km"
            },

            diversite: {
                donnee: `${diversite} catégorie(s) présente(s) sur 5`,
                points: pointsDiversite,
                maximum: 20,
                regle: "4 pts par catégorie présente : producteurs, agroalimentaire, commerces, restauration, logistique"
            },

            densite: {
                donnee:
                    densiteBio.toFixed(2) +
                    " opérateur(s) bio / 1000 habitants",
                points: pointsDensite,
                maximum: 20,
                regle: ">1 = 20 pts ; 0,5 à 1 = 15 pts ; 0,2 à 0,5 = 10 pts ; <0,2 = 5 pts"
            },

            circuitsCourts: {
                donnee:
                    `Producteur : ${producteurs.length > 0 ? "oui" : "non"}, ` +
                    `vente directe : ${venteDirecte ? "oui" : "non"}, ` +
                    `producteur proche : ${producteurProche ? "oui" : "non"}`,
                points: pointsCircuitsCourts,
                maximum: 15,
                regle: "5 pts si producteur présent, 5 pts si vente directe, 5 pts si producteur proche"
            },

            resilience: {
                donnee:
                    `Production : ${productionLocale ? "oui" : "non"}, ` +
                    `transformation : ${transformationLocale ? "oui" : "non"}, ` +
                    `distribution : ${distributionLocale ? "oui" : "non"}`,
                points: pointsResilience,
                maximum: 15,
                regle: "5 pts production, 5 pts transformation, 5 pts distribution"
            }
        }
    };
}


function genererDiagnosticAlimentation(indice) {

    const d = indice.details;
    const messages = [];

    if (d.accessibilite.points >= 20) {
        messages.push("🟢 Le territoire dispose d'une bonne accessibilité à l'alimentation durable.");
    } else {
        messages.push("🟠 L'accès aux producteurs, commerces bio ou ventes directes peut être renforcé.");
    }

    if (d.diversite.points >= 12) {
        messages.push("🟢 La filière alimentaire locale présente une diversité intéressante.");
    } else {
        messages.push("🟠 Certains maillons de la filière alimentaire sont peu représentés.");
    }

    if (d.densite.points < 10) {
        messages.push("🟠 L'offre alimentaire bio reste limitée au regard de la population.");
    }

    if (d.circuitsCourts.points < 10) {
        messages.push("🔴 Les circuits courts constituent un axe prioritaire d'amélioration.");
    }

    if (d.resilience.points < 10) {
        messages.push("🔴 La résilience alimentaire locale doit être renforcée.");
    }

    return messages;
}


function afficherIndiceAlimentation(indice) {

    const d = indice.details;
    const diagnostic = genererDiagnosticAlimentation(indice);

    document.getElementById("indiceAlimentation").innerHTML = `
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-body">

                <h4>📈 Indicateur de résilience alimentaire</h4>

                <h2 style="color:${indice.niveau.couleur}">
                    ${indice.total} / 100
                </h2>

                <p>
                    <strong>${indice.niveau.label}</strong>
                </p>

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
                            <td>Accessibilité alimentaire</td>
                            <td>${d.accessibilite.donnee}</td>
                            <td>${d.accessibilite.regle}</td>
                            <td>${d.accessibilite.points} / ${d.accessibilite.maximum}</td>
                        </tr>

                        <tr>
                            <td>Diversité de la filière</td>
                            <td>${d.diversite.donnee}</td>
                            <td>${d.diversite.regle}</td>
                            <td>${d.diversite.points} / ${d.diversite.maximum}</td>
                        </tr>

                        <tr>
                            <td>Densité alimentaire bio</td>
                            <td>${d.densite.donnee}</td>
                            <td>${d.densite.regle}</td>
                            <td>${d.densite.points} / ${d.densite.maximum}</td>
                        </tr>

                        <tr>
                            <td>Circuits courts</td>
                            <td>${d.circuitsCourts.donnee}</td>
                            <td>${d.circuitsCourts.regle}</td>
                            <td>${d.circuitsCourts.points} / ${d.circuitsCourts.maximum}</td>
                        </tr>

                        <tr>
                            <td>Résilience alimentaire locale</td>
                            <td>${d.resilience.donnee}</td>
                            <td>${d.resilience.regle}</td>
                            <td>${d.resilience.points} / ${d.resilience.maximum}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="alert alert-light mt-3">
                    <h5>📋 Diagnostic territorial</h5>

                    <ul class="mb-0">
                        ${diagnostic.map(m => `
                            <li>${m}</li>
                        `).join("")}
                    </ul>
                </div>

                <div class="alert alert-light mt-3">
                    <h6>ℹ️ Comprendre le score</h6>

                    <p class="mb-1">
                        Cet indicateur privilégie l’accessibilité, la diversité,
                        la densité rapportée à la population et la résilience
                        alimentaire plutôt que le simple nombre brut d’acteurs.
                    </p>

                    <p class="mb-0">
                        Une petite commune peut donc obtenir un bon score si elle
                        dispose de services alimentaires bio accessibles, de circuits
                        courts et de maillons locaux de production, transformation
                        ou distribution.
                    </p>
                </div>

                <p class="text-muted mb-0">
                    Sources :
                    Agence Bio, Agreste RA2020, INSEE.
                </p>

            </div>
        </div>
    `;
}


window.calculerIndiceAlimentation =
    calculerIndiceAlimentation;

window.afficherIndiceAlimentation =
    afficherIndiceAlimentation;

window.genererDiagnosticAlimentation =
    genererDiagnosticAlimentation;