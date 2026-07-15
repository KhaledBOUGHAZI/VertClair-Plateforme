function genererActions2050(aggravations) {

    let actions2050 = [];

    aggravations.forEach(a => {

        if (a.risque.includes("Chaleur")) {
            actions2050.push("Créer un plan chaleur communal 2030-2050.");
            actions2050.push("Végétaliser les écoles, places publiques et parkings.");
        }

        if (a.risque.includes("Sécheresse")) {
            actions2050.push("Mettre en place une stratégie de sobriété hydrique.");
            actions2050.push("Développer l’infiltration et la récupération des eaux pluviales.");
        }

        if (a.risque.includes("Argiles")) {
            actions2050.push("Identifier les bâtiments exposés au retrait-gonflement des argiles.");
            actions2050.push("Adapter les règles de construction et rénovation.");
        }

        if (a.risque.includes("Inondation")) {
            actions2050.push("Limiter l’urbanisation dans les zones exposées.");
            actions2050.push("Créer des zones d’expansion des crues et de désimperméabilisation.");
        }

        if (a.risque.includes("nappes")) {
            actions2050.push("Cartographier les sous-sols et réseaux sensibles.");
            actions2050.push("Prévoir des dispositifs anti-refoulement.");
        }

        if (a.risque.includes("Mouvements")) {
            actions2050.push("Surveiller les talus, versants et zones instables.");
            actions2050.push("Limiter les terrassements en zones sensibles.");
        }
    });

    return [...new Set(actions2050)];
}

window.genererActions2050 = genererActions2050;