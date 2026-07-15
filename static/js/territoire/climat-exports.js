function exporterPlanAdaptationCSV() {

    if (!planActions || planActions.length === 0) {
        alert("Aucun plan d’action à exporter.");
        return;
    }

    let csv = "Risque;Action;Priorité;Délai;Coût;Indicateur\n";

    planActions.forEach(action => {
        csv += `"${action.risque}";"${action.action}";"${action.priorite}";"${action.delai}";"${action.cout}";"${action.indicateur}"\n`;
    });

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "plan-action-adaptation.csv";
    lien.click();

    URL.revokeObjectURL(url);
}

function exporterPlanAdaptationExcel() {

    if (!planActions || planActions.length === 0) {
        alert("Aucun plan d’action à exporter.");
        return;
    }

    let contenu = `
        <table>
            <thead>
                <tr>
                    <th>Risque</th>
                    <th>Action</th>
                    <th>Priorité</th>
                    <th>Délai</th>
                    <th>Coût</th>
                    <th>Indicateur</th>
                </tr>
            </thead>
            <tbody>
    `;

    planActions.forEach(action => {
        contenu += `
            <tr>
                <td>${action.risque}</td>
                <td>${action.action}</td>
                <td>${action.priorite}</td>
                <td>${action.delai}</td>
                <td>${action.cout}</td>
                <td>${action.indicateur}</td>
            </tr>
        `;
    });

    contenu += `
            </tbody>
        </table>
    `;

    const blob = new Blob(
        [contenu],
        { type: "application/vnd.ms-excel" }
    );

    const url = URL.createObjectURL(blob);

    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "plan-action-adaptation.xls";
    lien.click();

    URL.revokeObjectURL(url);
}

function preparerExportPDFAdaptation() {

    if (!planActions || planActions.length === 0) {
        alert("Aucun diagnostic à exporter.");
        return;
    }

    const diagnostic =
        document.getElementById("actionsAdaptation")?.innerHTML || "";

    const plan =
        document.getElementById("planActionAdaptation")?.innerHTML || "";

    const ville =
        document.getElementById("ville")?.value || "Territoire";

    const fenetre = window.open("", "_blank");

    fenetre.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Rapport adaptation climatique - ${ville}</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #1f2937;
                }

                h1 {
                    color: #14532d;
                    border-bottom: 3px solid #14532d;
                    padding-bottom: 10px;
                }

                h2, h3, h4 {
                    color: #166534;
                }

                .alert {
                    border: 1px solid #ddd;
                    padding: 12px;
                    margin-bottom: 12px;
                    border-radius: 6px;
                }

                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    padding: 15px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }

                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    font-size: 12px;
                }

                th {
                    background: #f3f4f6;
                }

                .text-muted {
                    color: #6b7280;
                }

                button {
                    display: none;
                }

                @media print {
                    body {
                        margin: 20mm;
                    }
                }
            </style>
        </head>

        <body>

            <h1>Rapport territorial d’adaptation climatique</h1>

            <p>
                <strong>Territoire étudié :</strong> ${ville}
            </p>

            <p>
                Ce rapport présente une première synthèse des vulnérabilités
                climatiques du territoire et un plan d’action d’adaptation
                inspiré de la logique TACCT ADEME.
            </p>

            ${diagnostic}

            ${plan}

            <p class="text-muted">
                Rapport généré automatiquement par la plateforme VertClair Conseils.
            </p>

            <script>
                window.print();
            </script>

        </body>
        </html>
    `);

    fenetre.document.close();
}

window.exporterPlanAdaptationCSV = exporterPlanAdaptationCSV;
window.exporterPlanAdaptationExcel = exporterPlanAdaptationExcel;
window.preparerExportPDFAdaptation = preparerExportPDFAdaptation;