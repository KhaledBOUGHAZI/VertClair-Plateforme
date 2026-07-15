function obtenirReglesAdaptation() {

    return {

        chaleur: [
            "Créer des îlots de fraîcheur",
            "Végétaliser les espaces publics",
            "Adapter les bâtiments aux fortes chaleurs",
            "Développer l'ombrage urbain"
        ],

        secheresse: [
            "Réduire l’imperméabilisation des sols",
            "Favoriser l’infiltration des eaux pluviales",
            "Préserver les sols vivants",
            "Économiser la ressource en eau"
        ],

        inondation: [
            "Créer des zones d’expansion de crue",
            "Désimperméabiliser les espaces publics",
            "Renforcer la gestion des eaux pluviales",
            "Adapter les infrastructures sensibles"
        ],

        argiles: [
            "Identifier les bâtiments sensibles",
            "Surveiller les fissurations",
            "Adapter les fondations",
            "Limiter les variations d’humidité des sols"
        ],

        nappes: [
            "Surveiller les sous-sols exposés",
            "Adapter les réseaux enterrés",
            "Installer des clapets anti-retour",
            "Protéger les infrastructures sensibles"
        ],

        mouvements: [
            "Surveiller les talus",
            "Limiter les terrassements",
            "Contrôler les écoulements",
            "Actualiser les documents d’urbanisme"
        ]
    };
}

window.obtenirReglesAdaptation =
    obtenirReglesAdaptation;