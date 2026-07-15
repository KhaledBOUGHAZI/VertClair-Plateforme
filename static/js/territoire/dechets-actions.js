function genererActionsDechets(data) {

    const decheteries =
        data.decheteries || [];

    const actions = [];

    actions.push({
        id: "dechets_prevention_reduction",
        categorie: "Collectivité",
        priorite: "Élevée",
        titre: "Réduire les déchets à la source",
        description:
            "Mettre en place des actions de prévention, sensibilisation, lutte contre le gaspillage et réduction des emballages."
    });

    actions.push({
        id: "dechets_compostage_partage",
        categorie: "Collectivité / Particulier",
        priorite: "Élevée",
        titre: "Déployer le compostage partagé",
        description:
            "Installer des composteurs collectifs dans les quartiers, écoles, résidences et équipements publics."
    });

    actions.push({
        id: "dechets_reemploi_recyclerie",
        categorie: "Collectivité / Association",
        priorite: "Moyenne",
        titre: "Développer une recyclerie ou un espace de réemploi",
        description:
            "Favoriser la réparation, le don, la revente d’objets et le réemploi local."
    });

    actions.push({
        id: "dechets_entreprise_tri",
        categorie: "Entreprise",
        priorite: "Moyenne",
        titre: "Mettre en place une démarche de tri et réemploi en entreprise",
        description:
            "Réduire les déchets de bureau, organiser les flux de tri et rechercher des filières locales de valorisation."
    });

    if (decheteries.length === 0) {
        actions.push({
            id: "dechets_acces_decheterie",
            categorie: "Collectivité",
            priorite: "Élevée",
            titre: "Améliorer l’accès aux équipements déchets",
            description:
                "Étudier les besoins en déchèterie mobile, points de collecte ou conventionnement avec les territoires voisins."
        });
    }

    return actions;
}

window.genererActionsDechets =
    genererActionsDechets;

    function afficherActionsDechets(actions) {
    document.getElementById("actionsDechets").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>🎯 Actions d’amélioration pour obtenir un meilleur score</h4>

                ${actions.map(a => `
                    <div class="border rounded p-3 mb-3">
                        <strong>${a.titre}</strong>
                        <span class="badge bg-secondary">${a.priorite}</span>

                        <p class="mt-2 mb-2">${a.description}</p>

                        <button
                            class="btn btn-success btn-sm"
                            onclick="ajouterActionDechetsDetailleeAuPlan('${a.id}')"
                        >
                            ➕ Ajouter au plan de transition
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}
function genererActionsDechets(data, resultatIndice) {

    const actions = [];

    const d = resultatIndice.details;

    if (d.reparation.points < 10) {

        actions.push({
            id: "reparation",
            titre: "Développer les ateliers de réparation",
            description:
                "Favoriser les repair cafés, ateliers participatifs et réparateurs locaux.",
            priorite: "Élevée"
        });
    }

    if (d.reemploi.points < 10) {

        actions.push({
            id: "reemploi",
            titre: "Développer le réemploi",
            description:
                "Soutenir les recycleries, ressourceries et structures de don.",
            priorite: "Élevée"
        });
    }

    if (d.partage.points < 5) {

        actions.push({
            id: "partage",
            titre: "Développer le partage d'équipements",
            description:
                "Créer une objetothèque ou des dispositifs de mutualisation.",
            priorite: "Moyenne"
        });
    }

    if (d.achatRevente.points < 5) {

        actions.push({
            id: "achat_revente",
            titre: "Renforcer les circuits de seconde main",
            description:
                "Favoriser les acteurs de l'achat-revente et du dépôt-vente.",
            priorite: "Moyenne"
        });
    }

    return actions;
}
window.afficherActionsDechets =
    afficherActionsDechets;