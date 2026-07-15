function convertirNiveauEnScore(niveau) {

    if (!niveau) return 0;

    const valeur =
        String(niveau).toLowerCase();

    if (
        valeur.includes("très") ||
        valeur.includes("eleve") ||
        valeur.includes("élev")
    ) {
        return 100;
    }

    if (
        valeur.includes("moyen") ||
        valeur.includes("modéré")
    ) {
        return 60;
    }

    if (
        valeur.includes("faible") ||
        valeur.includes("nul")
    ) {
        return 20;
    }

    return 40;
}

function coucheActive(couche) {
    return map && couche && map.hasLayer(couche);
}

function calculerScoreAleas(data) {

    const risques =
        data.risques?.risques || {};

    let scores = [];

    scores.push(
        convertirNiveauEnScore(risques.inondation)
    );

    scores.push(
        convertirNiveauEnScore(risques.argiles)
    );

    if (coucheActive(coucheMouvementsTerrain)) {
        scores.push(70);
    }

    if (coucheActive(coucheRemonteeNappeSocle)) {
        scores.push(60);
    }

    if (coucheActive(couchePPRInondation)) {
        scores.push(80);
    }

    if (coucheActive(coucheCavites)) {
        scores.push(50);
    }

    if (scores.length === 0) return 0;

    const total =
        scores.reduce((a, b) => a + b, 0);

    return Math.round(total / scores.length);
}

window.calculerScoreAleas = calculerScoreAleas;