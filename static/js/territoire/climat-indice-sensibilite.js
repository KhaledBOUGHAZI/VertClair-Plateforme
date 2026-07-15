function calculerScoreSensibilite(data) {

    if (
        data.sensibilite &&
        data.sensibilite.score_sensibilite
    ) {
        return data.sensibilite.score_sensibilite;
    }

    return 50;
}

window.calculerScoreSensibilite =
    calculerScoreSensibilite;