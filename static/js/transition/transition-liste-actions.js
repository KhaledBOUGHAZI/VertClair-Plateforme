let filtrePlanActif = "Tous";

function lirePlanTransition() {
    return JSON.parse(
        localStorage.getItem("planTransition") || "[]"
    );
}

function sauvegarderPlanTransition(plan) {
    localStorage.setItem(
        "planTransition",
        JSON.stringify(plan)
    );
}

function normaliserActionPlan(action, index) {

    if (!action.id) {
        action.id = "action_" + Date.now() + "_" + index;
    }

    if (!action.origine && action.theme) {
        action.origine = action.theme;
    }

    if (!action.theme && action.origine) {
        action.theme = action.origine;
    }

    if (!action.statut) {
        action.statut = "À étudier";
    }

    if (!action.efficacite) {
        action.efficacite = "Non évaluée";
    }

    if (!action.commentaire) {
        action.commentaire = "";
    }

    if (!action.responsable) {
        action.responsable = "";
    }

    if (!action.budget) {
        action.budget = action.cout || "";
    }

    if (!action.echeance) {
        action.echeance = action.delai || "";
    }

    return action;
}

function filtrerPlanTransition(theme) {
    filtrePlanActif = theme;
    afficherPlanTransition();
}

function afficherPlanTransition() {

    const zone =
        document.getElementById("listePlanTransition");

    const zoneSynthese =
        document.getElementById("synthesePlanTransition");

    if (!zone) return;

    let plan =
        lirePlanTransition();

    plan =
        plan.map((action, index) =>
            normaliserActionPlan(action, index)
        );

    sauvegarderPlanTransition(plan);

    const planFiltre =
        filtrePlanActif === "Tous"
            ? plan
            : plan.filter(a =>
                (a.origine || a.theme) === filtrePlanActif
            );

    const nbEtudier =
        plan.filter(a => a.statut === "À étudier").length;

    const nbEnCours =
        plan.filter(a => a.statut === "En cours").length;

    const nbRealisees =
        plan.filter(a => a.statut === "Réalisée").length;

    let budgetTotal = 0;

    plan.forEach(action => {
        const montant =
            parseFloat(
                String(action.budget || "0")
                    .replace(/[^\d.,]/g, "")
                    .replace(",", ".")
            );

        if (!isNaN(montant)) {
            budgetTotal += montant;
        }
    });

    if (zoneSynthese) {
        zoneSynthese.innerHTML = `
            <div class="row mb-3">

                <div class="col-md-3">
                    <div class="card text-center border-0 bg-light">
                        <div class="card-body">
                            <h3>${plan.length}</h3>
                            <small>Actions</small>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card text-center border-0 bg-light">
                        <div class="card-body">
                            <h3>${nbEtudier}</h3>
                            <small>À étudier</small>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card text-center border-0 bg-light">
                        <div class="card-body">
                            <h3>${nbEnCours}</h3>
                            <small>En cours</small>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card text-center border-0 bg-light">
                        <div class="card-body">
                            <h3>${nbRealisees}</h3>
                            <small>Réalisées</small>
                        </div>
                    </div>
                </div>

            </div>

            <div class="alert alert-success mb-0">
                <strong>Budget total estimatif :</strong>
                ${budgetTotal.toLocaleString("fr-FR")} €
            </div>
        `;
    }

    if (plan.length === 0) {
        zone.innerHTML = `
            <div class="alert alert-info">
                Aucune action n’a encore été ajoutée au plan.
            </div>
        `;
        return;
    }

    if (planFiltre.length === 0) {
        zone.innerHTML = `
            <div class="alert alert-warning">
                Aucune action pour ce filtre.
            </div>
        `;
        return;
    }

    zone.innerHTML = `
        <div class="table-responsive">

            <table class="table table-sm align-middle">

                <thead>
                    <tr>
                        <th>Origine</th>
                        <th>Priorité</th>
                        <th>Action</th>
                        <th>Responsable</th>
                        <th>Budget</th>
                        <th>Échéance</th>
                        <th>Efficacité</th>
                        <th>Commentaires</th>
                        <th>Statut</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    ${planFiltre.map(action => `
                        <tr>
                            <td>${action.origine || action.theme || "-"}</td>

                            <td>${action.priorite || "-"}</td>

                            <td>
                                <strong>${action.titre || "-"}</strong><br>
                                <small>${action.description || ""}</small>
                            </td>

                            <td>${action.responsable || "-"}</td>

                            <td>${action.budget || action.cout || "-"}</td>

                            <td>${action.echeance || action.delai || "-"}</td>

                            <td>
                                <select
                                    class="form-select form-select-sm"
                                    onchange="modifierEfficacite('${action.id}', this.value)"
                                >
                                    <option ${action.efficacite === "Non évaluée" ? "selected" : ""}>Non évaluée</option>
                                    <option ${action.efficacite === "Faible" ? "selected" : ""}>Faible</option>
                                    <option ${action.efficacite === "Moyenne" ? "selected" : ""}>Moyenne</option>
                                    <option ${action.efficacite === "Élevée" ? "selected" : ""}>Élevée</option>
                                </select>
                            </td>

                            <td>
                                <textarea
                                    class="form-control form-control-sm"
                                    onchange="modifierCommentaire('${action.id}', this.value)"
                                >${action.commentaire || ""}</textarea>
                            </td>

                            <td>
                                <select
                                    class="form-select form-select-sm"
                                    onchange="modifierStatutAction('${action.id}', this.value)"
                                >
                                    <option ${action.statut === "À étudier" ? "selected" : ""}>À étudier</option>
                                    <option ${action.statut === "En cours" ? "selected" : ""}>En cours</option>
                                    <option ${action.statut === "Réalisée" ? "selected" : ""}>Réalisée</option>
                                    <option ${action.statut === "Abandonnée" ? "selected" : ""}>Abandonnée</option>
                                </select>
                            </td>

                            <td>
                                <button
                                    class="btn btn-outline-danger btn-sm"
                                    onclick="supprimerActionPlan('${action.id}')"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>

            </table>
        </div>
    `;
}

function modifierStatutAction(id, statut) {
    const plan = lirePlanTransition();

    const action =
        plan.find(a => String(a.id) === String(id));

    if (action) {
        action.statut = statut;
        sauvegarderPlanTransition(plan);
        afficherPlanTransition();
    }
}

function modifierEfficacite(id, efficacite) {
    const plan = lirePlanTransition();

    const action =
        plan.find(a => String(a.id) === String(id));

    if (action) {
        action.efficacite = efficacite;
        sauvegarderPlanTransition(plan);
        afficherPlanTransition();
    }
}

function modifierCommentaire(id, commentaire) {
    const plan = lirePlanTransition();

    const action =
        plan.find(a => String(a.id) === String(id));

    if (action) {
        action.commentaire = commentaire;
        sauvegarderPlanTransition(plan);
    }
}

function supprimerActionPlan(id) {
    let plan = lirePlanTransition();

    plan =
        plan.filter(a => String(a.id) !== String(id));

    sauvegarderPlanTransition(plan);
    afficherPlanTransition();
}

function ajouterActionPersonnalisee() {

    const titre =
        document.getElementById("actionTitre").value.trim();

    if (!titre) {
        alert("Veuillez saisir un titre d’action.");
        return;
    }

    const origine =
        document.getElementById("actionOrigine").value;

    const action = {
        id: "user_" + Date.now(),
        origine: origine,
        theme: origine,
        type: "Utilisateur",
        priorite: document.getElementById("actionPriorite").value,
        titre: titre,
        description: document.getElementById("actionDescription").value,
        responsable: document.getElementById("actionResponsable").value,
        budget: document.getElementById("actionBudget").value,
        echeance: document.getElementById("actionEcheance").value,
        statut: "À étudier",
        efficacite: "Non évaluée",
        commentaire: ""
    };

    let plan =
        lirePlanTransition();

    plan.push(action);

    sauvegarderPlanTransition(plan);
    afficherPlanTransition();

    document.getElementById("actionTitre").value = "";
    document.getElementById("actionDescription").value = "";
    document.getElementById("actionResponsable").value = "";
    document.getElementById("actionBudget").value = "";
    document.getElementById("actionEcheance").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
    afficherPlanTransition();
});

window.filtrerPlanTransition = filtrerPlanTransition;
window.afficherPlanTransition = afficherPlanTransition;
window.modifierStatutAction = modifierStatutAction;
window.modifierEfficacite = modifierEfficacite;
window.modifierCommentaire = modifierCommentaire;
window.supprimerActionPlan = supprimerActionPlan;
window.ajouterActionPersonnalisee = ajouterActionPersonnalisee;