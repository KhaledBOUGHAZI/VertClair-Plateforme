

async function chargerDonneesDechets() {

    const ville =
        document.getElementById("villeDechets").value.trim();

    const adresse =
        document.getElementById("adresseDechets").value.trim();

    const zone =
        document.getElementById("resultatDechets");

    if (!ville) {
        alert("Veuillez entrer une commune.");
        return;
    }

    zone.innerHTML = `
        <div class="alert alert-info">
            Chargement des données déchets...
        </div>
    `;

    try {

        let urlDecheteries =
            "/api/decheteries/?ville=" +
            encodeURIComponent(ville);

        let urlEco =
            "/api/economie-circulaire/?ville=" +
            encodeURIComponent(ville);

        if (adresse) {
            urlDecheteries +=
                "&adresse=" +
                encodeURIComponent(adresse);

            urlEco +=
                "&adresse=" +
                encodeURIComponent(adresse);
        }

        const response =
            await fetch(urlDecheteries);

        const data =
            await response.json();

        const responseEco =
            await fetch(urlEco);

        const dataEco =
            await responseEco.json();

        if (data.error) {
            zone.innerHTML = `
                <div class="alert alert-danger">
                    ${data.error}
                </div>
            `;
            return;
        }

        afficherEquipementsDechetsSurCarte(
            data.decheteries || [],
            dataEco.acteurs || []
        );

        const donneesIndice = {
            decheteries: data.decheteries || [],
            collecte: dataEco.collecte || [],
            reparation: dataEco.reparation || [],
            reemploi: dataEco.reemploi || [],
            partage: dataEco.partage || [],
            achatRevente: dataEco.achatRevente || [],
            acteurs: dataEco.acteurs || []
        };

        const resultatIndice =
            calculerIndiceEconomieCirculaire(donneesIndice);

        const actions =
    genererActionsDechets(
        data,
        resultatIndice
    );

        actions.sort((a, b) => {
            const ordre = {
                "Élevée": 1,
                "Moyenne": 2,
                "Faible": 3
            };

            return ordre[a.priorite] - ordre[b.priorite];
        });

        window.actionsDechetsCourantes = actions;

        afficherIndiceDechets(resultatIndice);
        afficherExplicationIndiceDechets(resultatIndice);
        afficherActionsDechets(actions);

        zone.innerHTML = "";

        afficherEconomieCirculaire(
            dataEco,
            data.decheteries || []
        );

        document.getElementById("boutonsDechets").style.display = "block";
        document.getElementById("economieCirculaire").style.display = "none";
        document.getElementById("indiceDechets").style.display = "none";
        document.getElementById("explicationIndiceDechets").style.display = "none";
        document.getElementById("actionsDechets").style.display = "none";

    } catch (error) {

        console.error(error);

        zone.innerHTML = `
            <div class="alert alert-danger">
                Erreur lors du chargement des données déchets.
            </div>
        `;
    }
}


function ajouterActionDechetsAuPlan(ville) {

    if (!window.ajouterAuPlanTransition) {
        alert("Le module Plan de transition n'est pas chargé.");
        return;
    }

    ajouterAuPlanTransition({
        id: "dechets_reduction_" + ville,
        origine: "Déchets",
        type: "Automatique",
        priorite: "Moyenne",
        titre: "Réduire les déchets à la source",
        description:
            "Mettre en place des actions de prévention, tri, compostage et réemploi sur le territoire.",
        justification:
            "Action issue du module Déchets et recyclage.",
        responsable: "",
        budget: "",
        echeance: "",
        efficacite: "Non évaluée",
        commentaire: "",
        statut: "À étudier"
    });

    alert("Action déchets ajoutée au plan de transition écologique.");
}


function ajouterActionDechetsDetailleeAuPlan(idAction) {

    const actions =
        window.actionsDechetsCourantes || [];

    const action =
        actions.find(a => a.id === idAction);

    if (!action) return;

    if (!window.ajouterAuPlanTransition) {
        alert("Le module Plan de transition n'est pas chargé.");
        return;
    }

    ajouterAuPlanTransition({
        id: action.id,
        origine: "Déchets",
        type: "Automatique",
        priorite: action.priorite,
        titre: action.titre,
        description: action.description,
        justification:
            "Action proposée à partir du diagnostic déchets du territoire.",
        responsable: "",
        budget: "",
        echeance: "",
        efficacite: "Non évaluée",
        commentaire: "",
        statut: "À étudier"
    });

    alert("Action ajoutée au plan de transition écologique.");
}

window.chargerDonneesDechets =
    chargerDonneesDechets;

window.ajouterActionDechetsAuPlan =
    ajouterActionDechetsAuPlan;

window.ajouterActionDechetsDetailleeAuPlan =
    ajouterActionDechetsDetailleeAuPlan;