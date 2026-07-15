function afficherIndiceVulnerabilite(resultat) {

    const zone =
        document.getElementById("lectureTerritorialeCarte");

    if (!zone || !resultat) return;

    const indice = resultat.indice;

    let niveau = "Faible";
    let couleur = "success";
    let priorite = "Faible";
    let diagnostic =
        "Le territoire présente actuellement une vulnérabilité limitée au regard des données publiques analysées.";

    if (indice >= 70) {
        niveau = "Élevée";
        couleur = "danger";
        priorite = "Élevée";
        diagnostic =
            "Le territoire présente plusieurs facteurs de vulnérabilité nécessitant des actions d’adaptation prioritaires.";
    } else if (indice >= 40) {
        niveau = "Modérée";
        couleur = "warning";
        priorite = "Moyenne";
        diagnostic =
            "Le territoire présente des vulnérabilités identifiées qui doivent être prises en compte dans les politiques locales.";
    }

    let facteurs =
        window.identifierFacteursDiagnostic
            ? identifierFacteursDiagnostic(resultat.data || {})
            : [];

    if (resultat.aleas >= 70) {
        facteurs.push("Présence significative d'aléas naturels");
    }

    if (resultat.sensibilite >= 60) {
        facteurs.push("Sensibilité territoriale élevée — population / densité");
    }

    if (facteurs.length === 0) {
        facteurs.push("Aléas et sensibilité modérés");
    }

    zone.innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">

                <h4>📍 Vulnérabilité climatique actuelle</h4>

                <div class="alert alert-${couleur} mt-3">
                    <h5>Vulnérabilité climatique ${niveau}</h5>
                    <p class="mb-0">${diagnostic}</p>
                </div>

                <h5 class="mt-4">Principaux facteurs identifiés</h5>

                <ul>
                    ${facteurs.map(f => `<li>${f}</li>`).join("")}
                </ul>

                <h5 class="mt-4">Niveau de priorité</h5>

                <p>
                    <strong>${priorite}</strong>
                </p>

                <details class="mt-4">
                    <summary>📖 Comprendre le diagnostic</summary>

                    <div class="mt-3">

                        <div class="card border-0 bg-light p-3 mb-3">
                            <h6>🌊 Aléas naturels</h6>

                            <p class="mb-1">
                                <strong>${resultat.aleas}/100</strong>
                            </p>

                            <small class="text-muted">
                                Cet indicateur mesure l'exposition du territoire
                                aux risques naturels connus :
                                inondations, remontées de nappes,
                                mouvements de terrain, cavités souterraines
                                et retrait-gonflement des argiles.
                            </small>
                        </div>

                        <div class="card border-0 bg-light p-3 mb-3">
                            <h6>🏘️ Sensibilité territoriale</h6>

                            <p class="mb-1">
                                <strong>${resultat.sensibilite}/100</strong>
                            </p>

                            <small class="text-muted">
                                Cet indicateur représente l'importance
                                des enjeux exposés :
                                population, densité urbaine, bâtiments,
                                infrastructures et activités économiques.
                            </small>
                        </div>

                        <div class="card border-0 bg-light p-3 mb-3">
                            <h6>📊 Indice global</h6>

                            <p class="mb-1">
                                <strong>${indice}/100</strong>
                            </p>

                            <small class="text-muted">
                                L'indice global combine les aléas naturels
                                et la sensibilité territoriale afin d'évaluer
                                la vulnérabilité climatique du territoire.
                                Plus cet indice est élevé, plus les actions
                                d'adaptation doivent être prioritaires.
                            </small>
                        </div>

                        <div class="alert alert-info">
                            <strong>Comment lire ce diagnostic ?</strong>

                            <ul class="mb-0 mt-2">
                                <li>
                                    Un territoire peut présenter des aléas importants
                                    mais peu d'enjeux exposés.
                                </li>
                                <li>
                                    Un territoire peut présenter peu d'aléas
                                    mais une population importante.
                                </li>
                                <li>
                                    Les territoires cumulant les deux situations
                                    sont les plus vulnérables.
                                </li>
                            </ul>
                        </div>

                        <small class="text-muted">
                            Sources utilisées :
                            BRGM, Géorisques, INSEE / geo.api.gouv.fr.
                            <br>
                            Méthode inspirée de la démarche TACCT de l'ADEME.
                        </small>

                    </div>
                </details>

            </div>
        </div>
    `;
}

window.afficherIndiceVulnerabilite =
    afficherIndiceVulnerabilite;