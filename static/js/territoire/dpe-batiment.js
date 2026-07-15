async function analyserBatiment(){

    const adresse = document.getElementById("adresse").value;
    const ville = document.getElementById("ville").value;

    if(!adresse){
        alert("Veuillez entrer une adresse");
        return;
    }

    if(!ville){
        alert("Veuillez entrer une commune");
        return;
    }

    const response = await fetch(
        "/api/dpe-batiment/?adresse=" +
        encodeURIComponent(adresse) +
        "&ville=" +
        encodeURIComponent(ville)
    );

    const data = await response.json();

    if(data.error){
        document.getElementById("resultatBatiment").innerHTML = `
            <div class="alert alert-danger">
                ${data.error}
            </div>
        `;
        return;
    }

    let badge = "success";

    if(data.classe_dpe === "E"){
        badge = "warning";
    }

    if(data.classe_dpe === "F" || data.classe_dpe === "G"){
        badge = "danger";
    }

    const html = `
        <div class="card shadow-sm p-4">
            <h4>🏠 Diagnostic bâtiment</h4>

            <p>
                <strong>Adresse recherchée :</strong>
                ${data.donnees.adresse_ban || data.adresse_recherchee}
            </p>

            <p>
                <strong>Classe DPE :</strong>
                <span class="badge bg-${badge}">
                    ${data.classe_dpe}
                </span>
            </p>

            <p><strong>Classe GES :</strong> ${data.classe_ges}</p>

            <p>
                <strong>Consommation énergie :</strong>
                ${data.donnees.conso_5_usages_par_m2_ef || "Non disponible"}
                kWh/m²/an
            </p>

            <p>
                <strong>Émissions GES :</strong>
                ${data.donnees.emission_ges_5_usages_par_m2 || "Non disponible"}
                kgCO₂/m²/an
            </p>

            <p>
                <strong>Surface :</strong>
                ${data.donnees.surface_habitable_logement || "Non disponible"} m²
            </p>

            <p>
                <strong>Année de construction :</strong>
                ${data.donnees.annee_construction || "Non disponible"}
            </p>

            <p><strong>Niveau priorité :</strong> ${data.niveau_priorite}</p>

            <hr>

            <h5>📊 Comparaison communale</h5>

            <p><strong>Moyenne DPE commune :</strong> ${data.moyenne_commune}</p>

            <p>
                <strong>Analyse :</strong>
                Votre bâtiment est <strong>${data.comparaison_commune}</strong>.
            </p>

            <hr>

            <p>${data.diagnostic}</p>

            <h5>Recommandations</h5>

            <ul>
                ${data.recommandations.map(r => `<li>${r}</li>`).join("")}
            </ul>

            <p class="text-muted">Source : ${data.source}</p>
        </div>
    `;

    document.getElementById("resultatBatiment").innerHTML = html;
}

window.analyserBatiment = analyserBatiment;