function calculerPrioriteAction(typeRisque, score) {

    if (score >= 70) {
        return "🔴 Priorité forte";
    }

    if (score >= 40) {
        return "🟠 Priorité moyenne";
    }

    return "🟢 Priorité faible";
}

window.calculerPrioriteAction =
    calculerPrioriteAction;