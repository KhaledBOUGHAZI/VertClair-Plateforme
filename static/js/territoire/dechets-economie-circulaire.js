function serviceTexte(a) {
    return (
        String(a.service || "") + " " +
        String(a.type || "") + " " +
        String(a.type_acteur || "")
    ).toLowerCase();
}

function blocActeurEco(a) {

    const idCarte =
        a.id || "";

    return `
        <div class="border rounded p-3 mb-2">

            <strong>${a.nom || "Acteur"}</strong><br>

            <small class="text-muted">
                ${a.service || ""}
            </small><br>

            ${a.adresse || ""}<br>
            ${a.ville || ""}

            ${
                idCarte
                ? `
                    <br>
                    <button
                        class="btn btn-outline-success btn-sm mt-2"
                        onclick="centrerActeurEco('${idCarte}')"
                    >
                        📍 Voir sur la carte
                    </button>
                `
                : ""
            }

        </div>
    `;
}

function afficherEconomieCirculaire(dataEco, decheteries) {

    const acteursEco = dataEco.acteurs || [];
    acteursEco.forEach((a, index) => {
    if (!a.id) {
        a.id = "acteur_eco_" + index;
    }
});

    const acteursDecheteries = decheteries.map((d, index) => ({
        id: "decheterie_" + index,
        nom: d.nom || "Déchèterie",
        service: "Déchèterie",
        type: "Déchèterie",
        type_acteur: "Déchèterie",
        adresse: d.adresse || "",
        ville: d.ville || "",
        lat: d.lat,
        lon: d.lon
    }));

    const groupesEco = [
        {
            id: "decheteries",
            label: "♻️ Déchèteries",
            acteurs: acteursDecheteries
        },
        {
            id: "collecte",
            label: "📦 Collecte",
            acteurs: acteursEco.filter(a =>
                serviceTexte(a).includes("collecte")
            )
        },
        {
            id: "reparation",
            label: "🔧 Réparation",
            acteurs: acteursEco.filter(a =>
                serviceTexte(a).includes("reparation") ||
                serviceTexte(a).includes("reparer")
            )
        },
        {
            id: "reemploi",
            label: "🤝 Réemploi / don",
            acteurs: acteursEco.filter(a =>
                serviceTexte(a).includes("donner") ||
                serviceTexte(a).includes("don") ||
                serviceTexte(a).includes("reemploi") ||
                serviceTexte(a).includes("réemploi")
            )
        },
        {
            id: "achat",
            label: "🛒 Achat / revente",
            acteurs: acteursEco.filter(a =>
                serviceTexte(a).includes("acheter") ||
                serviceTexte(a).includes("revendre") ||
                serviceTexte(a).includes("vente") ||
                serviceTexte(a).includes("seconde")
            )
        },
        {
            id: "partage",
            label: "🔁 Partage / échange",
            acteurs: acteursEco.filter(a =>
                serviceTexte(a).includes("partage") ||
                serviceTexte(a).includes("echanger") ||
                serviceTexte(a).includes("échange")
            )
        }
    ];

    window.groupesEcoCourants = groupesEco;

    const nbCollecte = groupesEco.find(g => g.id === "collecte").acteurs.length;
    const nbReparation = groupesEco.find(g => g.id === "reparation").acteurs.length;
    const nbReemploi = groupesEco.find(g => g.id === "reemploi").acteurs.length;
    const nbAchat = groupesEco.find(g => g.id === "achat").acteurs.length;
    const nbPartage = groupesEco.find(g => g.id === "partage").acteurs.length;
    const nbDecheteries = acteursDecheteries.length;

    document.getElementById("statistiquesEconomieCirculaire").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h4>📊 Synthèse territoriale</h4>

                <div class="row text-center">
                    <div class="col-md-2">
                        <h3>${nbDecheteries}</h3>
                        <small>Déchèteries</small>
                    </div>

                    <div class="col-md-2">
                        <h3>${nbCollecte}</h3>
                        <small>Collecte</small>
                    </div>

                    <div class="col-md-2">
                        <h3>${nbReparation}</h3>
                        <small>Réparation</small>
                    </div>

                    <div class="col-md-2">
                        <h3>${nbReemploi}</h3>
                        <small>Réemploi</small>
                    </div>

                    <div class="col-md-2">
                        <h3>${nbAchat}</h3>
                        <small>Achat / Revente</small>
                    </div>

                    <div class="col-md-2">
                        <h3>${nbPartage}</h3>
                        <small>Partage</small>
                    </div>
                </div>

                <p class="text-muted mt-3 mb-0">
                    Total hors déchèteries :
                    <strong>${acteursEco.length}</strong> acteur(s) ADEME recensé(s).
                </p>
            </div>
        </div>
    `;

    document.getElementById("economieCirculaire").innerHTML = `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">

                <h4>♻️ Acteurs et équipements de l'économie circulaire</h4>

                <p class="text-muted">
                    Les équipements et acteurs sont regroupés par type de service.
                </p>

                <ul class="nav nav-tabs mb-3" role="tablist">
                    ${groupesEco.map((g, index) => `
                        <li class="nav-item" role="presentation">
                            <button
                                class="nav-link ${index === 0 ? "active" : ""}"
                                data-bs-toggle="tab"
                                data-bs-target="#eco-${g.id}"
                                type="button"
                                role="tab"
                            >
                                ${g.label}
                                <span class="badge bg-secondary">
                                    ${g.acteurs.length}
                                </span>
                            </button>
                        </li>
                    `).join("")}
                </ul>

                <div class="tab-content">
                    ${groupesEco.map((g, index) => `
                        <div
                            class="tab-pane fade ${index === 0 ? "show active" : ""}"
                            id="eco-${g.id}"
                            role="tabpanel"
                        >
                            ${
                                g.acteurs.length === 0
                                ? `
                                    <div class="alert alert-warning">
                                        Aucun acteur identifié dans cette catégorie.
                                    </div>
                                `
                                : `
                                    ${g.acteurs.slice(0, 5).map(a => blocActeurEco(a)).join("")}

                                    ${
                                        g.acteurs.length > 5
                                        ? `
                                            <button
                                                class="btn btn-outline-success btn-sm mt-2"
                                                onclick="afficherTousActeursEco('${g.id}')"
                                            >
                                                Voir les ${g.acteurs.length - 5} autres acteurs
                                            </button>
                                        `
                                        : ""
                                    }
                                `
                            }
                        </div>
                    `).join("")}
                </div>

                <small class="text-muted">
                    Sources : ADEME — Que faire de mes objets et déchets ; SINOE / ADEME pour les déchèteries.
                </small>

            </div>
        </div>
    `;
}

function afficherTousActeursEco(idGroupe) {
    const groupe =
        window.groupesEcoCourants.find(
            g => g.id === idGroupe
        );

    if (!groupe) return;

    const zone =
        document.getElementById("eco-" + idGroupe);

    zone.innerHTML =
        groupe.acteurs.map(a => blocActeurEco(a)).join("");
}

window.afficherTousActeursEco = afficherTousActeursEco;