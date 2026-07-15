function construireContexteTransition(data) {

    const risques =
        data.risques?.risques || {};

    const climat =
        data.climat_officiel?.indicateurs || {};

    const ref =
        climat.reference || {};

    const futur =
        climat["2100"] || {};

    return {
        argiles:
            risques.argiles &&
            risques.argiles !== "Faible",

        inondation:
            risques.inondation &&
            risques.inondation !== "Faible",

        jours_30:
            futur.jours_30 || 0,

        nuits_tropicales:
            futur.nuits_tropicales || 0,

        sol_sec:
            futur.sol_sec || 0,

        evolution_sol_sec:
            ref.sol_sec !== undefined && futur.sol_sec !== undefined
                ? Math.round((futur.sol_sec - ref.sol_sec) * 100) / 100
                : 0
    };
}

function conditionActionRemplie(action, contexte) {

    const conditions =
        action.conditions || {};

    if (
        conditions.argiles &&
        !contexte.argiles
    ) {
        return false;
    }

    if (
        conditions.inondation &&
        !contexte.inondation
    ) {
        return false;
    }

    if (
        conditions.jours_30 &&
        contexte.jours_30 < conditions.jours_30
    ) {
        return false;
    }

    if (
        conditions.nuits_tropicales &&
        contexte.nuits_tropicales < conditions.nuits_tropicales
    ) {
        return false;
    }

    if (
        conditions.sol_sec &&
        contexte.sol_sec < conditions.sol_sec
    ) {
        return false;
    }

    return true;
}

function genererActionsDepuisBibliotheque(data) {

    if (!window.bibliothequeActions) {
        return [];
    }

    const contexte =
        construireContexteTransition(data);

    return bibliothequeActions
        .filter(action =>
            conditionActionRemplie(action, contexte)
        )
        .map(action => {

            let justification =
                "Action proposée à partir du diagnostic territorial.";

            if (action.theme === "Chaleur") {
                justification =
                    `Projection DRIAS : ${contexte.jours_30} jours ≥ 30°C/an et ${contexte.nuits_tropicales} nuits tropicales/an à l'horizon 2100.`;
            }

            if (action.theme === "Argiles") {
                justification =
                    "Risque retrait-gonflement des argiles identifié dans les données publiques.";
            }

            if (action.theme === "Inondation") {
                justification =
                    "Risque d'inondation identifié dans les données publiques.";
            }

            return {
                id: action.id,

                origine: action.origine,

                organisme: action.organisme,

                theme: action.theme,

                type: "Automatique",

                priorite: action.priorite,

                titre: action.titre,

                description: action.description,

                justification: justification,

                statut: "À étudier"
            };
        });
}

function ajouterActionsClimatAuPlan(data) {

    const actions =
        genererActionsDepuisBibliotheque(data);

    if (!window.ajouterAuPlanTransition) {
        return actions;
    }

    actions.forEach(action => {
        ajouterAuPlanTransition(action);
    });

    return actions;
}

window.construireContexteTransition =
    construireContexteTransition;

window.genererActionsDepuisBibliotheque =
    genererActionsDepuisBibliotheque;

window.ajouterActionsClimatAuPlan =
    ajouterActionsClimatAuPlan;