const bibliothequeActions = [

{
    id: "ADEME_001",

    origine: "Climat",

    organisme: "ADEME",

    theme: "Chaleur",

    priorite: "Élevée",

    titre:
        "Créer des îlots de fraîcheur",

    description:
        "Développer les espaces végétalisés, l'ombrage et les matériaux limitant les surchauffes.",

    conditions: {
        nuits_tropicales: 5
    }
},

{
    id: "ADEME_002",

    origine: "Climat",

    organisme: "ADEME",

    theme: "Chaleur",

    priorite: "Élevée",

    titre:
        "Végétaliser les espaces publics",

    description:
        "Renforcer la résilience face aux vagues de chaleur.",

    conditions: {
        jours_30: 10
    }
},

{
    id: "CEREMA_001",

    origine: "Climat",

    organisme: "CEREMA",

    theme: "Argiles",

    priorite: "Élevée",

    titre:
        "Prendre en compte le retrait-gonflement des argiles",

    description:
        "Adapter les projets de construction et de rénovation.",

    conditions: {
        argiles: true
    }
},

{
    id: "CEREMA_002",

    origine: "Climat",

    organisme: "CEREMA",

    theme: "Inondation",

    priorite: "Élevée",

    titre:
        "Renforcer la gestion des eaux pluviales",

    description:
        "Limiter les ruissellements et réduire les dommages liés aux pluies intenses.",

    conditions: {
        inondation: true
    }
},

{
    id: "OFB_001",

    origine: "Biodiversité",

    organisme: "OFB",

    theme: "Trames",

    priorite: "Moyenne",

    titre:
        "Restaurer les continuités écologiques",

    description:
        "Préserver les corridors écologiques et la biodiversité.",

    conditions: {
        trame_verte: true
    }
}

];

window.bibliothequeActions =
    bibliothequeActions;