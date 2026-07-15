function chargerDonneesEau() {
    const ville = document.getElementById("ville").value.trim();
    const blocEaux = document.getElementById("resultat-eaux");

    initMap();

    if (!ville) {
        alert("Veuillez entrer une ville");
        return;
    }

    blocEaux.style.display = "block";

    fetch("/api/donnees-eaux/?ville=" + encodeURIComponent(ville))
        .then(response => response.json())
        .then(data => {
            console.log("DONNÉES EAU :", data);

            if (data.error) {
                document.getElementById("eau-potable").innerHTML = `
                    <div class="alert alert-warning">
                        ${data.error}
                    </div>
                `;
                return;
            }

            document.getElementById("eaux-commune").textContent = data.commune;
            document.getElementById("eaux-insee").textContent = data.code_insee;

            afficherCommuneSurCarte(data);

            document.getElementById("eau-potable").innerHTML = `
                <div class="alert alert-light border mt-3">
                    <p><strong>Dernier prélèvement :</strong> ${data.dernier_prelevement || "Non disponible"}</p>
                    <p><strong>Conclusion sanitaire :</strong> ${data.conclusion || "Non disponible"}</p>
                </div>

                <div id="graphiques-eau-potable"></div>
            `;

            afficherGraphiquesEauPotableTroisAns(data.eau_potable || []);

            if (data.analyses_rivieres && data.analyses_rivieres.length > 0) {
                graphiquesRivieres.forEach(graph => graph.destroy());
                graphiquesRivieres = [];

                let htmlRivieres = `
                    <div class="mt-3">
                        <h5>Qualité des rivières par station</h5>
                `;

                data.analyses_rivieres.forEach((bloc, index) => {
                    const station = bloc.station;

                    htmlRivieres += `
                        <div class="card border-0 shadow-sm p-3 mt-3">
                            <h6>${station.libelle_station || "Station non renseignée"}</h6>

                            <p>
                                <strong>Code station :</strong>
                                ${station.code_station || "Non renseigné"}
                            </p>

                            <div id="graph-station-${index}"></div>
                        </div>
                    `;
                });

                htmlRivieres += `</div>`;

                document.getElementById("rivieres").innerHTML = htmlRivieres;

                data.analyses_rivieres.forEach((bloc, index) => {
                    afficherGraphiquesRivieresStation(
                        bloc.analyses || [],
                        `graph-station-${index}`
                    );
                });

            } else {
                document.getElementById("rivieres").innerHTML = `
                    <div class="alert alert-secondary mt-3">
                        Aucune analyse rivière trouvée.
                    </div>
                `;
            }
        })
        .catch(error => {
    console.error("ERREUR JS EAU :", error);

    document.getElementById("rivieres").innerHTML = `
        <div class="alert alert-danger">
            Erreur JS eau : ${error.message}
        </div>
    `;
});
}

window.chargerDonneesEau = chargerDonneesEau;