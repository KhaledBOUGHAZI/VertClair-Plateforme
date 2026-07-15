function calculerPrioritesTerritoire(data) {

    let priorites = [];

    const score =
        data.score_vulnerabilite || 50;

    const risques =
        data.risques?.risques || {};

    if (risques.inondation && risques.inondation !== "Faible") {
        priorites.push({
            ordre: 1,
            titre: "🌊 Inondation / ruissellement",
            justification: "Risque hydraulique à intégrer dans l’urbanisme et la gestion des eaux pluviales."
        });
    }

    if (score >= 60) {
        priorites.push({
            ordre: 2,
            titre: "🌡️ Chaleur et confort d’été",
            justification: "Hausse des températures et besoin d’adaptation des espaces publics et bâtiments."
        });
    }

    if (document.getElementById("toggleArgiles")?.checked) {
        priorites.push({
            ordre: 3,
            titre: "🧱 Retrait-gonflement des argiles",
            justification: "Risque à prendre en compte pour les bâtiments et projets de construction."
        });
    }

    if (document.getElementById("toggleRemonteesNappes")?.checked) {
        priorites.push({
            ordre: 4,
            titre: "💧 Remontées de nappes",
            justification: "Vigilance sur les sous-sols, réseaux enterrés et zones basses."
        });
    }

    if (document.getElementById("toggleMouvementsTerrain")?.checked) {
        priorites.push({
            ordre: 5,
            titre: "⛰️ Mouvements de terrain",
            justification: "Surveillance des zones instables, talus, versants et aménagements sensibles."
        });
    }

    if (priorites.length === 0) {
        priorites.push({
            ordre: 1,
            titre: "🌿 Prévention et résilience générale",
            justification: "Aucun risque prioritaire majeur activé, mais des actions préventives restent utiles."
        });
    }

    return priorites;
}

window.calculerPrioritesTerritoire =
    calculerPrioritesTerritoire;