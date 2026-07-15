function afficherPrioritesTerritoire(priorites) {

    const zone =
        document.getElementById("planActionAdaptation");

    if (!zone || !priorites) return;

    zone.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h4>🎯 Priorités territoriales</h4>

            <ul class="mt-3">
                ${priorites.map(p => `
                    <li class="mb-2">
                        <strong>${p.titre || p.risque}</strong><br>
                        <span class="text-muted">
                            ${p.justification || ""}
                        </span>
                    </li>
                `).join("")}
            </ul>
        </div>
    `;
}

window.afficherPrioritesTerritoire =
    afficherPrioritesTerritoire;