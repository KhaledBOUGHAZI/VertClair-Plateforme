function afficherBudgetAdaptation(actions) {

    const zone =
        document.getElementById("ficheActionAdaptation");

    if (!zone || !actions || actions.length === 0) return;

    const total =
        calculerBudgetAdaptation(actions);

    zone.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">

            <h4>💰 Budget estimatif d'adaptation</h4>

            <p class="text-muted">
                Estimation indicative à affiner selon la taille du territoire,
                le périmètre des travaux et les choix techniques.
            </p>

            <h3 class="mt-3">
                ${total.toLocaleString("fr-FR")} €
            </h3>

        </div>
    `;
}

window.afficherBudgetAdaptation =
    afficherBudgetAdaptation;