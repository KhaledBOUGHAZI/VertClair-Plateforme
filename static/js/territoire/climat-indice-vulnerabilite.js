function calculerIndiceVulnerabilite(data) {

    const scoreAleas =
        window.calculerScoreAleas
            ? window.calculerScoreAleas(data)
            : 0;

    const scoreSensibilite =
        window.calculerScoreSensibilite
            ? window.calculerScoreSensibilite(data)
            : 50;

    const poidsAleas = 0.7;
    const poidsSensibilite = 0.3;

    const indice =
        Math.round(
            (scoreAleas * poidsAleas) +
            (scoreSensibilite * poidsSensibilite)
        );

    return {
        indice: Math.min(indice, 100),
        aleas: scoreAleas,
        sensibilite: scoreSensibilite,
        poidsAleas: poidsAleas,
        poidsSensibilite: poidsSensibilite
    };
}

window.calculerIndiceVulnerabilite =
    calculerIndiceVulnerabilite;