function genererActionsAdaptation(data) {

    const regles =
        obtenirReglesAdaptation();

    const score =
        data.score_vulnerabilite || 50;

    let actions = [];

    if (score >= 40) {

        regles.chaleur.forEach(action => {

            actions.push({
                type: "chaleur",
                libelle: action,
                priorite:
                    calculerPrioriteAction(
                        "chaleur",
                        score
                    )
            });
        });

        regles.secheresse.forEach(action => {

            actions.push({
                type: "secheresse",
                libelle: action,
                priorite:
                    calculerPrioriteAction(
                        "secheresse",
                        score
                    )
            });
        });
    }

    if (
        data.risques &&
        data.risques.risques &&
        data.risques.risques.inondation &&
        data.risques.risques.inondation !== "Faible"
    ) {

        regles.inondation.forEach(action => {

            actions.push({
                type: "inondation",
                libelle: action,
                priorite:
                    calculerPrioriteAction(
                        "inondation",
                        score
                    )
            });
        });
    }

    if (
        document.getElementById("toggleArgiles")?.checked
    ) {

        regles.argiles.forEach(action => {

            actions.push({
                type: "argiles",
                libelle: action,
                priorite:
                    calculerPrioriteAction(
                        "argiles",
                        score
                    )
            });
        });
    }

    if (
        document.getElementById("toggleRemonteesNappes")?.checked
    ) {

        regles.nappes.forEach(action => {

            actions.push({
                type: "nappes",
                libelle: action,
                priorite:
                    calculerPrioriteAction(
                        "nappes",
                        score
                    )
            });
        });
    }

    if (
        document.getElementById("toggleMouvementsTerrain")?.checked
    ) {

        regles.mouvements.forEach(action => {

            actions.push({
                type: "mouvements",
                libelle: action,
                priorite:
                    calculerPrioriteAction(
                        "mouvements",
                        score
                    )
            });
        });
    }

    afficherPlanActionsAdaptation(actions);

    if (window.afficherBudgetAdaptation) {
    afficherBudgetAdaptation(actions);
    }
}

window.genererActionsAdaptation =
    genererActionsAdaptation;