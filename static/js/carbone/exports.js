function telechargerImage() {

    const canvas =
        document.getElementById("graphCarbone");

    if (!canvas) {

        alert("Canvas graphique introuvable");
        return;
    }

    if (!graphiqueCarbone) {

        alert(
            "Veuillez d'abord afficher le graphique"
        );

        return;
    }

    const lien =
        document.createElement("a");

    lien.download =
        "bilan-carbone.png";

    lien.href =
        canvas.toDataURL("image/png");

    document.body.appendChild(lien);

    lien.click();

    document.body.removeChild(lien);
}


function telechargerCSV() {

    const mois =
        document.getElementById("mois").value
        || "sans-mois";

    let csv =
        "Rubrique;Poste;Consommation;CO2 kg\n";

    document.querySelectorAll("tbody tr")
    .forEach(function (row) {

        const rubrique =
            row.cells[0].innerText.trim();

        const poste =
            row.cells[1].innerText.trim();

        const consommation =
            row.querySelector(".conso").value || 0;

        const co2 =
            row.querySelector(".result").innerText || 0;

        csv +=
            `${rubrique};${poste};${consommation};${co2}\n`;
    });

    const blob = new Blob(
        ["\uFEFF" + csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const lien =
        document.createElement("a");

    lien.href =
        URL.createObjectURL(blob);

    lien.download =
        "bilan-carbone-" + mois + ".csv";

    document.body.appendChild(lien);

    lien.click();

    document.body.removeChild(lien);

    URL.revokeObjectURL(lien.href);
}


function exporterExcel() {

    telechargerCSV();
}


window.telechargerImage = telechargerImage;

window.telechargerCSV = telechargerCSV;

window.exporterExcel = exporterExcel;