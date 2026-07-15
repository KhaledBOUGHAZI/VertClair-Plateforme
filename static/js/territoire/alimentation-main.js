async function chargerAlimentation() {

    const ville =
        document.getElementById(
            "villeAlimentation"
        ).value.trim();

    if (!ville) {

        alert(
            "Veuillez entrer une commune."
        );

        return;
    }

    const zone =
        document.getElementById(
            "resultatAlimentation"
        );

    zone.innerHTML = `

        <div class="alert alert-info">
            Chargement des données alimentation...
        </div>

    `;

    try {

        const adresse =
    document.getElementById(
        "adresseAlimentation"
    ).value.trim();

let url =
    "/api/alimentation/?ville=" +
    encodeURIComponent(ville);

if (adresse) {
    url +=
        "&adresse=" +
        encodeURIComponent(adresse);
}

const response =
    await fetch(url);

        const data =
    await response.json();

console.log(data);

afficherDiagnosticAlimentation(data);

afficherCommuneAlimentationSurCarte(data);

afficherActeursAlimentation(data);

const indice =
    calculerIndiceAlimentation(data);

afficherIndiceAlimentation(indice);

const actions =
    genererActionsAlimentation(
        data,
        indice
    );

afficherActionsAlimentation(
    actions
);
document.getElementById(
    "boutonsAlimentation"
).style.display = "block";
document.getElementById(
    "boutonsAlimentation"
).style.display = "block";

if (window.afficherBlocActeursAlimentationPrincipal) {
    afficherBlocActeursAlimentationPrincipal();
}
        console.log(data);


    } catch(error) {

        console.error(error);

        zone.innerHTML = `

            <div class="alert alert-danger">
                Erreur lors du chargement des données.
            </div>

        `;
    }
}

window.chargerAlimentation =
    chargerAlimentation;