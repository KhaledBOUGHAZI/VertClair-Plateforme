function afficherDiagnosticAlimentation(data) {

    document.getElementById(
        "resultatAlimentation"
    ).innerHTML = `

        <div class="card shadow-sm border-0">

            <div class="card-body">

                <h4>
                    🌱 Diagnostic alimentation durable
                </h4>

                <p>
                    <strong>Commune :</strong>
                    ${data.commune}
                </p>

                <p>
                    <strong>Code INSEE :</strong>
                    ${data.code_insee}
                </p>

                <p>
                    <strong>Population :</strong>
                    ${data.population.toLocaleString()}
                </p>

                <p>
                    <strong>Opérateurs bio :</strong>
                    ${data.operateurs_bio}
                </p>

                <p>
                    <strong>SAU moyenne :</strong>
                    ${data.sau_moyenne || "-"} ha
                </p>

                <p>
                    <strong>Année bio :</strong>
                    ${data.annee_bio || "-"}
                </p>

                <div class="alert alert-success mt-3">
                    Données bio connectées depuis l’Agence Bio.
                </div>
                <div class="card bg-light border-0 mt-3">

    <div class="card-body">

        <h5>
            ℹ️ Comprendre les indicateurs
        </h5>

        <p>
            <strong>Opérateurs bio :</strong>
            exploitations agricoles, transformateurs,
            distributeurs ou autres acteurs certifiés
            en agriculture biologique sur la commune.
        </p>

        <p>
            <strong>SAU (Surface Agricole Utile) :</strong>
            surface moyenne exploitée par exploitation agricole.
            Elle comprend les terres cultivées,
            prairies et surfaces agricoles déclarées.
        </p>

        <p>
            <strong>Code INSEE :</strong>
            identifiant officiel de la commune
            utilisé dans les bases publiques françaises.
        </p>

    </div>

</div>

                <p class="text-muted mb-0">
                    Source :
                    ${data.source}
                </p>

            </div>

        </div>

    `;
}

window.afficherDiagnosticAlimentation =
    afficherDiagnosticAlimentation;