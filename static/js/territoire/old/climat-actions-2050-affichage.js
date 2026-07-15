function afficherActions2050(actions) {

    const zone =
        document.getElementById("ficheActionAdaptation");

    if (!zone || !actions || actions.length === 0) return;

    zone.innerHTML += `
        <div class="card shadow-sm p-4 mb-4">

            <h4>🧩 Actions stratégiques 2030 / 2050</h4>

            <p class="text-muted">
                Actions structurantes à intégrer dans les documents de planification,
                budgets pluriannuels et stratégies d’adaptation.
            </p>

            <ul class="mt-3">
                ${actions.map(a => `<li class="mb-2">${a}</li>`).join("")}
            </ul>

        </div>
    `;
}

window.afficherActions2050 = afficherActions2050;