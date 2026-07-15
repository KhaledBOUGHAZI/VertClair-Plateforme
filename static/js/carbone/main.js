document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".conso").forEach(function(input) {

        input.addEventListener("input", mettreAJourCarbone);
        input.addEventListener("change", mettreAJourCarbone);
    });

    mettreAJourCarbone();
});


function mettreAJourCarbone() {

    calculCO2();
    afficherTopPostesCarbone();
    afficherEquivalenceCarbone();
    afficherFacteursUtilises();
}


document.addEventListener("input", function(e) {

    if (e.target.classList.contains("action-carbone")) {
        calculerActionsCarbone();
    }
});


function getCoefficientDepuisInput(input) {

    let coeff = 0;
if (input.dataset.codeGain && window.facteursEmission) {

    const codes =
        input.dataset.codeGain.split(":");

    const facteurDepart =
        window.facteursEmission[codes[0]];

    const facteurArrivee =
        window.facteursEmission[codes[1]];

    if (facteurDepart && facteurArrivee) {
        return (
            parseFloat(facteurDepart.coefficient) -
            parseFloat(facteurArrivee.coefficient)
        );
    }
}
    if (input.dataset.coeff) {
        coeff = parseFloat(input.dataset.coeff) || 0;
    }

    if (input.dataset.code && window.facteursEmission) {

        const facteur = window.facteursEmission[input.dataset.code];

        if (typeof facteur === "object") {
            coeff = parseFloat(facteur.coefficient) || 0;
        } else {
            coeff = parseFloat(facteur) || 0;
        }
    }

    return coeff;
}


function calculerActionsCarbone() {

    let total = 0;

    document.querySelectorAll(".action-carbone").forEach(function(input) {

        const coeff = getCoefficientDepuisInput(input);
        const valeur = parseFloat(input.value) || 0;
        const gain = coeff * valeur;

        const resultat = input.closest("tr").querySelector(".gain-carbone");

        if (resultat) {
            resultat.innerText = gain.toFixed(1);
        }

        total += gain;
    });

    const totalElement = document.getElementById("gainTotalCarbone");

    if (totalElement) {
        totalElement.innerText = total.toFixed(1);
    }
}


function ajouterActionCarboneAuPlan(bouton) {

    const ligne = bouton.closest("tr");
    const action = ligne.children[0].innerText.trim();

    const gain =
        parseFloat(
            ligne.querySelector(".gain-carbone").innerText
        ) || 0;

    if (gain <= 0) {
        alert("Veuillez d'abord saisir une quantité pour calculer le CO₂ évité.");
        return;
    }

    let theme = "Carbone";

    if (
        action.includes("électrique") ||
        action.includes("climatisation")
    ) {
        theme = "Energie";
    }

    else if (action.includes("voiture")) {
        theme = "Mobilité";
    }

    else if (action.includes("déchets")) {
        theme = "Déchets";
    }

    else if (
        action.includes("bœuf") ||
        action.includes("végétariens")
    ) {
        theme = "Alimentation";
    }

    const actionTransition = {
        theme: theme,
        sous_theme: "Carbone",
        titre: action,
        gain_co2_kg: gain,
        gain_co2_tonnes: gain / 1000,
        priorite: "Moyenne",
        delai: "Court terme",
        cout: "€€",
        source: "Base Empreinte® ADEME – sélection VertClair"
    };

    let plan =
        JSON.parse(
            localStorage.getItem("planTransition")
        ) || [];

    plan.push(actionTransition);

    localStorage.setItem(
        "planTransition",
        JSON.stringify(plan)
    );

    alert("Action ajoutée au plan de transition écologique.");
}


function afficherTopPostesCarbone() {

    const conteneur = document.getElementById("topPostesCarbone");
    if (!conteneur) return;

    const lignes = [];

    document.querySelectorAll(".conso").forEach(function(input) {

        const ligne = input.closest("tr");
        if (!ligne) return;

        const rubrique = ligne.children[0]?.innerText || "";
        const poste = ligne.children[1]?.innerText || "";
        const resultat =
            parseFloat(
                ligne.querySelector(".result")?.innerText
            ) || 0;

        if (resultat > 0) {
            lignes.push({
                rubrique: rubrique,
                poste: poste,
                co2: resultat
            });
        }
    });

    lignes.sort(function(a, b) {
        return b.co2 - a.co2;
    });

    const top = lignes.slice(0, 3);

    if (top.length === 0) {
        conteneur.innerHTML = `
            <div class="alert alert-light">
                Saisissez des consommations pour afficher les principaux postes d’émissions.
            </div>
        `;
        return;
    }

    const repartition = {};

    lignes.forEach(function(item) {
        repartition[item.rubrique] =
            (repartition[item.rubrique] || 0) + item.co2;
    });

    const total = lignes.reduce(function(somme, item) {
        return somme + item.co2;
    }, 0);

    let prioritesHtml = "";

    Object.keys(repartition)
        .sort(function(a, b) {
            return repartition[b] - repartition[a];
        })
        .slice(0, 3)
        .forEach(function(rubrique, index) {

            const part =
                total > 0
                    ? (repartition[rubrique] / total) * 100
                    : 0;

            prioritesHtml += `
                <p>${index + 1}. ${rubrique} :
                    <strong>${part.toFixed(0)} %</strong>
                </p>
            `;
        });

    let html = `
        <table class="table table-sm align-middle">
            <thead>
                <tr>
                    <th>Rang</th>
                    <th>Rubrique</th>
                    <th>Poste</th>
                    <th>Émissions</th>
                </tr>
            </thead>
            <tbody>
    `;

    top.forEach(function(item, index) {

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.rubrique}</td>
                <td>${item.poste}</td>
                <td><strong>${item.co2.toFixed(2)} kg CO₂e</strong></td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>

        <div class="alert alert-warning mt-3 mb-0">
            <h5>🎯 Priorités recommandées</h5>
            ${prioritesHtml}
            <p class="mb-0">
                Vos émissions proviennent principalement de
                <strong>${top[0].rubrique}</strong>.
                Les actions associées à ce poste sont prioritaires.
            </p>
        </div>
    `;

    conteneur.innerHTML = html;
}


function afficherEquivalenceCarbone() {

    const conteneur = document.getElementById("equivalenceCarbone");
    const totalElement = document.getElementById("total");

    if (!conteneur || !totalElement) return;

    const totalKg = parseFloat(totalElement.innerText) || 0;

    if (totalKg <= 0) {
        conteneur.innerHTML = `
            <div class="alert alert-light mb-0">
                Saisissez des consommations pour afficher une équivalence.
            </div>
        `;
        return;
    }

    const kmVoiture = totalKg / 0.26;
    const arbres = totalKg / 10;

    conteneur.innerHTML = `
        <div class="alert alert-info mb-0">
            <strong>${totalKg.toFixed(2)} kg CO₂e</strong>
            représentent environ :
            <br><br>
            🚗 <strong>${kmVoiture.toFixed(0)} km</strong>
            parcourus en voiture thermique
            <br>
            🌳 <strong>${arbres.toFixed(0)} arbres</strong>
            nécessaires pour absorber cette quantité sur un an.
        </div>
    `;
}


function afficherFacteursUtilises() {

    const conteneur =
        document.getElementById("listeFacteursUtilises");

    if (!conteneur) return;

    let html = `
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Poste</th>
                    <th>Facteur utilisé</th>
                    <th>Coefficient</th>
                    <th>Source</th>
                </tr>
            </thead>
            <tbody>
    `;

    let compteur = 0;

    document.querySelectorAll(".conso").forEach(function(input) {

        const valeur = parseFloat(input.value) || 0;

        if (valeur <= 0) return;

        const code = input.dataset.code;

        if (
            !window.facteursEmission ||
            !window.facteursEmission[code]
        ) {
            return;
        }

        const facteur = window.facteursEmission[code];

        const ligne = input.closest("tr");
        if (!ligne) return;

        const poste = ligne.children[1].innerText;

        html += `
<div class="card mb-2">
    <div class="card-body py-2">

        <h6>${poste}</h6>

        <p class="mb-1">
            <strong>Facteur utilisé :</strong>
            ${facteur.nom}
        </p>

        <p class="mb-1">
            <strong>Coefficient :</strong>
            ${facteur.coefficient}
            kg CO₂e / ${facteur.unite}
        </p>

        <p class="mb-0">
            <strong>Source :</strong>
            ${facteur.source || "Base Empreinte® ADEME"}
        </p>

    </div>
</div>
`;

        compteur++;
    });

    html += `
            </tbody>
        </table>
    `;

    if (compteur === 0) {
        conteneur.innerHTML = `
            <div class="text-muted">
                Les facteurs utilisés apparaîtront après saisie.
            </div>
        `;
        return;
    }

    conteneur.innerHTML = html;
}