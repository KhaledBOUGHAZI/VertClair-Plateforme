function afficherAggravationRisques(aggravations) {

    const zone =
        document.getElementById("diagnostic2050");

    if (!zone) return;

    zone.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">

            <h4>📈 Aggravation probable des risques 2030 / 2050</h4>

            <p class="text-muted">
                Lecture prospective non réglementaire, basée sur les risques actuels
                et les tendances climatiques futures.
            </p>

            <table class="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Risque</th>
                        <th>Situation actuelle</th>
                        <th>2030</th>
                        <th>2050</th>
                    </tr>
                </thead>

                <tbody>
                    ${aggravations.map(a => `
                        <tr>
                            <td>${a.risque}</td>
                            <td>${a.actuel}</td>
                            <td>${a.horizon2030}</td>
                            <td>${a.horizon2050}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

        </div>
    `;
}

window.afficherAggravationRisques =
    afficherAggravationRisques;