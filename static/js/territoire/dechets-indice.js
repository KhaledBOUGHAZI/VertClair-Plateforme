function calculerIndiceEconomieCirculaire(donnees) {

    const nbDecheteries = donnees.decheteries?.length || 0;
    const nbCollecte = donnees.collecte?.length || 0;
    const nbReparation = donnees.reparation?.length || 0;
    const nbReemploi = donnees.reemploi?.length || 0;
    const nbPartage = donnees.partage?.length || 0;
    const nbAchatRevente = donnees.achatRevente?.length || 0;

    const categoriesPresentes = [
        nbCollecte,
        nbReparation,
        nbReemploi,
        nbPartage,
        nbAchatRevente
    ].filter(n => n > 0).length;

    const nbReparationReemploi =
        nbReparation + nbReemploi;

    const accessibilite =
        (nbDecheteries > 0 ? 10 : 0) +
        (nbCollecte > 0 ? 15 : 0);

    const diversite =
        categoriesPresentes * 5;

    let reparationReemploi = 0;

    if (nbReparationReemploi >= 5) {
        reparationReemploi = 25;
    } else if (nbReparationReemploi >= 3) {
        reparationReemploi = 15;
    } else if (nbReparationReemploi >= 1) {
        reparationReemploi = 10;
    }

    const economieLocale =
        Math.min(categoriesPresentes * 6, 25);

    const total =
        accessibilite +
        diversite +
        reparationReemploi +
        economieLocale;

    let niveau = {
        niveau: "Faible",
        couleur: "#dc2626"
    };

    if (total >= 70) {
        niveau = {
            niveau: "Bon",
            couleur: "#16a34a"
        };
    } else if (total >= 40) {
        niveau = {
            niveau: "Moyen",
            couleur: "#facc15"
        };
    }

    return {
        total,
        niveau,
        details: {
            accessibilite: {
                donnee: `${nbDecheteries} déchèterie(s), ${nbCollecte} service(s) de collecte`,
                points: accessibilite,
                maximum: 25,
                regle: "Déchèterie présente = 10 pts ; collecte présente = 15 pts"
            },
            diversite: {
                donnee: `${categoriesPresentes} catégorie(s) présente(s)`,
                points: diversite,
                maximum: 25,
                regle: "5 points par catégorie présente"
            },
            reparationReemploi: {
                donnee: `${nbReparationReemploi} acteur(s) réparation / réemploi`,
                points: reparationReemploi,
                maximum: 25,
                regle: "1-2 acteurs = 10 pts ; 3-4 = 15 pts ; ≥5 = 25 pts"
            },
            economieLocale: {
                donnee: `${categoriesPresentes} catégorie(s) couvertes`,
                points: economieLocale,
                maximum: 25,
                regle: "6 points par catégorie couverte, max 25 pts"
            }
        }
    };
}

window.calculerIndiceEconomieCirculaire =
    calculerIndiceEconomieCirculaire;