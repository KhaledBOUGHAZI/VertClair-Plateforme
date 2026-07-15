async function chargerEnergie(){

    const ville = document.getElementById("ville").value;

    if(!ville){
        alert("Veuillez entrer une commune");
        return;
    }

    const response = await fetch(
        "/api/energie/?ville=" + encodeURIComponent(ville)
    );

    const responseDpe = await fetch(
        "/api/dpe-commune/?ville=" + encodeURIComponent(ville)
    );

    const data = await response.json();
    const dataDpe = await responseDpe.json();
    const actions =
    genererActionsEnergie(
        data,
        dataDpe
    );

    map.setView([data.latitude, data.longitude], 12);

    if(markerCommune){
        map.removeLayer(markerCommune);
    }

    markerCommune = L.marker([data.latitude, data.longitude]).addTo(map);

    markerCommune.bindPopup(
        `<strong>${data.commune}</strong>`
    ).openPopup();

    const html = `
        <div class="card shadow-sm p-4">
            <h3>${data.commune}</h3>

            <div class="row">
                <div class="col-md-6">
                    <h5>Indicateurs énergétiques</h5>
                    <p><strong>DJU chauffage :</strong> ${data.dju_chauffage}</p>
                    <p><strong>DJU climatisation :</strong> ${data.dju_climatisation}</p>
                    <p><strong>Stress thermique :</strong> ${data.stress_thermique}</p>
                </div>

                <div class="col-md-6">
                    <h5>Objectifs nationaux</h5>
                    <p>2030 : ${data.objectif_2030}</p>
                    <p>2040 : ${data.objectif_2040}</p>
                    <p>2050 : ${data.objectif_2050}</p>
                </div>
            </div>

            <hr>

            <h5>Projection consommation énergétique</h5>

            <div class="row">
                <div class="col-md-4">
                    <div class="card p-3">
                        <h4>2030</h4>
                        <p>${data.projection["2030"]}%</p>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <h4>2040</h4>
                        <p>${data.projection["2040"]}%</p>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <h4>2050</h4>
                        <p>${data.projection["2050"]}%</p>
                    </div>
                </div>
            </div>

            <hr>

            <h5>Recommandations</h5>
            <ul>
                ${data.recommandations.map(r => `<li>${r}</li>`).join("")}
            </ul>

            <hr>

            <h4>🏢 Performance énergétique des bâtiments</h4>

            <p><strong>Nombre de DPE disponibles :</strong> ${dataDpe.nombre_dpe}</p>
            <p><strong>Classe DPE dominante :</strong> ${dataDpe.classe_dominante}</p>
            <p><strong>Part de passoires F/G :</strong> ${dataDpe.part_passoires} %</p>

            <h5 class="mt-3">Répartition des classes DPE</h5>

<div class="row">

    <div class="col-md-6">

        <table class="table table-sm">

            <tbody>

                <tr>
                    <td>A</td>
                    <td>${dataDpe.classes_dpe.A}</td>
                </tr>

                <tr>
                    <td>B</td>
                    <td>${dataDpe.classes_dpe.B}</td>
                </tr>

                <tr>
                    <td>C</td>
                    <td>${dataDpe.classes_dpe.C}</td>
                </tr>

                <tr>
                    <td>D</td>
                    <td>${dataDpe.classes_dpe.D}</td>
                </tr>

                <tr>
                    <td>E</td>
                    <td>${dataDpe.classes_dpe.E}</td>
                </tr>

                <tr>
                    <td>F</td>
                    <td>${dataDpe.classes_dpe.F}</td>
                </tr>

                <tr>
                    <td>G</td>
                    <td>${dataDpe.classes_dpe.G}</td>
                </tr>

            </tbody>

        </table>

    </div>

    <div class="col-md-6">

        <h6>🎨 Légende DPE</h6>

        <p>🟢 A : Très performant</p>
        <p>🟢 B : Performant</p>
        <p>🟡 C : Consommation modérée</p>
        <p>🟠 D : Consommation moyenne</p>
        <p>🟠 E : Énergivore</p>
        <p>🔴 F : Passoire thermique</p>
        <p>🔴 G : Très forte consommation</p>

    </div>

</div>

            <h4 class="mt-4">🧠 Synthèse énergétique territoriale</h4>

            <p>
                Le parc de bâtiments analysé à ${data.commune} présente une classe dominante
                ${dataDpe.classe_dominante}. La part de passoires énergétiques F/G est de
                ${dataDpe.part_passoires} %, ce qui indique un enjeu réel de rénovation énergétique.
            </p>

            <p>
                Les actions prioritaires sont l’isolation thermique, le pilotage énergétique,
                la réduction des besoins de chauffage et l’adaptation au confort d’été.
            </p>

            <p class="text-muted">Source DPE : ${dataDpe.source}</p>
            <p class="text-muted">Source énergie : ${data.source}</p>
        </div>
    `;

document.getElementById(
    "blocBatimentsEnergie"
).innerHTML = html;

document.getElementById(
    "boutonsEnergie"
).style.display = "block";

if (window.afficherBlocBatiments) {
    afficherBlocBatiments();
}
document.getElementById(
    "blocActionsEnergie"
).innerHTML = `

<div class="card shadow-sm border-0 mt-4">
    <div class="card-body">

        <h4>🎯 Actions énergie prioritaires</h4>

        ${actions.map(a => `
            <div class="border rounded p-3 mb-3">

                <span class="badge bg-secondary">
                    ${a.priorite}
                </span>

                <h5 class="mt-2">
                    ${a.titre}
                </h5>

                <p>
                    ${a.description}
                </p>
                <button
    class="btn btn-success btn-sm"
    onclick="ajouterActionEnergieAuPlan('${a.id}')"
>
    ➕ Ajouter au plan de transition
</button>

            </div>
        `).join("")}

    </div>
</div>
`;

if (window.afficherPotentielSolaire) {
    afficherPotentielSolaire(data.commune);
}
if (window.afficherPotentielEolien) {
    afficherPotentielEolien(data.commune);
}
if (window.afficherPotentielGeothermie) {
    afficherPotentielGeothermie(
        data.commune
    );
}
if (window.afficherPotentielBiomasse) {
    afficherPotentielBiomasse(
        data.commune
    );
}
if (window.afficherBlocBatiments) {
    afficherBlocBatiments();
}


}

window.chargerEnergie = chargerEnergie;