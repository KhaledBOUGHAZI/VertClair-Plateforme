window.categoriesAlimentationCourantes = {};

function afficherBlocActeursAlimentation(type) {

    const blocs = [
        "producteurs",
        "agroalimentaire",
        "commerces",
        "restauration",
        "logistique"
    ];

    blocs.forEach(b => {
        const bloc =
            document.getElementById("bloc-" + b);

        if (bloc) {
            bloc.style.display = "none";
        }
    });

    const actif =
        document.getElementById("bloc-" + type);

    if (actif) {
        actif.style.display = "block";
    }
}


function afficherActeursAlimentation(data) {

    const categories =
        data.categories_bio || {};

    window.categoriesAlimentationCourantes =
        categories;

    const config = [
        {
            cle: "producteurs",
            titre: "🌾 Producteurs bio",
            bouton: "🌾 Producteurs",
            aide: "Agriculteurs, maraîchers, éleveurs."
        },
        {
    cle: "agroalimentaire",
    titre: "🏭 Entreprises agroalimentaires",
    bouton: "🏭 Agroalimentaire",
    aide: "Transformation, fabrication, conditionnement alimentaire."
},
        {
            cle: "commerces",
            titre: "🛒 Commerces bio",
            bouton: "🛒 Commerces",
            aide: "Magasins, distributeurs, vente directe."
        },
        {
            cle: "restauration",
            titre: "🍽 Restauration bio",
            bouton: "🍽 Restauration",
            aide: "Restaurants et restauration collective."
        },
        {
            cle: "logistique",
            titre: "📦 Logistique / stockage",
            bouton: "📦 Logistique",
            aide: "Stockage et plateformes alimentaires."
        }
    ];

    let boutons = "";
    let contenu = "";

    config.forEach((cat, index) => {

        const acteurs =
            categories[cat.cle] || [];

        boutons += `
            <button
                class="btn btn-outline-success me-2 mb-2"
                onclick="afficherBlocActeursAlimentation('${cat.cle}')"
            >
                ${cat.bouton}
                <span class="badge bg-secondary">
                    ${acteurs.length}
                </span>
            </button>
        `;

        contenu += `
            <div
                id="bloc-${cat.cle}"
                style="${index === 0 ? "display:block" : "display:none"}"
            >
                <h5 class="mt-3">
                    ${cat.titre}
                </h5>

                <p class="text-muted">
                    ${cat.aide}
                </p>

                ${afficherListeActeursAlimentation(
                    acteurs,
                    cat.cle
                )}
            </div>
        `;
    });

    document.getElementById("acteursAlimentation").innerHTML = `
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-body">

                <h4>🌱 Acteurs bio du territoire</h4>

                <p class="text-muted">
                    Les opérateurs bio sont classés par rôle dans la filière alimentaire.
                    Par défaut, seuls les trois premiers acteurs sont affichés.
                </p>

                <div class="mb-3">
                    ${boutons}
                </div>

                ${contenu}

                <p class="text-muted mt-3 mb-0">
                    Source : Agence Bio — API Professionnels BIO.
                </p>

            </div>
        </div>
    `;
}


function afficherListeActeursAlimentation(acteurs, cleCategorie) {

    if (!acteurs || acteurs.length === 0) {
        return `
            <div class="alert alert-light">
                Aucun acteur identifié dans cette catégorie.
            </div>
        `;
    }

    const premiers =
        acteurs.slice(0, 3);

    let html = premiers.map(a => `
        <div class="border rounded p-3 mb-3">

            <h5>${a.nom || "Acteur bio"}</h5>

            <p class="mb-1">
                <strong>Activités :</strong>
                ${(a.activites || []).join(", ") || "Non renseigné"}
            </p>

            <p class="mb-1">
                <strong>Productions :</strong>
                ${(a.productions || []).join(", ") || "Non renseigné"}
            </p>

            <p class="mb-1">
                <strong>Adresse :</strong>
                ${a.adresse || ""} ${a.code_postal || ""} ${a.ville || ""}
            </p>

            <p class="mb-2 text-muted">
    Distance :
    ${a.distance ? Math.round(a.distance * 10) / 10 + " km" : "non renseignée"}
</p>

<button
    class="btn btn-outline-success btn-sm"
    onclick="zoomerActeurBio('${a.id_carte}')"
>
    📍 Voir sur la carte
</button>

        </div>
    `).join("");

    if (acteurs.length > 3) {
        html += `
            <button
                class="btn btn-outline-success btn-sm"
                onclick="afficherTousActeursAlimentation('${cleCategorie}')"
            >
                Voir toute la liste (${acteurs.length})
            </button>
        `;
    }

    return html;
}


function afficherTousActeursAlimentation(cleCategorie) {

    const acteurs =
        window.categoriesAlimentationCourantes[cleCategorie] || [];

    const html = acteurs.map(a => `
        <div class="border rounded p-3 mb-3">

            <h5>${a.nom || "Acteur bio"}</h5>

            <p class="mb-1">
                <strong>Activités :</strong>
                ${(a.activites || []).join(", ") || "Non renseigné"}
            </p>

            <p class="mb-1">
                <strong>Productions :</strong>
                ${(a.productions || []).join(", ") || "Non renseigné"}
            </p>

            <p class="mb-1">
                <strong>Adresse :</strong>
                ${a.adresse || ""} ${a.code_postal || ""} ${a.ville || ""}
            </p>

            <p class="mb-2 text-muted">
    Distance :
    ${a.distance ? Math.round(a.distance * 10) / 10 + " km" : "non renseignée"}
</p>

<button
    class="btn btn-outline-success btn-sm"
    onclick="zoomerActeurBio('${a.id_carte}')"
>
    📍 Voir sur la carte
</button>

        </div>
    `).join("");

    document.getElementById("listeCompleteAlimentation").innerHTML = `
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-body">

                <h4>📋 Liste complète des acteurs bio</h4>

                ${html}

            </div>
        </div>
    `;
}


window.afficherActeursAlimentation =
    afficherActeursAlimentation;

window.afficherTousActeursAlimentation =
    afficherTousActeursAlimentation;

window.afficherBlocActeursAlimentation =
    afficherBlocActeursAlimentation;