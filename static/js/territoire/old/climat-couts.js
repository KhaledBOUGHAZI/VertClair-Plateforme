function calculerBudgetAdaptation(actions) {

    let total = 0;

    actions.forEach(action => {

        if (action.type === "chaleur") {
            total += 50000;
        }

        if (action.type === "secheresse") {
            total += 30000;
        }

        if (action.type === "inondation") {
            total += 200000;
        }

        if (action.type === "argiles") {
            total += 100000;
        }

        if (action.type === "nappes") {
            total += 80000;
        }

        if (action.type === "mouvements") {
            total += 120000;
        }
    });

    return total;
}
function calculerBudgetAdaptation(actions) {

    let total = 0;

    actions.forEach(action => {

        if (action.type === "chaleur") total += 50000;
        if (action.type === "secheresse") total += 30000;
        if (action.type === "inondation") total += 200000;
        if (action.type === "argiles") total += 100000;
        if (action.type === "nappes") total += 80000;
        if (action.type === "mouvements") total += 120000;
    });

    return total;
}

window.calculerBudgetAdaptation =
    calculerBudgetAdaptation;

