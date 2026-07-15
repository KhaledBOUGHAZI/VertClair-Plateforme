function genererActionsPrioritaires(data) {

    const facteurs =
        window.identifierFacteursDiagnostic
            ? identifierFacteursDiagnostic(data)
            : [];

    const climat =
        data.climat_officiel?.indicateurs || {};

    let actions = [];

    if (facteurs.some(f => f.toLowerCase().includes("argiles"))) {
        actions.push({
            priorite: "Élevée",
            action: "Intégrer le retrait-gonflement des argiles dans les projets de construction, rénovation et voirie."
        });
    }

    if (facteurs.some(f => f.toLowerCase().includes("inondation"))) {
        actions.push({
            priorite: "Élevée",
            action: "Renforcer la gestion des eaux pluviales et limiter l’urbanisation dans les secteurs exposés."
        });
    }

    if (facteurs.some(f => f.toLowerCase().includes("densité"))) {
        actions.push({
            priorite: "Moyenne",
            action: "Prioriser les actions d’adaptation dans les secteurs densément peuplés et autour des équipements publics."
        });
    }

    const ref =
        climat.reference || {};

    const horizon2100 =
        climat["2100"] || {};

    if (
        horizon2100.jours_30 &&
        ref.jours_30 !== undefined &&
        horizon2100.jours_30 > ref.jours_30 + 5
    ) {
        actions.push({
            priorite: "Élevée",
            action: "Créer des îlots de fraîcheur, végétaliser les espaces publics et adapter les bâtiments aux fortes chaleurs."
        });
    }

    if (
        horizon2100.nuits_tropicales &&
        ref.nuits_tropicales !== undefined &&
        horizon2100.nuits_tropicales > ref.nuits_tropicales + 5
    ) {
        actions.push({
            priorite: "Moyenne",
            action: "Identifier les bâtiments accueillant des publics sensibles et renforcer le confort d’été sans recours systématique à la climatisation."
        });
    }

    if (
        horizon2100.sol_sec &&
        ref.sol_sec !== undefined &&
        horizon2100.sol_sec > ref.sol_sec + 20
    ) {
        actions.push({
            priorite: "Élevée",
            action: "Renforcer la sobriété hydrique, préserver les sols vivants et favoriser l’infiltration des eaux pluviales."
        });
    }

    if (
        horizon2100.pluies_extremes &&
        ref.pluies_extremes !== undefined &&
        horizon2100.pluies_extremes > ref.pluies_extremes + 5
    ) {
        actions.push({
            priorite: "Moyenne",
            action: "Adapter les réseaux d’eaux pluviales et désimperméabiliser les surfaces exposées aux pluies intenses."
        });
    }

    if (actions.length === 0) {
        actions.push({
            priorite: "Prévention",
            action: "Maintenir une veille sur les risques territoriaux et intégrer l’adaptation dans les documents de planification."
        });
    }

    return actions;
}

window.genererActionsPrioritaires =
    genererActionsPrioritaires;