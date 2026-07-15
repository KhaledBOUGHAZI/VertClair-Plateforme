async function chargerClimat() {

    const ville =
        document.getElementById("ville").value;

    if(!ville){
        alert("Veuillez entrer une commune");
        return;
    }

    chargerRisquesClimat(ville);

    document.getElementById("resultatClimat").innerHTML = `
        <div class="alert alert-info">
            Chargement des projections climatiques...
        </div>
    `;

    const response =
        await fetch(
            "/api/climat/?ville=" +
            encodeURIComponent(ville)
        );

    const data = await response.json();

    if(data.error){

        document.getElementById("resultatClimat").innerHTML = `
            <div class="alert alert-warning">
                ${data.error}
            </div>
        `;

        return;
    }

    if(data.centre){

        const lat =
            data.centre.coordinates[1];

        const lon =
            data.centre.coordinates[0];

        map.setView([lat,lon],11);

        if(marker){
            map.removeLayer(marker);
        }

        marker = L.marker([lat,lon]).addTo(map);

        marker.bindPopup(
            `<strong>${data.commune}</strong>`
        ).openPopup();
    }

    let html = `

    <h3 class="mb-4">
        ${data.commune}
    </h3>

`;

Object.entries(data.scenarios).forEach(

    ([nomScenario, valeursScenario]) => {

        html += `

            <div class="card shadow-sm p-4 mb-4">

                <h3>
                    ${nomScenario}
                </h3>

                <p class="text-muted">
                    ${valeursScenario.description}
                </p>

                <div class="row">
        `;

        Object.entries(valeursScenario).forEach(

            ([annee, scenario]) => {

                if(annee === "description") return;

                html += `

                    <div class="col-md-4 mb-3">

                        <div class="
                            card
                            border-0
                            shadow-sm
                            p-3
                            h-100
                        ">

                            <h4>${annee}</h4>

                            <p>
                                <strong>
                                    Température moyenne :
                                </strong>

                                +${scenario.temperature} °C
                            </p>

                            <p>
                                <strong>
                                    Jours de forte chaleur :
                                </strong>

                                ${scenario.jours_chaleur}
                            </p>

                            <p>
                                <strong>
                                    Nuits tropicales :
                                </strong>

                                ${scenario.nuits_tropicales}
                            </p>

                            <p>
                                <strong>
                                    Sécheresse :
                                </strong>

                                ${scenario.secheresse}
                            </p>

                        </div>

                    </div>
                `;
            }
        );

        html += `
                </div>
            </div>
        `;
    }
);

html += `
    <div class="card shadow-sm p-4 mb-4">

        <h3>🎯 Comparaison avec les objectifs climat</h3>

        <p>
            <strong>Accord de Paris :</strong>
            limiter le réchauffement à
            +${data.objectifs.accord_paris_15} °C
            et rester bien en dessous de
            +${data.objectifs.accord_paris_2} °C.
        </p>

        <p>
            <strong>Objectif national :</strong>
            ${data.objectifs.neutralite_france}
        </p>

        <p>
            <strong>Objectif 2030 :</strong>
            ${data.objectifs.reduction_france_2030}
        </p>

    </div>
`;

html += `
    <div class="text-muted mt-3">
        Source : ${data.source}
    </div>
`;

document.getElementById(
    "resultatClimat"
).innerHTML = html;
}

window.chargerClimat = chargerClimat;