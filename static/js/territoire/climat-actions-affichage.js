function afficherPlanActionsAdaptation(actions) {

    const zone =
        document.getElementById("actionsAdaptation");

    if (!zone) return;

    if (!actions || actions.length === 0) {

        zone.innerHTML = "";

        return;
    }

    zone.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">

            <h4>
                🛠️ Plan d'action d'adaptation
            </h4>

            <ul class="mt-3">

                ${actions.map(action => `

                    <li class="mb-2">

                        <strong>
                            ${action.priorite}
                        </strong>

                        <br>

                        ${action.libelle}

                    </li>

                `).join("")}

            </ul>

        </div>
    `;
}

window.afficherPlanActionsAdaptation =
    afficherPlanActionsAdaptation;