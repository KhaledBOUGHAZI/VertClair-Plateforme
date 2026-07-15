function genererDiagnosticDechets(data) {

    const decheteries =
        data.decheteries || [];

    const nb =
        decheteries.length;

    let distanceMin = null;

    decheteries.forEach(d => {
        if (d.distance_km !== undefined && d.distance_km !== null) {
            const distance = Number(d.distance_km);

            if (!isNaN(distance)) {
                if (distanceMin === null || distance < distanceMin) {
                    distanceMin = distance;
                }
            }
        }
    });

    let diagnostic = [];

    if (nb === 0) {
        diagnostic.push(
            "Aucune déchèterie n’a été identifiée à proximité immédiate."
        );
    } else {
        diagnostic.push(
            `${nb} déchèterie(s) ont été identifiée(s) autour de la commune.`
        );
    }

    if (distanceMin !== null) {
        if (distanceMin <= 5) {
            diagnostic.push(
                `La déchèterie la plus proche est située à environ ${distanceMin} km : l’accès est favorable.`
            );
        } else if (distanceMin <= 15) {
            diagnostic.push(
                `La déchèterie la plus proche est située à environ ${distanceMin} km : l’accès reste correct mais peut être amélioré.`
            );
        } else {
            diagnostic.push(
                `La déchèterie la plus proche est située à environ ${distanceMin} km : l’accès aux équipements déchets semble limité.`
            );
        }
    }

    diagnostic.push(
        "Les données sur les ressourceries, composteurs collectifs, points de collecte et méthaniseurs restent à raccorder."
    );

    return diagnostic;
}

window.genererDiagnosticDechets =
    genererDiagnosticDechets;