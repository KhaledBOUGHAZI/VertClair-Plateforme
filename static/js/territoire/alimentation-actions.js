let filtreAlimentation = "Toutes";
window.actionsAlimentationCourantes = [];

const bibliothequeActionsAlimentation = [
    {
        categorie: "🌾 Production",
        titre: "Préserver les terres agricoles",
        impact: "Très élevé",
        cout: "€",
        delai: "Long terme",
        pourquoi: "Maintenir une capacité de production alimentaire locale et limiter l'artificialisation des sols.",
        comment: [
            "Protéger les zones agricoles dans le PLU",
            "Limiter l'étalement urbain",
            "Réutiliser les friches avant d'ouvrir de nouveaux terrains",
            "Mettre en place une veille foncière agricole"
        ],
        exemples: ["Zone Agricole Protégée", "Périmètre de protection des espaces agricoles"]
    },
    {
        categorie: "🌾 Production",
        titre: "Accompagner les conversions bio",
        impact: "Élevé",
        cout: "€€",
        delai: "Moyen terme",
        pourquoi: "Augmenter progressivement la part de production agricole durable sur le territoire.",
        comment: [
            "Identifier les exploitants intéressés",
            "Mobiliser les aides existantes",
            "Créer un accompagnement technique avec les chambres d’agriculture"
        ],
        exemples: ["Aides à la conversion bio", "Animation agricole territoriale"]
    },
    {
        categorie: "🌾 Production",
        titre: "Faciliter l'installation de jeunes agriculteurs",
        impact: "Élevé",
        cout: "€€",
        delai: "Long terme",
        pourquoi: "Renouveler les générations agricoles et maintenir une production locale.",
        comment: [
            "Repérer les terres disponibles",
            "Aider à l’accès au foncier",
            "Mettre en relation cédants et porteurs de projet"
        ],
        exemples: ["Espace-test agricole", "Ferme communale"]
    },
    {
        categorie: "🌾 Production",
        titre: "Développer le maraîchage local",
        source: "ADEME / Agence Bio",
        impact: "Élevé",
        cout: "€€",
        delai: "Moyen terme",
        pourquoi: "Renforcer l'approvisionnement local en légumes frais.",
        comment: [
            "Identifier des parcelles adaptées",
            "Faciliter l'accès au foncier",
            "Accompagner les porteurs de projet"
        ],
        exemples: [
            "Ferme maraîchère communale",
            "Maraîchage bio de proximité"
        ]
    },

    {
        categorie: "🌾 Production",
        titre: "Développer l'agriculture urbaine",
        source: "CEREMA",
        impact: "Moyen",
        cout: "€",
        delai: "Court terme",
        pourquoi: "Créer une production alimentaire de proximité et sensibiliser les habitants.",
        comment: [
            "Installer des jardins urbains",
            "Utiliser les friches disponibles",
            "Associer les habitants"
        ],
        exemples: [
            "Potagers urbains",
            "Toitures cultivées"
        ]
    },

    {
        categorie: "🌾 Production",
        titre: "Créer une régie agricole communale",
        source: "ADEME",
        impact: "Élevé",
        cout: "€€€",
        delai: "Long terme",
        pourquoi: "Sécuriser une production locale au service du territoire.",
        comment: [
            "Identifier les besoins alimentaires",
            "Mobiliser du foncier communal",
            "Recruter ou conventionner un exploitant"
        ],
        exemples: [
            "Régie maraîchère municipale"
        ]
    },

    {
        categorie: "🌾 Production",
        titre: "Protéger les captages par l'agriculture durable",
        source: "Agence de l'eau",
        impact: "Très élevé",
        cout: "€€",
        delai: "Long terme",
        pourquoi: "Préserver la qualité de l'eau tout en développant une agriculture durable.",
        comment: [
            "Identifier les zones sensibles",
            "Accompagner les agriculteurs",
            "Mettre en place des contrats territoriaux"
        ],
        exemples: [
            "Aires d'alimentation de captage"
        ]
    },

    {
        categorie: "🌾 Production",
        titre: "Développer les filières agroécologiques",
        source: "ADEME",
        impact: "Élevé",
        cout: "€€",
        delai: "Long terme",
        pourquoi: "Renforcer la résilience alimentaire et environnementale.",
        comment: [
            "Structurer les filières locales",
            "Accompagner les producteurs",
            "Créer des débouchés locaux"
        ],
        exemples: [
            "Filière céréales locales",
            "Filière légumineuses"
        ]
    },
    
    {
        categorie: "🛒 Circuits courts",
        titre: "Créer un marché de producteurs",
        impact: "Élevé",
        cout: "€",
        delai: "Court terme",
        pourquoi: "Faciliter l’accès des habitants aux produits locaux.",
        comment: [
            "Identifier un lieu adapté",
            "Mobiliser les producteurs locaux",
            "Organiser une communication territoriale"
        ],
        exemples: ["Marché hebdomadaire", "Marché saisonnier"]
    },
    {
        categorie: "🛒 Circuits courts",
        titre: "Créer un annuaire local des producteurs",
        impact: "Moyen",
        cout: "€",
        delai: "Court terme",
        pourquoi: "Rendre visibles les producteurs locaux auprès des habitants, entreprises et cantines.",
        comment: [
            "Recenser les producteurs",
            "Classer par produit et mode de vente",
            "Publier l’annuaire en ligne"
        ],
        exemples: ["Carte interactive", "Guide papier communal"]
    },
    {
        categorie: "🛒 Circuits courts",
        titre: "Développer les AMAP",
        impact: "Élevé",
        cout: "€",
        delai: "Moyen terme",
        pourquoi: "Sécuriser les débouchés des producteurs et faciliter l’accès aux produits locaux.",
        comment: [
            "Identifier des producteurs volontaires",
            "Trouver un lieu de distribution",
            "Communiquer auprès des habitants"
        ],
        exemples: ["Paniers hebdomadaires", "Point relais municipal"]
    },
    {
    categorie: "🛒 Circuits courts",
    titre: "Créer un magasin de producteurs",
    source: "PAT / ADEME",
    impact: "Élevé",
    cout: "€€",
    delai: "Moyen terme",
    pourquoi: "Donner un débouché stable aux producteurs locaux et faciliter l’accès des habitants aux produits du territoire.",
    comment: [
        "Identifier un local accessible",
        "Structurer un collectif de producteurs",
        "Définir les règles de gouvernance et de permanence"
    ],
    exemples: [
        "Magasin collectif de producteurs",
        "Boutique de produits locaux"
    ]
},

{
    categorie: "🛒 Circuits courts",
    titre: "Créer une plateforme numérique locale",
    source: "PAT / ADEME",
    impact: "Moyen",
    cout: "€€",
    delai: "Court terme",
    pourquoi: "Faciliter la commande de produits locaux par les habitants, entreprises et restaurants collectifs.",
    comment: [
        "Recenser les producteurs volontaires",
        "Choisir un outil de commande simple",
        "Organiser les retraits ou livraisons"
    ],
    exemples: [
        "Commande en ligne de paniers locaux",
        "Click and collect producteurs"
    ]
},

{
    categorie: "🛒 Circuits courts",
    titre: "Développer des points relais alimentaires",
    source: "PAT / ADEME",
    impact: "Moyen",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Rapprocher les produits locaux des habitants, notamment dans les quartiers ou hameaux moins desservis.",
    comment: [
        "Identifier des lieux relais",
        "Organiser des créneaux de retrait",
        "Coordonner les producteurs participants"
    ],
    exemples: [
        "Point relais en mairie",
        "Point relais dans une école ou maison de quartier"
    ]
},

{
    categorie: "🛒 Circuits courts",
    titre: "Créer une marque alimentaire territoriale",
    source: "PAT / Ministère de l'Agriculture",
    impact: "Moyen",
    cout: "€€",
    delai: "Moyen terme",
    pourquoi: "Valoriser les productions locales et renforcer l’identité alimentaire du territoire.",
    comment: [
        "Définir un cahier des charges",
        "Associer producteurs et commerçants",
        "Communiquer auprès des habitants"
    ],
    exemples: [
        "Label alimentaire local",
        "Marque de territoire"
    ]
},

{
    categorie: "🛒 Circuits courts",
    titre: "Favoriser les ventes à la ferme",
    source: "Agence Bio / PAT",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Développer les débouchés directs pour les producteurs et renforcer le lien habitants-agriculteurs.",
    comment: [
        "Cartographier les ventes à la ferme",
        "Communiquer sur les horaires et produits disponibles",
        "Soutenir la signalétique locale"
    ],
    exemples: [
        "Carte des fermes en vente directe",
        "Portes ouvertes producteurs"
    ]
},

{
    categorie: "🛒 Circuits courts",
    titre: "Développer les paniers locaux",
    source: "PAT / ADEME",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Faciliter l’accès régulier aux produits locaux pour les habitants.",
    comment: [
        "Constituer une offre de paniers",
        "Définir un lieu de retrait",
        "Communiquer auprès des habitants"
    ],
    exemples: [
        "Paniers hebdomadaires",
        "Paniers de saison"
    ]
},

{
    categorie: "🛒 Circuits courts",
    titre: "Organiser des événements producteurs-consommateurs",
    source: "PAT / ADEME",
    impact: "Moyen",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Faire connaître les producteurs et encourager les achats locaux.",
    comment: [
        "Organiser des rencontres ou visites de fermes",
        "Associer écoles, habitants et restaurateurs",
        "Valoriser les produits locaux lors d’événements communaux"
    ],
    exemples: [
        "Fête de l’alimentation locale",
        "Visites de fermes"
    ]
},
    {
        categorie: "🍽️ Restauration",
        titre: "Augmenter les produits bio dans les cantines",
        impact: "Élevé",
        cout: "€€",
        delai: "Moyen terme",
        pourquoi: "Améliorer la qualité alimentaire et soutenir les filières durables.",
        comment: [
            "Analyser les achats actuels",
            "Identifier des fournisseurs locaux",
            "Former les équipes aux menus de saison"
        ],
        exemples: ["Objectif 20 % bio", "Menus locaux hebdomadaires"]
    },
    {
        categorie: "🍽️ Restauration",
        titre: "Développer les achats locaux",
        impact: "Élevé",
        cout: "€",
        delai: "Moyen terme",
        pourquoi: "Renforcer les débouchés locaux et réduire les distances d’approvisionnement.",
        comment: [
            "Adapter les marchés publics",
            "Fractionner les lots",
            "Dialoguer avec les producteurs"
        ],
        exemples: ["Marchés publics alimentaires", "Approvisionnement local des cantines"]
    },
    {
    categorie: "🍽️ Restauration",
    titre: "Introduire des menus de saison",
    source: "ADEME / Ministère de l'Agriculture",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Adapter les repas aux productions disponibles localement et réduire l’impact environnemental des menus.",
    comment: [
        "Identifier les produits de saison disponibles",
        "Adapter les menus avec les équipes de cuisine",
        "Informer les convives sur la saisonnalité"
    ],
    exemples: [
        "Menu de saison mensuel",
        "Affichage pédagogique en cantine"
    ]
},

{
    categorie: "🍽️ Restauration",
    titre: "Réduire le gaspillage en restauration collective",
    source: "ADEME",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Réduire les pertes alimentaires, maîtriser les coûts et améliorer la gestion des repas.",
    comment: [
        "Peser les restes alimentaires",
        "Adapter les portions",
        "Sensibiliser les élèves ou usagers"
    ],
    exemples: [
        "Table de tri en cantine",
        "Challenge anti-gaspillage"
    ]
},

{
    categorie: "🍽️ Restauration",
    titre: "Former les équipes de restauration",
    source: "ADEME / CNFPT",
    impact: "Moyen",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Donner aux équipes les outils pour cuisiner des produits bruts, locaux, bio et de saison.",
    comment: [
        "Identifier les besoins de formation",
        "Former à la cuisine de produits bruts",
        "Former à la lutte contre le gaspillage"
    ],
    exemples: [
        "Formation menus végétariens",
        "Formation cuisine de saison"
    ]
},

{
    categorie: "🍽️ Restauration",
    titre: "Développer les repas végétariens équilibrés",
    source: "ADEME / Ministère de l'Agriculture",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Réduire l’impact environnemental des repas tout en diversifiant les apports alimentaires.",
    comment: [
        "Construire des menus équilibrés",
        "Former les équipes de cuisine",
        "Communiquer auprès des familles ou usagers"
    ],
    exemples: [
        "Menu végétarien hebdomadaire",
        "Recettes à base de légumineuses"
    ]
},

{
    categorie: "🍽️ Restauration",
    titre: "Créer une cuisine centrale durable",
    source: "ADEME / PAT",
    impact: "Très élevé",
    cout: "€€€",
    delai: "Long terme",
    pourquoi: "Structurer l’approvisionnement, la préparation et la distribution de repas durables à l’échelle du territoire.",
    comment: [
        "Étudier les besoins des établissements",
        "Intégrer des objectifs bio, locaux et de saison",
        "Prévoir une logistique adaptée"
    ],
    exemples: [
        "Cuisine centrale intercommunale",
        "Cuisine centrale approvisionnée localement"
    ]
},

{
    categorie: "🍽️ Restauration",
    titre: "Mettre en place des achats alimentaires responsables",
    source: "ADEME / Ministère de l'Agriculture",
    impact: "Élevé",
    cout: "€",
    delai: "Moyen terme",
    pourquoi: "Orienter la commande publique vers des produits plus durables, locaux et de meilleure qualité.",
    comment: [
        "Adapter les critères des marchés publics",
        "Fractionner les lots pour les producteurs locaux",
        "Suivre la part de produits bio et locaux"
    ],
    exemples: [
        "Marchés publics alimentaires durables",
        "Clauses de saisonnalité"
    ]
},
    {
        categorie: "♻️ Gaspillage",
        titre: "Réduire le gaspillage alimentaire",
        impact: "Élevé",
        cout: "€",
        delai: "Court terme",
        pourquoi: "Réduire les pertes alimentaires et les coûts de gestion.",
        comment: [
            "Mesurer les restes alimentaires",
            "Adapter les portions",
            "Sensibiliser les convives"
        ],
        exemples: ["Pesée des déchets", "Challenge anti-gaspillage"]
    },
    {
        categorie: "♻️ Gaspillage",
        titre: "Mettre en place le tri des biodéchets",
        impact: "Élevé",
        cout: "€€",
        delai: "Moyen terme",
        pourquoi: "Valoriser les déchets organiques et réduire les déchets résiduels.",
        comment: [
            "Installer des bacs dédiés",
            "Former les agents",
            "Organiser la collecte ou le compostage"
        ],
        exemples: ["Compostage de cantine", "Collecte séparée biodéchets"]
    },
    {
    categorie: "♻️ Gaspillage",
    titre: "Créer des composteurs collectifs",
    source: "ADEME",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Valoriser localement les biodéchets et réduire les déchets résiduels.",
    comment: [
        "Identifier les sites adaptés",
        "Former les référents compost",
        "Sensibiliser les habitants"
    ],
    exemples: [
        "Composteur de quartier",
        "Composteur partagé en résidence"
    ]
},

{
    categorie: "♻️ Gaspillage",
    titre: "Créer une filière de dons alimentaires",
    source: "ADEME / Loi AGEC",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Réduire les invendus tout en soutenant les publics fragiles.",
    comment: [
        "Mobiliser commerces et producteurs",
        "Associer les structures solidaires",
        "Organiser la logistique"
    ],
    exemples: [
        "Convention avec une banque alimentaire",
        "Collecte des invendus"
    ]
},

{
    categorie: "♻️ Gaspillage",
    titre: "Valoriser les invendus alimentaires",
    source: "ADEME",
    impact: "Moyen",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Réduire les pertes et améliorer la valorisation des produits non vendus.",
    comment: [
        "Identifier les flux d'invendus",
        "Développer des partenariats",
        "Organiser la redistribution"
    ],
    exemples: [
        "Applications anti-gaspillage",
        "Partenariats associatifs"
    ]
},

{
    categorie: "♻️ Gaspillage",
    titre: "Former les commerçants à la lutte contre le gaspillage",
    source: "ADEME",
    impact: "Moyen",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Réduire les pertes alimentaires dans les commerces.",
    comment: [
        "Organiser des formations",
        "Partager les bonnes pratiques",
        "Mettre en place un suivi"
    ],
    exemples: [
        "Formation boulangeries",
        "Formation commerces alimentaires"
    ]
},

{
    categorie: "♻️ Gaspillage",
    titre: "Sensibiliser les habitants au gaspillage alimentaire",
    source: "ADEME",
    impact: "Moyen",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Faire évoluer durablement les comportements de consommation.",
    comment: [
        "Organiser des ateliers",
        "Créer des campagnes de communication",
        "Impliquer les écoles"
    ],
    exemples: [
        "Ateliers cuisine anti-gaspi",
        "Semaine du gaspillage alimentaire"
    ]
},

{
    categorie: "♻️ Gaspillage",
    titre: "Développer le compostage partagé",
    source: "ADEME",
    impact: "Élevé",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Réduire les biodéchets et produire un amendement local.",
    comment: [
        "Installer des équipements",
        "Former des référents",
        "Assurer un suivi régulier"
    ],
    exemples: [
        "Compostage en pied d'immeuble",
        "Compostage de quartier"
    ]
},
    {
        categorie: "🤝 Solidarité",
        titre: "Créer des jardins partagés",
        impact: "Moyen",
        cout: "€",
        delai: "Moyen terme",
        pourquoi: "Favoriser l’accès à une alimentation locale et créer du lien social.",
        comment: [
            "Identifier une parcelle disponible",
            "Créer un collectif d’habitants",
            "Prévoir l’accès à l’eau et aux outils"
        ],
        exemples: ["Jardin partagé communal", "Jardin pédagogique"]
    },
    {
        categorie: "🤝 Solidarité",
        titre: "Développer les paniers solidaires",
        impact: "Élevé",
        cout: "€",
        delai: "Court terme",
        pourquoi: "Améliorer l’accès des ménages modestes à une alimentation de qualité.",
        comment: [
            "Mobiliser les producteurs",
            "Travailler avec le CCAS",
            "Organiser une distribution régulière"
        ],
        exemples: ["Paniers bio solidaires", "Tarification sociale"]
    },
    {
    categorie: "🤝 Solidarité",
    titre: "Créer une épicerie sociale ou solidaire",
    source: "ADEME / Ministère de l'Agriculture",

    impact: "Élevé",

    cout: "€€",

    delai: "Moyen terme",

    pourquoi:
        "Améliorer l'accès des ménages modestes à une alimentation de qualité.",

    comment: [
        "Identifier les publics concernés",
        "Mobiliser le CCAS et les associations",
        "Organiser l'approvisionnement local",
        "Prévoir un modèle économique adapté"
    ],

    exemples: [
        "Épicerie solidaire communale",
        "Épicerie sociale associative"
    ]
},

{
    categorie: "🤝 Solidarité",
    titre: "Développer des ateliers cuisine durable",
    source: "ADEME / PAT",

    impact: "Moyen",

    cout: "€",

    delai: "Court terme",

    pourquoi:
        "Sensibiliser les habitants à une alimentation saine, locale, de saison et peu coûteuse.",

    comment: [
        "Organiser des ateliers pratiques",
        "Associer diététiciens, associations ou producteurs",
        "Valoriser les produits locaux et de saison",
        "Intégrer la lutte contre le gaspillage"
    ],

    exemples: [
        "Atelier cuisine anti-gaspi",
        "Atelier cuisine de saison"
    ]
},

{
    categorie: "🤝 Solidarité",
    titre: "Soutenir les associations d'aide alimentaire",
    source: "Ministère de l'Agriculture / PAT",

    impact: "Élevé",

    cout: "€",

    delai: "Court terme",

    pourquoi:
        "Renforcer l'accès à l'alimentation pour les publics vulnérables.",

    comment: [
        "Identifier les associations actives",
        "Faciliter les locaux ou moyens logistiques",
        "Organiser des partenariats avec producteurs et commerces",
        "Coordonner les actions avec le CCAS"
    ],

    exemples: [
        "Convention avec une association locale",
        "Collecte alimentaire territoriale"
    ]
},

{
    categorie: "🤝 Solidarité",
    titre: "Créer des frigos solidaires",
    source: "ADEME / Loi AGEC",

    impact: "Moyen",

    cout: "€",

    delai: "Court terme",

    pourquoi:
        "Réduire le gaspillage alimentaire tout en facilitant l'accès à des produits disponibles gratuitement.",

    comment: [
        "Identifier des lieux accessibles",
        "Définir les règles d'hygiène",
        "Mobiliser commerces et habitants",
        "Assurer un suivi régulier"
    ],

    exemples: [
        "Frigo solidaire de quartier",
        "Point de redistribution alimentaire"
    ]
},

{
    categorie: "🤝 Solidarité",
    titre: "Mettre en place une tarification sociale dans la restauration collective",
    source: "Ministère de l'Agriculture / Collectivités",

    impact: "Élevé",

    cout: "€€",

    delai: "Moyen terme",

    pourquoi:
        "Garantir l'accès des enfants et usagers à une restauration de qualité, quel que soit le revenu du foyer.",

    comment: [
        "Analyser les tarifs actuels",
        "Définir des tranches selon les revenus",
        "Mobiliser les aides disponibles",
        "Suivre la fréquentation des services"
    ],

    exemples: [
        "Cantine à tarification progressive",
        "Repas à 1 euro selon conditions"
    ]
},
    {
        categorie: "🚚 Logistique",
        titre: "Créer une plateforme logistique locale",
        impact: "Élevé",
        cout: "€€€",
        delai: "Long terme",
        pourquoi: "Mutualiser les flux alimentaires et faciliter l’approvisionnement local.",
        comment: [
            "Identifier les besoins des producteurs",
            "Étudier un lieu de stockage",
            "Organiser la distribution vers les cantines et commerces"
        ],
        exemples: ["Plateforme alimentaire territoriale", "Hub de producteurs"]
    },
    {
        categorie: "🚚 Logistique",
        titre: "Mutualiser les livraisons alimentaires",
        impact: "Moyen",
        cout: "€€",
        delai: "Moyen terme",
        pourquoi: "Réduire les coûts logistiques et les émissions liées au transport.",
        comment: [
            "Regrouper les commandes",
            "Organiser des tournées communes",
            "Tester une logistique partagée"
        ],
        exemples: ["Tournée producteurs", "Livraison mutualisée cantines"]
    },
    {
    categorie: "🚚 Logistique",
    titre: "Créer un hub alimentaire territorial",
    source: "PAT / ADEME / CEREMA",
    impact: "Élevé",
    cout: "€€€",
    delai: "Long terme",
    pourquoi: "Structurer un lieu de regroupement, stockage et redistribution des produits alimentaires locaux.",
    comment: [
        "Identifier les producteurs et acheteurs intéressés",
        "Étudier les besoins en stockage froid et sec",
        "Choisir un site accessible",
        "Définir un modèle économique partagé"
    ],
    exemples: [
        "Hub alimentaire intercommunal",
        "Espace de regroupement producteurs-cantines"
    ]
},

{
    categorie: "🚚 Logistique",
    titre: "Structurer la distribution locale",
    source: "PAT / ADEME",
    impact: "Élevé",
    cout: "€€",
    delai: "Moyen terme",
    pourquoi: "Faciliter l’acheminement des produits locaux vers les cantines, commerces et habitants.",
    comment: [
        "Identifier les flux alimentaires existants",
        "Regrouper les commandes",
        "Définir des tournées régulières",
        "Associer producteurs, collectivités et distributeurs"
    ],
    exemples: [
        "Tournées vers les cantines",
        "Distribution groupée de paniers locaux"
    ]
},

{
    categorie: "🚚 Logistique",
    titre: "Optimiser les flux alimentaires",
    source: "ADEME / CEREMA",
    impact: "Moyen",
    cout: "€",
    delai: "Court terme",
    pourquoi: "Réduire les trajets inutiles, les coûts logistiques et les émissions associées.",
    comment: [
        "Cartographier les trajets actuels",
        "Identifier les doublons de livraison",
        "Mutualiser certains transports",
        "Suivre les kilomètres évités"
    ],
    exemples: [
        "Optimisation des tournées",
        "Livraisons groupées"
    ]
},

{
    categorie: "🚚 Logistique",
    titre: "Développer la logistique alimentaire bas carbone",
    source: "ADEME / CEREMA",
    impact: "Élevé",
    cout: "€€",
    delai: "Moyen terme",
    pourquoi: "Réduire l’impact climatique du transport alimentaire local.",
    comment: [
        "Favoriser les véhicules faibles émissions",
        "Développer les livraisons groupées",
        "Tester la cyclologistique en centre-ville",
        "Réduire les trajets à vide"
    ],
    exemples: [
        "Livraison en vélo-cargo",
        "Véhicule utilitaire électrique partagé"
    ]
},
    {
        categorie: "📚 Gouvernance",
        titre: "Lancer un Projet Alimentaire Territorial",
        impact: "Très élevé",
        cout: "€€",
        delai: "Long terme",
        pourquoi: "Structurer une stratégie alimentaire locale avec les acteurs du territoire.",
        comment: [
            "Réaliser un diagnostic alimentaire",
            "Animer une concertation locale",
            "Définir un plan d’actions pluriannuel"
        ],
        exemples: ["PAT communal", "PAT intercommunal"]
    },
    {
        categorie: "📚 Gouvernance",
        titre: "Créer un observatoire alimentaire",
        impact: "Moyen",
        cout: "€",
        delai: "Moyen terme",
        pourquoi: "Suivre l’évolution de l’alimentation durable sur le territoire.",
        comment: [
            "Définir des indicateurs",
            "Mettre à jour les données chaque année",
            "Partager les résultats avec les élus et acteurs locaux"
        ],
        exemples: ["Tableau de bord alimentaire", "Suivi annuel PAT"]
    },
    {
    categorie: "📚 Gouvernance",
    titre: "Mettre en place des indicateurs de suivi alimentaire",
    source: "PAT / ADEME",

    impact: "Élevé",

    cout: "€",

    delai: "Court terme",

    pourquoi:
        "Suivre l'évolution de l'alimentation durable et mesurer l'efficacité des actions engagées.",

    comment: [
        "Définir des indicateurs simples",
        "Collecter les données chaque année",
        "Partager les résultats aux élus",
        "Publier un bilan annuel"
    ],

    exemples: [
        "Part de produits bio",
        "Nombre de producteurs locaux",
        "Part d'achats locaux"
    ]
},

{
    categorie: "📚 Gouvernance",
    titre: "Animer un réseau local des acteurs alimentaires",
    source: "PAT / Ministère Agriculture",

    impact: "Élevé",

    cout: "€",

    delai: "Court terme",

    pourquoi:
        "Créer une dynamique collective entre producteurs, collectivités, entreprises et habitants.",

    comment: [
        "Organiser des rencontres régulières",
        "Créer un annuaire des acteurs",
        "Partager les projets et besoins",
        "Identifier des actions communes"
    ],

    exemples: [
        "Club alimentation durable",
        "Rencontres territoriales"
    ]
},

{
    categorie: "📚 Gouvernance",
    titre: "Intégrer l'alimentation au PCAET et au plan de transition",
    source: "ADEME / CEREMA",

    impact: "Très élevé",

    cout: "€",

    delai: "Moyen terme",

    pourquoi:
        "Faire de l'alimentation un axe stratégique de la transition écologique du territoire.",

    comment: [
        "Inscrire des objectifs alimentaires",
        "Définir des indicateurs",
        "Coordonner les services concernés",
        "Suivre les résultats dans le temps"
    ],

    exemples: [
        "Volet alimentation du PCAET",
        "Feuille de route alimentaire"
    ]
}
];

function ajouterActionAlimentationPlan(action) {
    let plan = JSON.parse(
        localStorage.getItem("planTransition") || "[]"
    );

    const existe = plan.some(a =>
        a.theme === "Alimentation durable" &&
        a.titre === action.titre
    );

    if (existe) {
        alert("Cette action est déjà dans le plan de transition.");
        return;
    }

    plan.push({
    id: "alim_" + Date.now(),

    theme: "Alimentation durable",
    origine: "Alimentation durable",

    titre: action.titre,

    description:
        action.description ||
        action.pourquoi ||
        "",

    priorite:
        action.priorite ||
        "Moyenne",

    cout:
        action.cout || "",

    budget:
        action.cout || "",

    delai:
        action.delai || "",

    echeance:
        action.delai || "",

    statut: "À étudier",

    efficacite: "Non évaluée",

    commentaire: ""
});

    localStorage.setItem(
        "planTransition",
        JSON.stringify(plan)
    );

    alert("Action ajoutée au plan de transition.");
}

function filtrerActionsAlimentation(categorie) {
    filtreAlimentation = categorie;

    afficherActionsAlimentation(
        window.actionsAlimentationCourantes || []
    );
}

function genererActionsAlimentation(data, indice) {
    const d = indice.details;
    const actions = [];

    window.actionsRecommandeesAlimentation = [];

    if (d.circuitsCourts.points < 15) {
        window.actionsRecommandeesAlimentation.push(
            "Créer un marché de producteurs",
            "Développer les AMAP",
            "Créer un annuaire local des producteurs"
        );

        actions.push({
            titre: "Développer les circuits courts alimentaires",
            priorite: "Élevée",
            cout: "€€",
            delai: "Moyen terme",
            description: "Renforcer les liens entre producteurs locaux, commerces, restauration collective et habitants.",
            exemples: [
                "Créer un annuaire local des producteurs",
                "Soutenir les marchés de producteurs",
                "Favoriser les achats locaux dans les cantines"
            ]
        });
    }

    if (d.diversite.points < 15) {
        window.actionsRecommandeesAlimentation.push(
            "Créer une plateforme logistique locale",
            "Développer les achats locaux",
            "Lancer un Projet Alimentaire Territorial"
        );

        actions.push({
            titre: "Diversifier la filière alimentaire locale",
            priorite: "Moyenne",
            cout: "€€",
            delai: "Moyen terme",
            description: "Développer les maillons manquants de la filière : transformation, distribution, restauration ou logistique.",
            exemples: [
                "Soutenir les ateliers de transformation",
                "Faciliter l’installation de commerces alimentaires durables",
                "Identifier les besoins logistiques des producteurs"
            ]
        });
    }

    if (d.resilience.points < 15) {
        window.actionsRecommandeesAlimentation.push(
            "Lancer un Projet Alimentaire Territorial",
            "Créer un observatoire alimentaire"
        );

        actions.push({
            titre: "Renforcer la résilience alimentaire du territoire",
            priorite: "Élevée",
            cout: "€€",
            delai: "Long terme",
            description: "Structurer une filière locale plus robuste reliant production, transformation et distribution.",
            exemples: [
                "Créer des partenariats producteurs-restaurateurs",
                "Développer des plateformes alimentaires locales",
                "Intégrer l’alimentation dans le plan de transition écologique"
            ]
        });
    }

    if (d.accessibilite.points < 20) {
        actions.push({
            titre: "Améliorer l’accessibilité à une alimentation durable",
            priorite: "Moyenne",
            cout: "€",
            delai: "Court terme",
            description: "Améliorer l’accès des habitants aux producteurs, commerces bio et solutions de vente directe.",
            exemples: [
                "Cartographier les points d’accès alimentaires",
                "Communiquer sur les acteurs bio proches",
                "Développer des points relais ou paniers locaux"
            ]
        });
    }
    if (d.densite && d.densite.points <= 10) {
    actions.push({
        titre: "Renforcer la densité alimentaire bio",
        priorite: "Moyenne",
        cout: "€€",
        delai: "Long terme",
        description:
            "Augmenter progressivement l'offre alimentaire bio rapportée à la population.",
        exemples: [
            "Accompagner les conversions bio",
            "Développer le maraîchage local",
            "Faciliter l'installation de jeunes agriculteurs"
        ]
    });
}

actions.push({
    titre: "Structurer un Projet Alimentaire Territorial",
    priorite: "Moyenne",
    cout: "€€",
    delai: "Long terme",
    description:
        "Coordonner les acteurs locaux autour d'une stratégie alimentaire commune.",
    exemples: [
        "Lancer une concertation alimentaire",
        "Créer un observatoire alimentaire",
        "Définir une feuille de route alimentation durable"
    ]
});

actions.push({
    titre: "Développer les achats locaux en restauration collective",
    priorite: "Moyenne",
    cout: "€",
    delai: "Moyen terme",
    description:
        "Utiliser la commande publique pour soutenir les producteurs et filières locales.",
    exemples: [
        "Adapter les marchés publics",
        "Fractionner les lots",
        "Augmenter la part de produits locaux dans les cantines"
    ]
});

    if (actions.length === 0) {
        actions.push({
            titre: "Consolider la dynamique alimentaire durable",
            priorite: "Faible",
            cout: "€",
            delai: "Continu",
            description: "Le territoire présente déjà une bonne base alimentaire durable. L’enjeu est de maintenir et structurer cette dynamique.",
            exemples: [
                "Suivre l’évolution des opérateurs bio",
                "Maintenir le dialogue avec les producteurs",
                "Intégrer l’alimentation durable dans les documents stratégiques"
            ]
        });
    }

    return actions;
}

function afficherActionsAlimentation(actions) {
    window.actionsAlimentationCourantes = actions;

    document.getElementById("actionsAlimentation").innerHTML = `
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-body">

                <h4>⭐ Actions prioritaires pour votre territoire</h4>

                <p class="text-muted">
    Ces recommandations sont générées automatiquement
    à partir du diagnostic territorial et classées par priorité.
</p>

                ${actions.map(action => `
                    <div class="border rounded p-3 mb-3">
                        <span class="badge bg-secondary">
                            Priorité : ${action.priorite}
                        </span>

                        <h5 class="mt-2">${action.titre}</h5>

                        <p>${action.description}</p>

                        <p class="mb-1">
                            <strong>Coût :</strong> ${action.cout}
                        </p>

                        <p class="mb-1">
                            <strong>Délai :</strong> ${action.delai}
                        </p>

                        <strong>Exemples :</strong>

                        <ul>
                            ${(action.exemples || []).map(e => `
                                <li>${e}</li>
                            `).join("")}
                        </ul>

                        <button
                            class="btn btn-outline-success btn-sm"
                            onclick='ajouterActionAlimentationPlan(${JSON.stringify(action)})'
                        >
                            ➕ Ajouter au plan de transition
                        </button>
                    </div>
                `).join("")}

                ${afficherBibliothequeActionsAlimentation()}

                <p class="text-muted mb-0">
                    Sources : Agence Bio, Agreste RA2020, INSEE.
                </p>

            </div>
        </div>
    `;
}

function afficherBibliothequeActionsAlimentation() {
    
    const compterActions = categorie =>
    bibliothequeActionsAlimentation.filter(a =>
        a.categorie.includes(categorie)
    ).length;
    const actionsAffichees =
        filtreAlimentation === "Toutes"
            ? bibliothequeActionsAlimentation
            : bibliothequeActionsAlimentation.filter(a =>
                a.categorie.includes(filtreAlimentation)
            );

    return `
        <h4 class="mt-4">
            📚 Bibliothèque d'actions alimentation durable
            <p class="text-muted">
    ${actionsAffichees.length} action(s) affichée(s)
</p>
        </h4>

        <div class="mb-3">
            <button class="btn btn-sm btn-outline-dark me-2" onclick="filtrerActionsAlimentation('Toutes')">
    📚 Toutes (${bibliothequeActionsAlimentation.length})
</button>

<button class="btn btn-sm btn-outline-success me-2" onclick="filtrerActionsAlimentation('Production')">
    🌾 Production (${compterActions("Production")})
</button>

<button class="btn btn-sm btn-outline-primary me-2" onclick="filtrerActionsAlimentation('Circuits courts')">
    🛒 Circuits courts (${compterActions("Circuits courts")})
</button>

<button class="btn btn-sm btn-outline-warning me-2" onclick="filtrerActionsAlimentation('Restauration')">
    🍽️ Restauration (${compterActions("Restauration")})
</button>

<button class="btn btn-sm btn-outline-danger me-2" onclick="filtrerActionsAlimentation('Gaspillage')">
    ♻️ Gaspillage (${compterActions("Gaspillage")})
</button>

<button class="btn btn-sm btn-outline-info me-2" onclick="filtrerActionsAlimentation('Logistique')">
    🚚 Logistique (${compterActions("Logistique")})
</button>

<button class="btn btn-sm btn-outline-secondary me-2" onclick="filtrerActionsAlimentation('Gouvernance')">
    📚 Gouvernance (${compterActions("Gouvernance")})
</button>
<button class="btn btn-sm btn-outline-dark me-2"
    onclick="filtrerActionsAlimentation('Solidarité')">
    🤝 Solidarité (${compterActions("Solidarité")})
</button>
        </div>

        <div class="row g-3">
            ${actionsAffichees.map(a => {
                const recommande =
                    window.actionsRecommandeesAlimentation &&
                    window.actionsRecommandeesAlimentation.includes(a.titre);

                return `
                    <div class="col-lg-4 col-md-6">
    <div class="card h-100">
                        <div class="card-body">

                            ${recommande ? `
                                <span class="badge bg-warning text-dark mb-2">
                                    ⭐ Recommandé pour votre territoire
                                </span><br>
                            ` : ""}

                            <span class="badge bg-success">
                                ${a.categorie}
                            </span>

                            <h6 class="mt-2">${a.titre}</h6>
                            <p class="text-muted mb-2">
    Source : ${a.source || "ADEME / PAT"}
</p>

                            <p>
    <strong>Pourquoi ?</strong><br>
    ${a.pourquoi || "Action utile pour renforcer l’alimentation durable du territoire."}
</p>

<p>
    <strong>Bénéfices attendus :</strong>
</p>

<ul>
    ${(a.benefices || [
        "Renforce la résilience alimentaire",
        "Soutient les acteurs économiques locaux",
        "Réduit l'impact environnemental"
    ]).map(b => `
        <li>${b}</li>
    `).join("")}
</ul>

<p>
    <strong>Comment ?</strong>
</p>

                            <ul>
                                ${(a.comment || []).map(c => `
                                    <li>${c}</li>
                                `).join("")}
                            </ul>

                            <p>
                                <strong>Exemples :</strong><br>
                                ${(a.exemples || []).join("<br>")}
                            </p>

                            <p class="mb-1">
                                Impact : <strong>${a.impact || "Moyen"}</strong>
                            </p>

                            <p class="mb-1">
                                Coût : <strong>${a.cout || "€"}</strong>
                            </p>

                            <p class="mb-2">
                                Délai : <strong>${a.delai || "Variable"}</strong>
                            </p>
                            <p>
    <strong>Financements possibles :</strong><br>
    ${(a.financements || ["ADEME", "Région", "FEADER"]).join(", ")}
</p>

                                                                                    <button
                                class="btn btn-outline-success btn-sm"
                                onclick='ajouterActionAlimentationPlan(${JSON.stringify(a)})'
                            >
                                ➕ Ajouter au plan
                            </button>

                        </div>
                    </div>
                </div>
                `;
            }).join("")}
        </div>
    `;
}
    
window.genererActionsAlimentation = genererActionsAlimentation;
window.afficherActionsAlimentation = afficherActionsAlimentation;
window.ajouterActionAlimentationPlan = ajouterActionAlimentationPlan;
window.afficherBibliothequeActionsAlimentation = afficherBibliothequeActionsAlimentation;
window.filtrerActionsAlimentation = filtrerActionsAlimentation;