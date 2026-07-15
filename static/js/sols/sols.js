let carteLeafletSols = null;
let couchesSols = {};
let objetsCarteSols = {};

function analyserSols() {
    const recherche = document.getElementById("rechercheSols").value.trim();

    if (!recherche) {
        alert("Veuillez saisir une commune ou une adresse.");
        return;
    }

    fetch(`/api/sols/?q=${encodeURIComponent(recherche)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.error);
                return;
            }

            afficherDiagnosticSols(data);
            afficherComprendreIndicateursSols();
            afficherCarteSols(data);
            afficherSitesSols(data);
            afficherIndicateurSols(data);
            afficherDiagnosticTerritorialSols(data);
            afficherActionsSols(data);
            afficherBibliothequeActionsSols();
        })
        .catch(error => {
            console.error("Erreur détaillée :", error);
            alert("Erreur JS : " + error.message);
        });
}

function afficherDiagnosticSols(data) {
    document.getElementById("diagnosticSols").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>🌱 Diagnostic sols et pollution</h4>

                <p><strong>Commune :</strong> ${data.commune.commune}</p>
                <p><strong>Code INSEE :</strong> ${data.commune.code_insee}</p>
                <p><strong>Population :</strong> ${data.commune.population || "Non renseignée"}</p>
<p><strong>Superficie :</strong> ${data.commune.superficie_km2 || "Non renseignée"} km²</p>

                <p><strong>Anciens sites industriels CASIAS :</strong> ${data.diagnostic.casias}</p>
                <p><strong>Sites pollués / ex-BASOL :</strong> ${data.diagnostic.sites_pollues}</p>
                <p><strong>Secteurs d’information sur les sols SIS :</strong> ${data.diagnostic.sis}</p>
                <p><strong>Servitudes d’utilité publique SUP :</strong> ${data.diagnostic.sup}</p>

                <p class="text-muted mb-0">
                    Données connectées depuis Géorisques / InfoSols / BRGM.
                </p>
            </div>
        </div>
    `;
}

function afficherComprendreIndicateursSols() {
    document.getElementById("comprendreIndicateursSols").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>ℹ️ Comprendre les indicateurs</h4>

                <p><strong>Sites pollués / ex-BASOL :</strong>
                    sites où une pollution des sols est connue ou suspectée et qui peuvent nécessiter
                    un suivi, des études ou des mesures de gestion particulières.
                </p>

                <p><strong>CASIAS :</strong>
                    anciens sites industriels ou activités de service recensés par le BRGM.
                    Leur présence ne signifie pas automatiquement qu’une pollution existe,
                    mais indique un historique d’activité à prendre en compte.
                </p>

                <p><strong>SIS :</strong>
                    Secteurs d’Information sur les Sols. Ils identifient des terrains où une pollution
                    connue justifie des précautions, notamment en cas de changement d’usage
                    ou de projet d’aménagement.
                </p>

                <p><strong>SUP :</strong>
                    Servitudes d’Utilité Publique pouvant encadrer ou limiter certains usages du sol.
                </p>

                <p><strong>Code INSEE :</strong>
                    identifiant officiel de la commune utilisé dans les bases publiques françaises.
                </p>

                <p class="text-muted mb-0">
                    Sources : Géorisques / InfoSols / BRGM.
                </p>
            </div>
        </div>
    `;
}

function afficherCarteSols(data) {
    const lat = data.commune.latitude;
    const lon = data.commune.longitude;

    if (carteLeafletSols) {
        carteLeafletSols.remove();
        carteLeafletSols = null;
    }

    carteLeafletSols = L.map("carteSols").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(carteLeafletSols);

    objetsCarteSols = {};

    const coucheCommune = L.layerGroup();
    const couchePointRecherche = L.layerGroup();

    if (data.commune.contour) {
        L.geoJSON(data.commune.contour, {
            style: {
                color: "#16a34a",
                weight: 3,
                opacity: 0.9,
                fillColor: "#22c55e",
                fillOpacity: 0.08
            }
        }).addTo(coucheCommune);
    }

    L.marker([lat, lon])
        .addTo(couchePointRecherche)
        .bindPopup(`<strong>${data.commune.commune}</strong><br>Territoire analysé`);

    couchesSols = {
        "🟢 Limite communale": coucheCommune,
        "📍 Point recherché": couchePointRecherche,
        "☣️ Sites pollués / ex-BASOL": L.layerGroup(),
        "🏗️ CASIAS géolocalisés": L.layerGroup(),
        "🟣 SIS": L.layerGroup(),
        "🔵 SUP": L.layerGroup()
    };

    ajouterPolygonesSols(data.donnees.sites_pollues || [], couchesSols["☣️ Sites pollués / ex-BASOL"], "Site pollué / ex-BASOL", "red");
    ajouterPolygonesSols(data.donnees.sis || [], couchesSols["🟣 SIS"], "Secteur d’information sur les sols", "purple");
    ajouterPolygonesSols(data.donnees.sup || [], couchesSols["🔵 SUP"], "Servitude d’utilité publique", "blue");
    ajouterPointsCasias(data.donnees.casias || [], couchesSols["🏗️ CASIAS géolocalisés"]);

    Object.values(couchesSols).forEach(couche => couche.addTo(carteLeafletSols));

    L.control.layers(null, couchesSols).addTo(carteLeafletSols);
    ajouterLegendeCarteSols();

    if (data.commune.contour) {
        const contour = L.geoJSON(data.commune.contour);
        carteLeafletSols.fitBounds(contour.getBounds(), {
            padding: [20, 20]
        });
    }
}

function ajouterPolygonesSols(sites, couche, typeSite, couleur) {
    sites.forEach(site => {
        if (!site.geom) return;

        const geojson = {
            type: "Feature",
            geometry: site.geom,
            properties: site
        };

        const objetCarte = L.geoJSON(geojson, {
    style: {
        color: couleur,
        weight: 2,
        fillOpacity: 0.25
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(creerPopupSols(feature.properties, typeSite));
    }
}).addTo(couche);

const id = site.identifiantSsp || site.identifiantSis;

if (id) {
    objetsCarteSols[id] = objetCarte;
}
    });
}

function ajouterPointsCasias(sites, couche) {
    sites.forEach(site => {
        if (!site.geom || site.geom.type !== "Point") return;

        const lon = site.geom.coordinates[0];
        const lat = site.geom.coordinates[1];

const marker = L.circleMarker([lat, lon], {            radius: 6,
            color: "orange",
            fillColor: "orange",
            fillOpacity: 0.8
        })
        .bindPopup(creerPopupSols(site, "Ancien site industriel CASIAS"))
        .addTo(couche);
        const id = site.identifiantBasias;

if (id) {
    objetsCarteSols[id] = marker;
}
    });
}

function creerPopupSols(site, typeSite) {
    return `
        <strong>${site.nom || "Site sans nom"}</strong><br>
        <em>${typeSite}</em><br><br>
        <strong>Adresse :</strong> ${site.adresse || site.adresseLieudit || "Non renseignée"}<br>
        <strong>Statut :</strong> ${site.statut || "Non renseigné"}<br>
        <strong>Mise à jour :</strong> ${site.dateMaj || "Non renseignée"}<br>
        ${
            site.activitePrincipale
                ? `<strong>Activité :</strong> ${site.activitePrincipale}<br>`
                : ""
        }
        ${
            site.ficheRisque
                ? `<br><a href="${site.ficheRisque}" target="_blank">Consulter la fiche officielle</a>`
                : ""
        }
    `;
}

function afficherSitesSols(data) {
    const casias = data.donnees.casias || [];
    const sitesPollues = data.donnees.sites_pollues || [];
    const sis = data.donnees.sis || [];

    let html = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>🏭 Sites du territoire</h4>
                <p class="text-muted">
                    Les sites sont issus de Géorisques / InfoSols / BRGM.
                </p>
    `;

    html += `<h5>☣️ Sites pollués / ex-BASOL</h5>`;

    if (sitesPollues.length === 0) {
        html += `<p class="text-muted">Aucun site pollué connu recensé sur cette commune.</p>`;
    } else {
        sitesPollues.forEach(site => {
            html += creerCarteSiteSols(site);
        });
    }

    html += `<h5 class="mt-4">🏗️ Anciens sites industriels CASIAS</h5>`;

    if (casias.length === 0) {
        html += `<p class="text-muted">Aucun ancien site industriel recensé sur cette commune.</p>`;
    } else {
        casias.slice(0, 10).forEach(site => {
            html += creerCarteSiteSols(site);
        });

        if (casias.length > 10) {
            html += `<p class="text-muted">Seuls les 10 premiers sites CASIAS sont affichés pour garder une lecture claire.</p>`;
        }
    }

    html += `<h5 class="mt-4">🟣 Secteurs d’information sur les sols SIS</h5>`;

    if (sis.length === 0) {
        html += `<p class="text-muted">Aucun SIS recensé sur cette commune.</p>`;
    } else {
        sis.forEach(site => {
            html += creerCarteSiteSols(site);
        });
    }

    html += `
            </div>
        </div>
    `;

    document.getElementById("sitesSols").innerHTML = html;
}

function creerCarteSiteSols(site) {
    const id = site.identifiantSsp || site.identifiantSis || site.identifiantBasias;
    const boutonCarte = id && site.geom
    ? `<button class="btn btn-sm btn-outline-primary mt-2" onclick="voirSiteSurCarte('${id}')">Voir sur la carte</button>`
    : `<p class="text-muted mt-2 mb-0">Non géolocalisé sur la carte.</p>`;

    return `
        <div class="border rounded p-3 mb-3">
            <strong>${site.nom || "Site sans nom"}</strong>
            ${site.activitePrincipale ? `<p class="mb-1">Activité principale : ${site.activitePrincipale}</p>` : ""}
            <p class="mb-1">Adresse : ${site.adresse || site.adresseLieudit || "Non renseignée"}</p>
            <p class="mb-1">Statut : ${site.statut || "Non renseigné"}</p>
            <p class="mb-1">Mise à jour : ${site.dateMaj || "Non renseignée"}</p>
            ${site.ficheRisque ? `<a href="${site.ficheRisque}" target="_blank">Consulter la fiche officielle</a><br>` : ""}
            ${boutonCarte}
        </div>
    `;
}

function afficherIndicateurSols(data) {
    const sitesPollues = data.diagnostic.sites_pollues;
    const casias = data.diagnostic.casias;
    const sis = data.diagnostic.sis;
    const sup = data.diagnostic.sup;

    const superficie = data.commune.superficie_km2 || null;
    const population = data.commune.population || null;

    const densitePollution = superficie ? (sitesPollues / superficie * 10) : null;
    const densiteCasias = superficie ? (casias / superficie * 10) : null;
    const densiteReglementaire = superficie ? ((sis + sup) / superficie * 10) : null;
    const casiasPour1000Hab = population ? (casias / population * 1000) : null;

    let pointsPollution = 15;
    if (densitePollution !== null) {
        pointsPollution = densitePollution === 0 ? 30 : densitePollution <= 1 ? 25 : densitePollution <= 3 ? 15 : 5;
    }

    let pointsCasias = 12;
    if (densiteCasias !== null) {
        pointsCasias = densiteCasias <= 5 ? 25 : densiteCasias <= 20 ? 15 : 5;
    }

    let pointsReglementaire = 12;
    if (densiteReglementaire !== null) {
        pointsReglementaire = densiteReglementaire === 0 ? 25 : densiteReglementaire <= 2 ? 15 : 5;
    }

    let pointsContexte = 20;

    const score = pointsPollution + pointsCasias + pointsReglementaire + pointsContexte;

    let niveau = "Favorable";
    if (score < 50) niveau = "Vigilance élevée";
    else if (score < 70) niveau = "Vigilance modérée";

    const fmt = (v) => v === null ? "Non calculable" : v.toFixed(2);

    document.getElementById("indicateurSols").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>📈 Indicateur sols et foncier durable</h4>

                <h2>${score} / 100</h2>
                <p><strong>${niveau}</strong></p>

                <table class="table table-sm mt-3">
                    <thead>
                        <tr>
                            <th>Critère</th>
                            <th>Donnée rapportée</th>
                            <th>Règle</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Pollution connue</td>
                            <td>${fmt(densitePollution)} site(s) SSP pour 10 km²</td>
                            <td>0 = 30 pts ; ≤1 = 25 pts ; ≤3 = 15 pts ; >3 = 5 pts</td>
                            <td>${pointsPollution} / 30</td>
                        </tr>
                        <tr>
                            <td>Héritage industriel</td>
                            <td>${fmt(densiteCasias)} CASIAS pour 10 km²<br>${fmt(casiasPour1000Hab)} CASIAS pour 1 000 hab.</td>
                            <td>≤5 = 25 pts ; ≤20 = 15 pts ; >20 = 5 pts</td>
                            <td>${pointsCasias} / 25</td>
                        </tr>
                        <tr>
                            <td>Contraintes réglementaires</td>
                            <td>${fmt(densiteReglementaire)} SIS/SUP pour 10 km²</td>
                            <td>0 = 25 pts ; ≤2 = 15 pts ; >2 = 5 pts</td>
                            <td>${pointsReglementaire} / 25</td>
                        </tr>
                        <tr>
                            <td>Lecture territoriale</td>
                            <td>Données contextualisées par superficie et population</td>
                            <td>Aide à la comparaison entre communes</td>
                            <td>${pointsContexte} / 20</td>
                        </tr>
                    </tbody>
                </table>

                <h5>ℹ️ Comprendre le score</h5>

                <p>
                    Ce score utilise des ratios rapportés à la superficie communale et à la population lorsque ces données sont disponibles.
                    Cela évite de pénaliser automatiquement les communes plus grandes ou plus peuplées.
                </p>

               <p>
    Les valeurs brutes restent affichées dans le diagnostic, mais le score privilégie une lecture comparée :
    sites pour 10 km², CASIAS pour 10 km², SIS/SUP pour 10 km² et CASIAS pour 1 000 habitants.
</p>

<div class="alert alert-light border mt-3">
    <strong>Méthode de calcul :</strong><br>
    Les indicateurs sont rapportés à la superficie communale et à la population afin de ne pas pénaliser automatiquement
    les communes plus grandes ou plus peuplées. Une commune avec beaucoup de sites en valeur brute peut donc rester
    comparable à une commune plus petite.
</div>

                <p class="text-muted mb-0">
                    Sources : Géorisques / InfoSols / BRGM / geo.api.gouv.fr.
                </p>
            </div>
        </div>
    `;
}

function afficherActionsSols(data) {
    const actions = [];

    if (data.diagnostic.sites_pollues > 0 || data.diagnostic.sis > 0) {
        actions.push({
            priorite: "Élevée",
            titre: "Réaliser un diagnostic de sols avant tout projet d’aménagement",
            description: "Sécuriser les projets situés à proximité de sites pollués, SIS ou anciens sites industriels.",
            cout: "€",
            delai: "Court terme",
            source: "BRGM / Géorisques / InfoSols"
        });
    }

    if (data.diagnostic.casias > 10) {
        actions.push({
            priorite: "Moyenne",
            titre: "Mettre en place un inventaire local des anciens sites industriels",
            description: "Identifier les sites CASIAS à enjeux pour anticiper les contraintes foncières et les projets de reconversion.",
            cout: "€",
            delai: "Moyen terme",
            source: "BRGM / Géorisques"
        });
    }

    actions.push({
        priorite: "Moyenne",
        titre: "Intégrer les enjeux sols dans les documents d’urbanisme",
        description: "Prendre en compte les données SSP, SIS et CASIAS dans les projets d’aménagement, PLU ou PLUi.",
        cout: "€",
        delai: "Moyen terme",
        source: "CEREMA / BRGM / Géorisques"
    });

    let html = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>⭐ Actions prioritaires pour votre territoire</h4>
                <p class="text-muted">
                    Ces recommandations sont générées automatiquement à partir des données publiques disponibles.
                </p>
    `;

    actions.forEach(action => {
        html += `
            <div class="border rounded p-3 mb-3">
                <p class="mb-1"><strong>Priorité :</strong> ${action.priorite}</p>
                <h5>${action.titre}</h5>
                <p>${action.description}</p>
                <p><strong>Coût :</strong> ${action.cout}</p>
                <p><strong>Délai :</strong> ${action.delai}</p>
                <p class="text-muted mb-0">Source : ${action.source}</p>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    document.getElementById("actionsSols").innerHTML = html;
}
function voirSiteSurCarte(id) {
    const objet = objetsCarteSols[id];

    if (!objet || !carteLeafletSols) {
        alert("Ce site n'est pas géolocalisé sur la carte.");
        return;
    }

    if (objet.getBounds) {
        carteLeafletSols.fitBounds(objet.getBounds(), {
            maxZoom: 17
        });

        objet.eachLayer(function(layer) {
            layer.openPopup();
        });

        return;
    }

    if (objet.getLatLng) {
        carteLeafletSols.setView(objet.getLatLng(), 17);
        objet.openPopup();
    }
}

function afficherDiagnosticTerritorialSols(data) {
    const d = data.diagnostic;

    let html = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>📋 Diagnostic territorial</h4>
    `;

    if (d.sites_pollues === 0) {
        html += `<p>🟢 Aucun site pollué connu n’est recensé sur la commune.</p>`;
    } else if (d.sites_pollues <= 2) {
        html += `<p>🟠 Quelques sites pollués sont recensés. Une vigilance est recommandée lors des projets d’aménagement.</p>`;
    } else {
        html += `<p>🔴 Plusieurs sites pollués sont recensés. Le territoire nécessite une attention particulière.</p>`;
    }

    if (d.casias > 20) {
        html += `<p>🏭 Le territoire présente un héritage industriel important avec de nombreux anciens sites CASIAS.</p>`;
    }

    if (d.sis > 0) {
        html += `<p>🟣 La présence de SIS indique des secteurs où des précautions peuvent être nécessaires en cas de changement d’usage.</p>`;
    }

    if (d.sup > 0) {
        html += `<p>🔵 Une servitude d’utilité publique est recensée et peut encadrer certains usages du sol.</p>`;
    }

    html += `
                <hr>
                <h5>ℹ️ Lecture territoriale</h5>
                <p>
                    Ces données aident à repérer les secteurs nécessitant une vigilance environnementale.
                    Elles ne remplacent pas une étude de sols réglementaire réalisée par un bureau d’études.
                </p>

                <p class="text-muted mb-0">
                    Sources : Géorisques / InfoSols / BRGM.
                </p>
            </div>
        </div>
    `;

    document.getElementById("diagnosticTerritorialSols").innerHTML = html;
}
function afficherBibliothequeActionsSols() {
    const conteneur = document.getElementById("bibliothequeActionsSols");

    if (!conteneur) return;

    if (typeof bibliothequeActionsSols === "undefined") {
        conteneur.innerHTML = `
            <div class="alert alert-warning">
                Bibliothèque d'actions sols non chargée.
            </div>
        `;
        return;
    }

    let html = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>📚 Bibliothèque d'actions sols & pollution</h4>
                <p class="text-muted">
                    ${bibliothequeActionsSols.length} action(s) affichée(s).
                </p>
    `;

bibliothequeActionsSols.forEach((action, index) => {        html += `
            <div class="border rounded p-3 mb-4">
                <p class="mb-1"><strong>${action.categorie}</strong></p>
                <h5>${action.titre}</h5>

                <p class="text-muted">
                    Source : ${action.source}
                </p>

                <p><strong>Pourquoi ?</strong><br>${action.pourquoi}</p>

                <p><strong>Bénéfices attendus :</strong></p>
                <ul>
                    ${action.benefices.map(item => `<li>${item}</li>`).join("")}
                </ul>

                <p><strong>Comment ?</strong></p>
                <ul>
                    ${action.comment.map(item => `<li>${item}</li>`).join("")}
                </ul>

                <p><strong>Exemples :</strong></p>
                <ul>
                    ${action.exemples.map(item => `<li>${item}</li>`).join("")}
                </ul>

                <p><strong>Impact :</strong> ${action.impact}</p>

<p><strong>Coût :</strong> ${action.cout}</p>

<p><strong>Délai :</strong> ${action.delai}</p>

<p><strong>Financements possibles :</strong><br>
    ${action.financements.join(", ")}
</p>

<button
    class="btn btn-success btn-sm mt-3"
    onclick="ajouterActionSolsAuPlan(${index})">

    ➕ Ajouter au plan de transition

</button>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    conteneur.innerHTML = html;
}
function ajouterLegendeCarteSols() {
    const legende = L.control({ position: "bottomright" });

    legende.onAdd = function () {
        const div = L.DomUtil.create("div", "card shadow-sm border-0 p-2");

        div.innerHTML = `
            <strong>🗺️ Légende</strong><br>
            <span style="color:#16a34a;">■</span> Limite communale<br>
            <span style="color:red;">■</span> Site pollué / ex-BASOL<br>
            <span style="color:purple;">■</span> SIS<br>
            <span style="color:blue;">■</span> SUP<br>
            <span style="color:orange;">●</span> CASIAS géolocalisé
        `;

        return div;
    };

    legende.addTo(carteLeafletSols);
}
function ajouterActionSolsAuPlan(index){

    const action = bibliothequeActionsSols[index];

    ajouterAuPlanTransition({

        titre: action.titre,

        description: action.pourquoi,

        origine: "Sols & pollution",

        theme: "Sols & pollution",

        priorite: action.impact,

        cout: action.cout,

        delai: action.delai,

        financements: action.financements,

        source: action.source

    });

}