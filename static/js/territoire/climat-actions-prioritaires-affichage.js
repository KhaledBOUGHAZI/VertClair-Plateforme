let indexActionsAdaptation = 0;
let actionsAdaptationCourantes = [];

function construirePistesActionsAdaptation(data) {

    const facteurs =
        window.identifierFacteursDiagnostic
            ? identifierFacteursDiagnostic(data)
            : [];

    const climat =
        data.climat_officiel?.indicateurs || {};

    const ref =
        climat.reference || {};

    const futur =
        climat["2100"] || {};

    let actions = [];

    if (facteurs.some(f => f.toLowerCase().includes("argiles"))) {
        actions.push({
            id: "climat_argiles",
            priorite: "Élevée",
            public: "Collectivité / Particulier",
            origine: "Climat",
            titre: "Prendre en compte le retrait-gonflement des argiles",
            justification:
                futur.sol_sec && ref.sol_sec
                    ? `Jours de sol sec : ${ref.sol_sec} → ${futur.sol_sec} jours/an`
                    : "Risque argiles identifié sur le territoire.",
            action:
                "Adapter les projets de construction, rénovation, voirie et urbanisme au risque argiles.",
            source: "BRGM / Géorisques / Cerema"
        });
    }

    if (facteurs.some(f => f.toLowerCase().includes("inondation"))) {
        actions.push({
            id: "climat_inondation_eaux_pluviales",
            priorite: "Élevée",
            public: "Collectivité / Entreprise",
            origine: "Climat",
            titre: "Renforcer la gestion des eaux pluviales",
            justification:
                futur.pluies_extremes && ref.pluies_extremes
                    ? `Pluies extrêmes : ${ref.pluies_extremes} → ${futur.pluies_extremes} mm`
                    : "Risque d’inondation identifié.",
            action:
                "Désimperméabiliser, créer des zones d’infiltration et limiter l’urbanisation exposée.",
            source: "Géorisques / DRIAS / Cerema"
        });
    }

    if (futur.jours_30 && ref.jours_30 !== undefined) {
        actions.push({
            id: "climat_ilots_fraicheur",
            priorite: "Élevée",
            public: "Collectivité",
            origine: "Climat",
            titre: "Créer des îlots de fraîcheur",
            justification:
                `Jours ≥ 30°C : ${ref.jours_30} → ${futur.jours_30} jours/an`,
            action:
                "Végétaliser les places, cours d’école, parkings et espaces publics fortement minéralisés.",
            source: "DRIAS / Météo-France / ADEME"
        });

        actions.push({
            id: "climat_confort_ete_batiments",
            priorite: "Moyenne",
            public: "Entreprise / Collectivité / Particulier",
            origine: "Climat / Bâtiment",
            titre: "Adapter les bâtiments au confort d’été",
            justification:
                `Température moyenne : ${ref.temperature_moyenne} → ${futur.temperature_moyenne} °C`,
            action:
                "Renforcer protections solaires, ventilation naturelle, isolation et matériaux limitant la surchauffe.",
            source: "ADEME / Cerema"
        });
    }

    if (futur.nuits_tropicales && ref.nuits_tropicales !== undefined) {
        actions.push({
            id: "climat_publics_sensibles",
            priorite: "Moyenne",
            public: "Collectivité / Santé / Particulier",
            origine: "Climat / Santé",
            titre: "Protéger les publics sensibles",
            justification:
                `Nuits tropicales : ${ref.nuits_tropicales} → ${futur.nuits_tropicales} nuits/an`,
            action:
                "Identifier écoles, EHPAD, logements vulnérables et organiser des lieux frais accessibles.",
            source: "Météo-France / ADEME"
        });
    }

    if (futur.sol_sec && ref.sol_sec !== undefined) {
        actions.push({
            id: "climat_sols_vivants",
            priorite: "Élevée",
            public: "Collectivité / Particulier / Entreprise",
            origine: "Climat / Eau / Biodiversité",
            titre: "Préserver les sols vivants",
            justification:
                `Jours de sol sec : ${ref.sol_sec} → ${futur.sol_sec} jours/an`,
            action:
                "Limiter l’artificialisation, préserver les arbres, haies, sols perméables et zones humides.",
            source: "DRIAS / OFB / Agences de l’eau"
        });

        actions.push({
            id: "eau_sobriete_hydrique",
            priorite: "Moyenne",
            public: "Entreprise / Collectivité / Particulier",
            origine: "Eau",
            titre: "Mettre en place une stratégie de sobriété hydrique",
            justification:
                `Hausse des jours de sol sec : +${Math.round((futur.sol_sec - ref.sol_sec) * 100) / 100} jours/an`,
            action:
                "Réduire les consommations d’eau, récupérer les eaux pluviales et prioriser les usages essentiels.",
            source: "Agences de l’eau / ADEME"
        });
    }

    actions.push({
        id: "urbanisme_adaptation_documents",
        priorite: "Moyenne",
        public: "Collectivité",
        origine: "Urbanisme",
        titre: "Intégrer l’adaptation dans les documents d’urbanisme",
        justification:
            "Les projections climatiques doivent être traduites dans les choix d’aménagement.",
        action:
            "Intégrer chaleur, eau, sols et risques naturels dans PLU, PCAET, schémas directeurs et projets urbains.",
        source: "Cerema / ADEME / Mission Adaptation"
    });

    return actions;
}

function afficherLotActionsAdaptation() {

    const zoneListe =
        document.getElementById("listeActionsAdaptation");

    const bouton =
        document.getElementById("btnActionsSuivantes");

    if (!zoneListe) return;

    const lot =
        actionsAdaptationCourantes.slice(
            indexActionsAdaptation,
            indexActionsAdaptation + 3
        );

    zoneListe.innerHTML =
        lot.map(a => `
            <div class="card border-0 bg-light p-3 mb-3">

                <div class="d-flex justify-content-between gap-2">
                    <strong>${a.titre}</strong>
                    <span class="badge bg-secondary">
                        ${a.priorite}
                    </span>
                </div>

                <p class="mb-1 mt-2">
                    <strong>Pour qui ?</strong> ${a.public}
                </p>

                <p class="mb-1">
                    <strong>Pourquoi ?</strong> ${a.justification}
                </p>

                <p class="mb-1">
                    <strong>Action proposée :</strong> ${a.action}
                </p>

                <button
                    class="btn btn-success btn-sm mt-2"
                    type="button"
                    onclick="ajouterPisteAdaptationAuPlan('${a.id}')"
                >
                    ➕ Ajouter au plan de transition
                </button>

                <small class="text-muted d-block mt-2">
                    Origine : ${a.origine} —
                    Références : ${a.source}
                </small>

            </div>
        `).join("");

    if (bouton) {
        bouton.style.display =
            actionsAdaptationCourantes.length > 3
                ? "inline-block"
                : "none";
    }
}

function ajouterPisteAdaptationAuPlan(idAction) {

    const action =
        actionsAdaptationCourantes.find(
            a => a.id === idAction
        );

    if (!action) return;

    if (!window.ajouterAuPlanTransition) {
        alert("Le module de plan de transition n'est pas chargé.");
        return;
    }

    ajouterAuPlanTransition({
        id: action.id,
        origine: action.origine,
        organisme: action.source,
        type: "Automatique",
        priorite: action.priorite,
        titre: action.titre,
        description: action.action,
        justification: action.justification,
        public: action.public,
        statut: "À étudier"
    });

    alert("Action ajoutée au plan de transition écologique.");
}

function afficherActionsPrioritaires(data) {

    const zone =
        document.getElementById("actionsPrioritaires");

    if (!zone) return;

    actionsAdaptationCourantes =
        construirePistesActionsAdaptation(data);

    indexActionsAdaptation = 0;

    zone.innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">

                <h4>🎯 Pistes d’actions d’adaptation</h4>

                <p class="text-muted">
                    Ces pistes sont proposées à partir du diagnostic territorial
                    et des projections DRIAS/TRACC. Elles pourront alimenter
                    le module Plans de transition écologique.
                </p>

                <div id="listeActionsAdaptation"></div>

                <button
                    id="btnActionsSuivantes"
                    class="btn btn-outline-success btn-sm"
                    type="button"
                >
                    Voir d’autres pistes d’actions
                </button>

                <small class="text-muted d-block mt-3">
                    Les actions proposées doivent être adaptées au contexte local
                    par l’utilisateur. Des actions personnalisées pourront être
                    ajoutées dans le plan de transition écologique.
                </small>

            </div>
        </div>
    `;

    afficherLotActionsAdaptation();

    const bouton =
        document.getElementById("btnActionsSuivantes");

    if (bouton) {
        bouton.onclick = function () {

            indexActionsAdaptation += 3;

            if (
                indexActionsAdaptation >=
                actionsAdaptationCourantes.length
            ) {
                indexActionsAdaptation = 0;
            }

            afficherLotActionsAdaptation();
        };
    }
}

window.afficherActionsPrioritaires =
    afficherActionsPrioritaires;

window.ajouterPisteAdaptationAuPlan =
    ajouterPisteAdaptationAuPlan;