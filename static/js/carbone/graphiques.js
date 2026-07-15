var graphiqueCarbone = null;

function afficherGraphiqueGlobal() {
    const periode = document.getElementById("periodeGraphique").value;
    const mode = document.getElementById("modeGraphique").value;

    if (periode === "mensuel") {
        afficherGraphiqueMensuel(mode);
    }

    if (periode === "annuel") {
        afficherGraphiqueAnnuel(mode);
    }
}

function afficherGraphiqueMensuel(mode) {
    const mois = document.getElementById("mois").value;

    if (!mois) {
        alert("Veuillez choisir un mois");
        return;
    }

    const ctx = document.getElementById("graphCarbone");

    if (graphiqueCarbone !== null) {
        graphiqueCarbone.destroy();
    }

    if (mode === "postes") {
        afficherGraphiqueMensuelParPostes(ctx);
        return;
    }

    const total = parseFloat(document.getElementById("total").innerText) || 0;

    graphiqueCarbone = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [formatMois(mois)],
            datasets: [{
                label: "Total kg CO₂e",
                data: [total]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function afficherGraphiqueMensuelParPostes(ctx) {
    const postes = [];

    document.querySelectorAll(".conso").forEach(function(input) {
        const ligne = input.closest("tr");
        if (!ligne) return;

        const poste = ligne.children[1]?.innerText || "";
        const resultat = parseFloat(ligne.querySelector(".result")?.innerText) || 0;

        if (resultat > 0) {
            postes.push({
                nom: poste,
                co2: resultat
            });
        }
    });

    postes.sort(function(a, b) {
        return b.co2 - a.co2;
    });

    graphiqueCarbone = new Chart(ctx, {
        type: "bar",
        data: {
            labels: postes.map(p => p.nom),
            datasets: [{
                label: "kg CO₂e",
                data: postes.map(p => p.co2)
            }]
        },
        options: {
            responsive: true,
            indexAxis: "y"
        }
    });
}

function afficherGraphiqueAnnuel(mode) {
    fetch("/api/bilans-carbone/")
        .then(response => response.json())
        .then(data => {
            if (!data.bilans || data.bilans.length === 0) {
                alert("Aucune donnée enregistrée");
                return;
            }

            const ctx = document.getElementById("graphCarbone");

            if (graphiqueCarbone !== null) {
                graphiqueCarbone.destroy();
            }

            graphiqueCarbone = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.bilans.map(bilan => formatMois(bilan.mois)),
                    datasets: [{
                        label: "Total mensuel kg CO₂e",
                        data: data.bilans.map(bilan => bilan.total),
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true
                }
            });
        })
        .catch(error => {
            console.error(error);
            alert("❌ Erreur chargement graphique annuel");
        });
}

function formatMois(mois) {
    const date = new Date(mois + "-01");

    return date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "2-digit"
    });
}

window.afficherGraphiqueGlobal = afficherGraphiqueGlobal;
window.afficherGraphiqueMensuel = afficherGraphiqueMensuel;
window.afficherGraphiqueAnnuel = afficherGraphiqueAnnuel;