function enregistrer() {

    const mois = document.getElementById("mois").value;

    if (!mois) {
        alert("Veuillez choisir un mois");
        return;
    }

    const lignes = [];

    document.querySelectorAll("tbody tr").forEach(function (row) {
        lignes.push({
            rubrique: row.cells[0].innerText,
            poste: row.cells[1].innerText,
            consommation: parseFloat(row.querySelector(".conso").value) || 0,
            co2: parseFloat(row.querySelector(".result").innerText) || 0
        });
    });

    fetch("/api/save-carbon/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mois: mois,
            lignes: lignes
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("✅ Bilan enregistré !");
    })
    .catch(error => {
        console.error(error);
        alert("❌ Erreur lors de l'enregistrement");
    });
}

window.enregistrer = enregistrer;