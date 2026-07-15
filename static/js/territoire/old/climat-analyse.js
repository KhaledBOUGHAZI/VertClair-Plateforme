function analyserVulnerabiliteClimatique(data) {

    const score =
        data.risques?.score_vulnerabilite || 50;

    let chaleur = "Faible";

    if (score >= 70) {
        chaleur = "Élevée";
    }
    else if (score >= 40) {
        chaleur = "Moyenne";
    }

    return {
        chaleur: chaleur,
        score: score
    };
}

window.analyserVulnerabiliteClimatique =
    analyserVulnerabiliteClimatique;