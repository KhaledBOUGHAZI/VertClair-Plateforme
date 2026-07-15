var graphiquesEauPotable = [];
var graphiquesRivieres = [];

function creerGraphique(containerId, valeurs, nomParametre, index) {
    const labels = valeurs.map(item =>
        new Date(item.date_prelevement).toLocaleDateString("fr-FR")
    );

    const dataValeurs = valeurs.map(item => item.valeur_moyenne);
    const limite = getLimiteNumerique(nomParametre);

    const datasets = [
        {
            label: "Valeur mesurée moyenne",
            data: dataValeurs,
            type: "line",
            tension: 0.3,
            pointRadius: 5,
            borderWidth: 3
        }
    ];

    if (limite !== null) {
        datasets.push({
            label: "Limite réglementaire",
            data: labels.map(() => limite),
            type: "line",
            borderDash: [6, 6],
            pointRadius: 0,
            borderWidth: 2
        });
    }

    return new Chart(
        document.getElementById(`${containerId}-${index}`),
        {
            type: "line",
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: getUnite(nomParametre)
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Dates de prélèvement"
                        }
                    }
                }
            }
        }
    );
}

function preparerDonneesGraphiques(analyses) {
    const analysesValides = (analyses || []).filter(item => {
        const valeur = getValeurNumerique(item);

        return (
            item.libelle_parametre &&
            item.date_prelevement &&
            valeur !== null
        );
    });

    const groupes = {};

    analysesValides.forEach(item => {
        const nom = item.libelle_parametre;

        if (!groupes[nom]) {
            groupes[nom] = [];
        }

        groupes[nom].push(item);
    });

    return groupes;
}

function transformerGroupeEnValeurs(groupe) {
    const parDate = {};

    groupe.forEach(item => {
        const date = new Date(item.date_prelevement)
            .toISOString()
            .slice(0, 10);

        const valeur = getValeurNumerique(item);

        if (valeur === null) return;

        if (!parDate[date]) {
            parDate[date] = [];
        }

        parDate[date].push(valeur);
    });

    return Object.keys(parDate)
        .sort()
        .map(date => {
            const valeursJour = parDate[date];

            const moyenne =
                valeursJour.reduce((a, b) => a + b, 0) /
                valeursJour.length;

            return {
                date_prelevement: date,
                valeur_moyenne: moyenne
            };
        });
}

function afficherGraphiquesEauPotableTroisAns(analyses) {
    const container = document.getElementById("graphiques-eau-potable");
    if (!container) return;

    graphiquesEauPotable.forEach(graph => graph.destroy());
    graphiquesEauPotable = [];
    container.innerHTML = "";

    const groupes = preparerDonneesGraphiques(analyses || []);

    Object.keys(groupes).slice(0, 8).forEach((nomParametre, index) => {
        const valeurs = transformerGroupeEnValeurs(groupes[nomParametre]);

        if (valeurs.length < 1) return;

        const bloc = document.createElement("div");
        bloc.className = "card border-0 shadow-sm p-3 mt-3";

        bloc.innerHTML = `
            <h6>${nomParametre}</h6>
            <p class="text-muted">
                Dernières valeurs disponibles — limite : ${getSeuil(nomParametre)}
            </p>
            <canvas id="graph-eau-${index}" height="120"></canvas>
        `;

        container.appendChild(bloc);

        const graphique = creerGraphique(
            "graph-eau",
            valeurs,
            nomParametre,
            index
        );

        graphiquesEauPotable.push(graphique);
    });

    if (container.innerHTML === "") {
        container.innerHTML = `
            <div class="alert alert-secondary mt-3">
                Aucun graphique eau potable disponible.
            </div>
        `;
    }
}

function afficherGraphiquesRivieresStation(analyses, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const groupes = preparerDonneesGraphiques(analyses || []);

    Object.keys(groupes).slice(0, 6).forEach((nomParametre, index) => {
        const valeurs = transformerGroupeEnValeurs(groupes[nomParametre]);

        if (valeurs.length < 1) return;

        const bloc = document.createElement("div");
        bloc.className = "card border-0 shadow-sm p-3 mt-3";

        bloc.innerHTML = `
            <h6>${nomParametre}</h6>
            <p class="text-muted">
                Dernières valeurs disponibles — limite : ${getSeuil(nomParametre)}
            </p>
            <canvas id="${containerId}-${index}" height="120"></canvas>
        `;

        container.appendChild(bloc);

        const graphique = creerGraphique(
            containerId,
            valeurs,
            nomParametre,
            index
        );

        graphiquesRivieres.push(graphique);
    });

    if (container.innerHTML === "") {
        container.innerHTML = `
            <div class="alert alert-secondary mt-3">
                Aucun graphique disponible pour cette station.
            </div>
        `;
    }
}

/* =========================
EAU
========================= */

window.afficherGraphiquesEauPotableTroisAns = afficherGraphiquesEauPotableTroisAns;
window.afficherGraphiquesRivieresStation = afficherGraphiquesRivieresStation;