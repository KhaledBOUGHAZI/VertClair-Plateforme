const bibliothequeActionsSols = [
    {
        categorie: "🏭 Friches industrielles",
        titre: "Réhabiliter une friche industrielle",
        source: "ADEME / CEREMA / BRGM",
        pourquoi: "Réutiliser un terrain déjà artificialisé afin de limiter l’étalement urbain.",
        benefices: [
            "Réduit la consommation d’espaces naturels",
            "Valorise le foncier existant",
            "Améliore le cadre de vie"
        ],
        comment: [
            "Identifier les friches prioritaires",
            "Réaliser un diagnostic sols et pollution",
            "Définir un nouvel usage compatible",
            "Mobiliser les financements disponibles"
        ],
        exemples: [
            "Friche reconvertie en parc urbain",
            "Ancienne usine transformée en zone d’activités"
        ],
        impact: "Très élevé",
        cout: "€€€",
        delai: "Long terme",
        financements: ["Fonds Vert", "ADEME", "Région", "Banque des Territoires"]
    },
    {
        categorie: "☣️ Pollutions des sols",
        titre: "Réaliser un diagnostic de pollution des sols",
        source: "BRGM / Géorisques / InfoSols",
        pourquoi: "Sécuriser les projets d’aménagement situés sur ou à proximité d’anciens sites industriels.",
        benefices: [
            "Réduit les risques sanitaires",
            "Sécurise les opérations foncières",
            "Anticipe les coûts de gestion"
        ],
        comment: [
            "Identifier les sites SSP, SIS ou CASIAS",
            "Missionner un bureau d’études spécialisé",
            "Analyser les sols et les eaux souterraines",
            "Adapter le projet aux résultats"
        ],
        exemples: [
            "Étude préalable avant permis d’aménager",
            "Diagnostic avant acquisition foncière"
        ],
        impact: "Élevé",
        cout: "€€",
        delai: "Court terme",
        financements: ["Maître d’ouvrage", "Fonds friches", "Région"]
    },
    {
        categorie: "🏘️ Urbanisme durable",
        titre: "Intégrer les SIS et SSP dans le PLU ou PLUi",
        source: "BRGM / Géorisques / CEREMA",
        pourquoi: "Prendre en compte les contraintes de sols dans les documents d’urbanisme.",
        benefices: [
            "Améliore la sécurité des projets",
            "Informe les aménageurs",
            "Limite les erreurs d’usage du foncier"
        ],
        comment: [
            "Cartographier les sites concernés",
            "Informer les services urbanisme",
            "Ajouter les contraintes aux documents de planification",
            "Prévoir des prescriptions adaptées"
        ],
        exemples: [
            "Annexe environnementale au PLU",
            "Cartographie des secteurs à vigilance"
        ],
        impact: "Élevé",
        cout: "€",
        delai: "Moyen terme",
        financements: ["Collectivité", "EPF", "Région"]
    },
    {
        categorie: "💧 Désimperméabilisation",
        titre: "Désimperméabiliser les parkings",
        source: "CEREMA / Agence de l’eau",
        pourquoi: "Restaurer les fonctions du sol et réduire les surfaces imperméables.",
        benefices: [
            "Favorise l’infiltration",
            "Réduit les îlots de chaleur",
            "Améliore la biodiversité locale"
        ],
        comment: [
            "Identifier les surfaces minérales inutiles",
            "Remplacer les enrobés par des matériaux perméables",
            "Ajouter des plantations",
            "Suivre les surfaces désimperméabilisées"
        ],
        exemples: [
            "Parking végétalisé",
            "Stationnement perméable"
        ],
        impact: "Élevé",
        cout: "€€",
        delai: "Moyen terme",
        financements: ["Agence de l’eau", "Fonds Vert", "Région"]
    },
    {
        categorie: "🌿 Renaturation",
        titre: "Renaturer une friche inutilisable",
        source: "CEREMA / OFB / ADEME",
        pourquoi: "Transformer un espace dégradé en espace naturel utile au territoire.",
        benefices: [
            "Renforce la biodiversité",
            "Crée des îlots de fraîcheur",
            "Améliore le cadre de vie"
        ],
        comment: [
            "Vérifier la compatibilité sanitaire",
            "Décompacter les sols",
            "Planter des espèces adaptées",
            "Créer des continuités écologiques"
        ],
        exemples: [
            "Friche transformée en prairie urbaine",
            "Ancien terrain artificialisé renaturé"
        ],
        impact: "Élevé",
        cout: "€€",
        delai: "Moyen terme",
        financements: ["Fonds Vert", "OFB", "Région"]
    },
    {
        categorie: "🌾 Agriculture et qualité des sols",
        titre: "Préserver les terres agricoles",
        source: "Ministère de l’Agriculture / CEREMA",
        pourquoi: "Limiter la consommation foncière et conserver les capacités de production locale.",
        benefices: [
            "Soutient l’agriculture locale",
            "Limite l’artificialisation",
            "Préserve les sols vivants"
        ],
        comment: [
            "Identifier les terres à protéger",
            "Inscrire la protection dans le PLU",
            "Réutiliser les friches avant toute extension",
            "Mettre en place une veille foncière"
        ],
        exemples: [
            "Zone agricole protégée",
            "Périmètre de protection des espaces agricoles"
        ],
        impact: "Très élevé",
        cout: "€",
        delai: "Long terme",
        financements: ["Collectivité", "Région", "FEADER"]
    },
    {
        categorie: "♻️ Recyclage du foncier",
        titre: "Réutiliser les terrains déjà artificialisés",
        source: "CEREMA / ADEME",
        pourquoi: "Répondre aux besoins d’aménagement sans consommer de nouveaux espaces naturels ou agricoles.",
        benefices: [
            "Contribue au ZAN",
            "Valorise les espaces existants",
            "Réduit les coûts d’extension urbaine"
        ],
        comment: [
            "Repérer les terrains vacants",
            "Prioriser les friches et dents creuses",
            "Évaluer les contraintes techniques",
            "Orienter les projets vers ces secteurs"
        ],
        exemples: [
            "Densification douce",
            "Reconversion d’une zone d’activités"
        ],
        impact: "Très élevé",
        cout: "€€",
        delai: "Moyen terme",
        financements: ["Fonds Vert", "EPF", "Banque des Territoires"]
    },
    {
        categorie: "📋 Gouvernance",
        titre: "Créer un observatoire local du foncier",
        source: "CEREMA / Collectivités",
        pourquoi: "Suivre les friches, les terrains vacants, les sites pollués et la consommation foncière.",
        benefices: [
            "Améliore la décision publique",
            "Facilite le suivi du ZAN",
            "Priorise les actions foncières"
        ],
        comment: [
            "Construire une base locale",
            "Mettre à jour les données chaque année",
            "Croiser SSP, CASIAS, friches et artificialisation",
            "Partager les résultats avec les élus"
        ],
        exemples: [
            "Tableau de bord foncier",
            "Carte communale des sites à enjeux"
        ],
        impact: "Élevé",
        cout: "€",
        delai: "Court terme",
        financements: ["Collectivité", "Région", "CEREMA"]
    },
    {
        categorie: "☣️ Pollutions des sols",
        titre: "Gérer les terres excavées",
        source: "BRGM / Ministère de la Transition écologique",
        pourquoi: "Éviter les transferts de pollution lors des travaux d’aménagement.",
        benefices: [
            "Réduit les risques environnementaux",
            "Sécurise les chantiers",
            "Favorise la traçabilité des terres"
        ],
        comment: [
            "Caractériser les terres avant travaux",
            "Identifier les filières adaptées",
            "Limiter les déplacements inutiles",
            "Conserver les preuves de traçabilité"
        ],
        exemples: [
            "Plan de gestion des terres",
            "Réemploi contrôlé sur site"
        ],
        impact: "Élevé",
        cout: "€€",
        delai: "Court terme",
        financements: ["Maître d’ouvrage", "Fonds friches"]
    },
    {
        categorie: "🌿 Renaturation",
        titre: "Restaurer les sols compactés",
        source: "ADEME / OFB / CEREMA",
        pourquoi: "Redonner aux sols leurs fonctions écologiques : infiltration, biodiversité, stockage du carbone.",
        benefices: [
            "Améliore l’infiltration",
            "Favorise la vie du sol",
            "Réduit les îlots de chaleur"
        ],
        comment: [
            "Identifier les sols tassés",
            "Décompacter mécaniquement si nécessaire",
            "Apporter de la matière organique",
            "Végétaliser durablement"
        ],
        exemples: [
            "Ancienne cour minérale renaturée",
            "Sol urbain restauré avant plantation"
        ],
        impact: "Moyen à élevé",
        cout: "€€",
        delai: "Moyen terme",
        financements: ["Agence de l’eau", "Fonds Vert", "Région"]
    }
];