function afficherPrioritesTerritoire(priorites) {

    const zone =
        document.getElementById("planActionAdaptation");

    if (!zone) return;

    zone.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">

            <h4>🎯 Priorités territoriales</h4>

            <p class="text-muted">
                Classement automatique des enjeux à traiter en priorité
                pour l’adaptation du territoire.
            </p>

            <ol class="mt-3">
                ${priorites.map(priorite => `
                    <li class="mb-3">
                        <strong>${priorite.titre}</strong><br>
                        <span class="text-muted">
                            ${priorite.justification}
                        </span>
                    </li>
                `).join("")}
            </ol>

        </div>
    `;
}

window.afficherPrioritesTerritoire =
    afficherPrioritesTerritoire;