function afficherFicheCouche(nomCouche) {

    const zone =
        document.getElementById("ficheCoucheActive");

    if (!zone) return;

    const fiches = {

        cavites: {
            titre: "🕳️ Cavités souterraines",
            description:
                "Cette couche recense les cavités naturelles ou artificielles connues : anciennes carrières, marnières, galeries, mines ou cavités naturelles.",
            interpretation: [
                "Un point ou une zone signalée indique une cavité recensée.",
                "Cela ne signifie pas qu’un effondrement est imminent.",
                "Cela indique une vigilance particulière pour l’urbanisme, les travaux et les fondations."
            ],
            consequences: [
                "Risque d’affaissement localisé",
                "Risque d’effondrement ponctuel",
                "Contraintes pour les projets de construction"
            ],
            source: "BRGM / Géorisques"
        },

        argiles: {
            titre: "🧱 Retrait-gonflement des argiles",
            description:
                "Cette couche indique les zones exposées au retrait-gonflement des sols argileux. Les sols peuvent se rétracter en période sèche puis gonfler lors du retour de l’eau.",
            interpretation: [
                "Les couleurs les plus fortes indiquent une exposition plus importante.",
                "Cela concerne surtout les bâtiments, fondations, voiries et réseaux.",
                "Ce n’est pas une prévision annuelle mais une sensibilité du sol."
            ],
            consequences: [
                "Fissures sur les bâtiments",
                "Déformation des voiries",
                "Dommages aux réseaux enterrés",
                "Surcoûts de construction ou de rénovation"
            ],
            source: "BRGM / Géorisques"
        },

        mouvements: {
            titre: "⛰️ Mouvements de terrain",
            description:
                "Cette couche recense les mouvements de terrain connus : glissements, éboulements, effondrements, coulées ou instabilités du sol.",
            interpretation: [
                "Les éléments affichés correspondent à des phénomènes recensés.",
                "La présence d’un aléa invite à vérifier les contraintes locales.",
                "Le risque peut être aggravé par les pluies intenses ou certains travaux."
            ],
            consequences: [
                "Instabilité de talus ou versants",
                "Dégradation d’infrastructures",
                "Contraintes pour l’aménagement",
                "Risque ponctuel pour bâtiments et voiries"
            ],
            source: "BRGM / Géorisques"
        },

        nappes: {
            titre: "💦 Remontées de nappes",
            description:
                "Cette couche représente la sensibilité du territoire aux remontées de nappes phréatiques lors d’épisodes humides.",
            interpretation: [
                "Blanc : sensibilité faible ou non significative.",
                "Orange : sensibilité moyenne, vigilance possible.",
                "Rouge : sensibilité forte, la nappe peut remonter près de la surface.",
                "Rouge ne signifie pas que l’eau est actuellement présente en surface."
            ],
            consequences: [
                "Inondation de caves ou sous-sols",
                "Humidité dans les bâtiments",
                "Saturation des sols",
                "Dégradation possible des réseaux enterrés",
                "Contraintes pour certains aménagements"
            ],
            source: "BRGM"
        },

        ppr: {
            titre: "🌊 PPR inondation",
            description:
                "Cette couche indique les communes ou zones concernées par un Plan de Prévention du Risque Inondation approuvé.",
            interpretation: [
                "Le PPR est un document réglementaire.",
                "Il peut imposer des prescriptions d’urbanisme ou de construction.",
                "Il ne décrit pas une crue en temps réel, mais une exposition réglementaire au risque."
            ],
            consequences: [
                "Contraintes d’urbanisme",
                "Prescriptions constructives",
                "Limitation de certains projets",
                "Priorité pour la gestion des eaux et la prévention"
            ],
            source: "Géorisques / Ministère de la Transition écologique"
        }
    };

    const fiche =
        fiches[nomCouche];

    if (!fiche) {
        zone.innerHTML = "";
        return;
    }

    zone.innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">

                <h5>${fiche.titre}</h5>

                <p>${fiche.description}</p>

                <h6>Comment lire cette couche ?</h6>
                <ul>
                    ${fiche.interpretation.map(item => `
                        <li>${item}</li>
                    `).join("")}
                </ul>

                <h6>Conséquences possibles</h6>
                <ul>
                    ${fiche.consequences.map(item => `
                        <li>${item}</li>
                    `).join("")}
                </ul>

                <p class="text-muted mb-0">
                    Source : ${fiche.source}
                </p>

            </div>
        </div>
    `;
}

window.afficherFicheCouche =
    afficherFicheCouche;