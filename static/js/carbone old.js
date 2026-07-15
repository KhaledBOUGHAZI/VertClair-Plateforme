let graphiqueCarbone = null;

document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".conso");
    const totalSpan = document.getElementById("total");

    function calculCO2() {
        let total = 0;

        inputs.forEach(function (input) {
            const conso = parseFloat(input.value) || 0;
            const coeff = parseFloat(input.dataset.coeff) || 0;
            const resultat = conso * coeff;

            const ligne = input.closest("tr");
            const resultSpan = ligne.querySelector(".result");

            resultSpan.textContent = resultat.toFixed(2);
            total += resultat;
        });

        totalSpan.textContent = total.toFixed(2);
    }

    inputs.forEach(function (input) {
        input.addEventListener("input", calculCO2);
        input.addEventListener("change", calculCO2);
    });

    calculCO2();
});


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

    fetch("/save_carbon/", {
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

    if (mode === "total") {
        const total = parseFloat(document.getElementById("total").innerText) || 0;

        graphiqueCarbone = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [formatMois(mois)],
                datasets: [{
                    label: "Total kg CO₂",
                    data: [total]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Total carbone mensuel - " + formatMois(mois)
                    },
                    datalabels: {
                        anchor: "end",
                        align: "top",
                        formatter: function (value) {
                            return value.toFixed(0);
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "kg de CO₂",
                            align: "start"
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    if (mode === "postes") {
        const labels = [];
        const valeurs = [];

        document.querySelectorAll("tbody tr").forEach(function (row) {
            let poste = row.cells[1].innerText;

            if (poste.length > 30) {
                poste = poste.substring(0, 30) + "...";
            }

            labels.push(poste);
            valeurs.push(parseFloat(row.querySelector(".result").innerText) || 0);
        });

        graphiqueCarbone = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "kg CO₂ par poste",
                    data: valeurs
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Détail par poste - " + formatMois(mois)
                    },
                    datalabels: {
                        anchor: "end",
                        align: "top",
                        formatter: function (value) {
                            return value.toFixed(0);
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 30,
                            autoSkip: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "kg de CO₂ par poste",
                            align: "start"
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
}


function afficherGraphiqueAnnuel(mode) {
    fetch("/get_bilans_carbone/")
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

            if (mode === "total") {
                graphiqueCarbone = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: data.bilans.map(bilan => formatMois(bilan.mois)),
                        datasets: [{
                            label: "Total mensuel kg CO₂",
                            data: data.bilans.map(bilan => bilan.total),
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: "Évolution annuelle du total carbone"
                            },
                            datalabels: {
                                align: "top",
                                formatter: function (value) {
                                    return value.toFixed(0);
                                }
                            }
                        },
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: "kg de CO₂",
                                    align: "start"
                                }
                            }
                        }
                    },
                    plugins: [ChartDataLabels]
                });
            }

            if (mode === "postes") {
                const moisLabels = data.bilans.map(bilan => formatMois(bilan.mois));
                const postes = new Set();

                data.bilans.forEach(function (bilan) {
                    bilan.lignes.forEach(function (ligne) {
                        postes.add(ligne.poste);
                    });
                });

                const datasets = Array.from(postes).map(function (poste) {
                    let labelCourt = poste;

                    if (labelCourt.length > 30) {
                        labelCourt = labelCourt.substring(0, 30) + "...";
                    }

                    return {
                        label: labelCourt,
                        data: data.bilans.map(function (bilan) {
                            const ligne = bilan.lignes.find(l => l.poste === poste);
                            return ligne ? ligne.co2 : 0;
                        })
                    };
                });

                graphiqueCarbone = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: moisLabels,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: "Évolution annuelle par poste"
                            },
                            datalabels: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                stacked: true
                            },
                            y: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: "kg de CO₂ par poste",
                                    align: "start"
                                }
                            }
                        }
                    },
                    plugins: [ChartDataLabels]
                });
            }
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


function telechargerImage() {
    const canvas = document.getElementById("graphCarbone");

    if (!graphiqueCarbone) {
        alert("Veuillez d'abord afficher le graphique");
        return;
    }

    const lien = document.createElement("a");
    lien.download = "bilan-carbone.png";
    lien.href = canvas.toDataURL("image/png");
    lien.click();
}


function telechargerCSV() {
    const mois = document.getElementById("mois").value || "sans-mois";

    let csv = "Rubrique;Poste;Consommation;CO2 kg\n";

    document.querySelectorAll("tbody tr").forEach(function (row) {
        const rubrique = row.cells[0].innerText;
        const poste = row.cells[1].innerText;
        const consommation = row.querySelector(".conso").value || 0;
        const co2 = row.querySelector(".result").innerText || 0;

        csv += `${rubrique};${poste};${consommation};${co2}\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(blob);
    lien.download = "bilan-carbone-" + mois + ".csv";
    lien.click();
}