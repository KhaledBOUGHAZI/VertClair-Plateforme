function ajouterAuPlanTransition(action) {

    let plan =
        JSON.parse(
            localStorage.getItem(
                "planTransition"
            ) || "[]"
        );

    const existe =
        plan.some(
            a => a.id === action.id
        );

    if (!existe) {

        plan.push(action);

        localStorage.setItem(
            "planTransition",
            JSON.stringify(plan)
        );
    }
}

window.ajouterAuPlanTransition =
    ajouterAuPlanTransition;