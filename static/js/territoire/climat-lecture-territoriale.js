function genererLectureTerritoriale(data) {

    const facteurs =
        window.identifierFacteursDiagnostic
            ? identifierFacteursDiagnostic(data)
            : [];

    const commune =
        data.commune || "La commune";

    let texte = `${commune} présente plusieurs enjeux climatiques identifiés à partir des données publiques analysées. `;

    if (facteurs.some(f => f.includes("argiles"))) {
        texte +=
            "Le retrait-gonflement des argiles constitue un facteur de vigilance pour les bâtiments et infrastructures. ";
    }

    if (facteurs.some(f => f.includes("inondation"))) {
        texte +=
            "Le risque d'inondation doit être pris en compte dans les projets d'aménagement et de gestion des eaux pluviales. ";
    }

    if (facteurs.some(f => f.includes("population"))) {
        texte +=
            "La densité de population augmente les enjeux exposés aux aléas climatiques. ";
    }

    return texte;
}

window.genererLectureTerritoriale =
    genererLectureTerritoriale;