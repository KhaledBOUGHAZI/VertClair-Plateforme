function identifierFacteursDiagnostic(data) {

    let facteurs = [];

    const risques =
        data.risques?.risques || {};

    if (
        risques.argiles &&
        risques.argiles !== "Faible"
    ) {
        facteurs.push(
            "🧱 Exposition au retrait-gonflement des argiles"
        );
    }

    if (
        risques.inondation &&
        risques.inondation !== "Faible"
    ) {
        facteurs.push(
            "🌊 Exposition au risque d’inondation"
        );
    }

    if (
        window.map &&
        window.coucheRemonteeNappeSocle &&
        map.hasLayer(coucheRemonteeNappeSocle)
    ) {
        facteurs.push(
            "💦 Sensibilité aux remontées de nappes"
        );
    }

    if (
        window.map &&
        window.coucheMouvementsTerrain &&
        map.hasLayer(coucheMouvementsTerrain)
    ) {
        facteurs.push(
            "⛰️ Présence de mouvements de terrain recensés"
        );
    }

    if (
        window.map &&
        window.coucheCavites &&
        map.hasLayer(coucheCavites)
    ) {
        facteurs.push(
            "🕳️ Présence de cavités souterraines recensées"
        );
    }

    if (
        data.sensibilite &&
        data.sensibilite.densite_hab_ha > 10
    ) {
        facteurs.push(
            "🏘️ Densité de population significative"
        );
    }

    if (facteurs.length === 0) {
        facteurs.push(
            "Aucun facteur majeur détecté dans les données publiques actuellement chargées."
        );
    }

    return facteurs;
}

window.identifierFacteursDiagnostic =
    identifierFacteursDiagnostic;