function calculerAggravationRisques(data) {

    const score =
        data.risques?.score_vulnerabilite ||
        data.score_vulnerabilite ||
        50;

    const risques =
        data.risques?.risques || {};

    let aggravations = [];

    aggravations.push({
        risque: "🌡️ Chaleur",
        actuel: score >= 60 ? "Élevé" : "Moyen",
        horizon2030: score >= 60 ? "Élevé" : "Moyen",
        horizon2050: score >= 60 ? "Très élevé" : "Élevé"
    });

    aggravations.push({
        risque: "💧 Sécheresse",
        actuel: "Moyen",
        horizon2030: "Élevé",
        horizon2050: "Très élevé"
    });

    if (risques.argiles && risques.argiles !== "Faible") {
        aggravations.push({
            risque: "🧱 Retrait-gonflement des argiles",
            actuel: risques.argiles,
            horizon2030: "Élevé",
            horizon2050: "Très élevé"
        });
    }

    if (risques.inondation && risques.inondation !== "Faible") {
        aggravations.push({
            risque: "🌊 Inondation / ruissellement",
            actuel: risques.inondation,
            horizon2030: "Moyen à élevé",
            horizon2050: "Élevé"
        });
    }

    if (document.getElementById("toggleRemonteesNappes")?.checked) {
        aggravations.push({
            risque: "💦 Remontées de nappes",
            actuel: "Présence d’une sensibilité locale",
            horizon2030: "À surveiller",
            horizon2050: "À approfondir localement"
        });
    }

    if (document.getElementById("toggleMouvementsTerrain")?.checked) {
        aggravations.push({
            risque: "⛰️ Mouvements de terrain",
            actuel: "Présence d’aléas recensés",
            horizon2030: "Aggravation possible",
            horizon2050: "Aggravation possible avec pluies extrêmes"
        });
    }

    return aggravations;
}

window.calculerAggravationRisques =
    calculerAggravationRisques;