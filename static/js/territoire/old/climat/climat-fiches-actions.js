function afficherFicheAction(index) {

    const action = planActions[index];

    if (!action) return;

    const zone =
        document.getElementById("ficheActionAdaptation");

    if (!zone) return;

    zone.innerHTML = `
        <div class="card shadow-sm border-0 mt-4 mb-4">
            <div class="card-body">

                <h4 class="text-primary">
                    Fiche action détaillée
                </h4>

                <h5 class="mt-3">
                    ${action.action}
                </h5>

                <p>
                    <strong>Risque concerné :</strong>
                    ${action.risque}
                </p>

                <p>
                    <strong>Objectif :</strong>
                    réduire la vulnérabilité du territoire face au risque
                    identifié et renforcer sa capacité d’adaptation.
                </p>

                <p>
                    <strong>Acteur pilote :</strong>
                    ${action.public}
                </p>

                <p>
                    <strong>Délai :</strong>
                    ${action.delai}
                </p>

                <p>
                    <strong>Coût estimatif :</strong>
                    ${action.cout}
                </p>

                <p>
                    <strong>Indicateur de suivi :</strong>
                    ${action.indicateur}
                </p>

                <h6 class="mt-4">
                    Étapes possibles
                </h6>

                <ol>
                    <li>Identifier les secteurs concernés.</li>
                    <li>Prioriser les sites les plus vulnérables.</li>
                    <li>Définir un budget et un calendrier.</li>
                    <li>Mobiliser les partenaires techniques.</li>
                    <li>Suivre l’indicateur dans le temps.</li>
                </ol>

            </div>
        </div>
    `;
}

window.afficherFicheAction = afficherFicheAction;