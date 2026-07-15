function genererActionsEnergie(data, dataDpe) {

    const actions = [];

    if (dataDpe.part_passoires >= 15) {
        actions.push({
            id: "energie_renovation_passoires",
            priorite: "Élevée",
            titre: "Rénover les passoires thermiques",
            description:
                "Mettre en place un programme de rénovation ciblé sur les bâtiments classés F et G."
        });
    }

    if (data.stress_thermique === "Hausse forte") {
        actions.push({
            id: "energie_confort_ete",
            priorite: "Élevée",
            titre: "Adapter les bâtiments aux fortes chaleurs",
            description:
                "Végétaliser les espaces publics, protéger les façades exposées et améliorer le confort d’été."
        });
    }

    actions.push({
        id: "energie_photovoltaique",
        priorite: "Moyenne",
        titre: "Développer le photovoltaïque",
        description:
            "Étudier les toitures publiques, les écoles et les parkings susceptibles d’accueillir des panneaux solaires."
    });

    actions.push({
        id: "energie_pilotage",
        priorite: "Moyenne",
        titre: "Mettre en place un pilotage énergétique",
        description:
            "Suivre les consommations et optimiser les usages dans les bâtiments publics."
    });

    return actions;
}


function ajouterActionEnergieAuPlan(idAction) {

    const actions =
        window.actionsEnergieCourantes || [];

    const action =
        actions.find(a => a.id === idAction);

    if (!action) return;

    if (!window.ajouterAuPlanTransition) {
        alert("Le module Plan de transition n'est pas chargé.");
        return;
    }

    ajouterAuPlanTransition({
        id: action.id,
        origine: "Énergie",
        type: "Automatique",
        priorite: action.priorite,
        titre: action.titre,
        description: action.description,
        justification:
            "Action proposée à partir du diagnostic énergétique territorial.",
        responsable: "",
        budget: "",
        echeance: "",
        efficacite: "Non évaluée",
        commentaire: "",
        statut: "À étudier"
    });

    alert("Action énergie ajoutée au plan de transition écologique.");
}


window.genererActionsEnergie =
    genererActionsEnergie;

window.ajouterActionEnergieAuPlan =
    ajouterActionEnergieAuPlan;