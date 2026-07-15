let map = null;
let markerCommune = null;

let graphiquesEauPotable = [];
let graphiquesRivieres = [];

/* =========================
CARTE
========================= */

function initMap() {
    if (map !== null) return;

    map = L.map("map").setView([46.6, 2.4], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);
}

function afficherCommuneSurCarte(data) {
    if (!data.centre) return;

    const lat = data.centre.coordinates[1];
    const lon = data.centre.coordinates[0];

    map.setView([lat, lon], 12);

    if (markerCommune) {
        map.removeLayer(markerCommune);
    }

    markerCommune = L.marker([lat, lon]).addTo(map);
    markerCommune.bindPopup(`<strong>${data.commune}</strong>`).openPopup();
}

/* =========================
AIR
========================= */

function qualiteDepuisCode(code) {
    const niveaux = {
        0: "Absent",
        1: "Bon",
        2: "Moyen",
        3: "Dégradé",
        4: "Mauvais",
        5: "Très mauvais",
        6: "Extrêmement mauvais",
        7: "Évènement"
    };

    return niveaux[code] || "Non disponible";
}

function couleurDepuisCode(code) {
    const couleurs = {
        1: "#45d9d0",
        2: "#ffe033",
        3: "#ff9f1c",
        4: "#ff4d4f",
        5: "#9c27b0",
        6: "#8b0038",
        7: "#9e9e9e"
    };

    return couleurs[code] || "#cccccc";
}

function pastille(code) {
    return `
        <span style="
            display:inline-block;
            width:14px;
            height:14px;
            border-radius:50%;
            background:${couleurDepuisCode(code)};
            margin-right:8px;
            vertical-align:middle;
        "></span>
    `;
}

function lignePolluant(nom, code) {
    return `
        <p>
            ${nom} :
            ${pastille(code)}
            ${qualiteDepuisCode(code)}
        </p>
    `;
}

function chargerQualiteAir() {
    const ville = document.getElementById("ville").value.trim();
    const resultatAir = document.getElementById("resultatAir");

    initMap();

    if (!ville) {
        alert("Veuillez entrer une ville");
        return;
    }

    resultatAir.innerHTML = `
        <div class="alert alert-info">
            Chargement des données pour ${ville}...
        </div>
    `;

    fetch("/api/indice-air/?ville=" + encodeURIComponent(ville))
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultatAir.innerHTML = `
                    <div class="alert alert-warning">${data.error}</div>
                `;
                return;
            }

            afficherCommuneSurCarte(data);

            if (!data.atmo || !data.atmo.features || data.atmo.features.length === 0) {
                resultatAir.innerHTML = `
                    <div class="alert alert-warning">
                        Aucune donnée Atmo disponible.
                    </div>
                `;
                return;
            }

            const infos = data.atmo.features[0].properties;

            resultatAir.innerHTML = `
                <h3 class="mb-1">${data.commune}</h3>

                <p style="color:#666; font-size:14px; margin-bottom:25px;">
                    Indices de qualité de l’air du ${infos.date_ech || new Date().toLocaleDateString("fr-FR")}
                </p>

                <div class="row mt-4">

                    <div class="col-md-6">
                        <p>
                            <strong>Qualité de l’air :</strong>
                            ${pastille(infos.code_qual)}
                            ${infos.lib_qual || qualiteDepuisCode(infos.code_qual)}
                        </p>

                        ${lignePolluant("NO₂", infos.code_no2)}
                        ${lignePolluant("O₃", infos.code_o3)}
                        ${lignePolluant("PM10", infos.code_pm10)}
                        ${lignePolluant("PM2.5", infos.code_pm25)}
                    </div>

                    <div class="col-md-6 border-start ps-4">
                        <h6 class="mb-3">Échelle de qualité de l’air</h6>
                        <p>${pastille(1)} 1 = Bon</p>
                        <p>${pastille(2)} 2 = Moyen</p>
                        <p>${pastille(3)} 3 = Dégradé</p>
                        <p>${pastille(4)} 4 = Mauvais</p>
                        <p>${pastille(5)} 5 = Très mauvais</p>
                        <p>${pastille(6)} 6 = Extrêmement mauvais</p>
                        <p>${pastille(7)} 7 = Évènement</p>
                    </div>

                </div>

                <hr class="mt-4">

                <p style="font-weight:bold; text-align:right; margin-top:15px; color:#555;">
                    Source des données : Atmo France / AASQA
                </p>
            `;
        })
        .catch(error => {
            console.error(error);

            resultatAir.innerHTML = `
                <div class="alert alert-danger">
                    Erreur lors du chargement des données Air.
                </div>
            `;
        });
}

/* =========================
EAU — VALEURS / SEUILS
========================= */

function getValeur(item) {
    return (
        item.resultat_alphanumerique ||
        item.resultat_numerique ||
        item.resultat ||
        "Non renseigné"
    );
}

function getValeurNumerique(item) {
    const brut = String(getValeur(item))
        .replace(",", ".")
        .replace("<", "")
        .trim();

    const valeur = parseFloat(brut);

    if (isNaN(valeur)) return null;

    return valeur;
}

function getSeuil(nomParametre) {
    const nom = (nomParametre || "").toLowerCase();

    if (nom.includes("nitrate")) return "50 mg/L";
    if (nom.includes("nitrite")) return "0,5 mg/L";
    if (nom.includes("pesticide")) return "0,1 µg/L";
    if (nom.includes("ammonium")) return "0,1 mg/L";
    if (nom.includes("ph")) return "6,5 à 9";
    if (nom.includes("conductivité")) return "2 500 µS/cm";
    if (nom.includes("plomb")) return "10 µg/L";
    if (nom.includes("arsenic")) return "10 µg/L";
    if (nom.includes("cadmium")) return "5 µg/L";
    if (nom.includes("nickel")) return "20 µg/L";
    if (nom.includes("mercure")) return "1 µg/L";

    return "Non disponible";
}

function getUnite(nomParametre) {
    const nom = (nomParametre || "").toLowerCase();

    if (nom.includes("nitrate")) return "mg/L";
    if (nom.includes("nitrite")) return "mg/L";
    if (nom.includes("pesticide")) return "µg/L";
    if (nom.includes("ammonium")) return "mg/L";
    if (nom.includes("conductivité")) return "µS/cm";
    if (nom.includes("ph")) return "pH";
    if (nom.includes("température")) return "°C";
    if (nom.includes("plomb")) return "µg/L";
    if (nom.includes("arsenic")) return "µg/L";
    if (nom.includes("cadmium")) return "µg/L";
    if (nom.includes("nickel")) return "µg/L";
    if (nom.includes("mercure")) return "µg/L";

    return "Valeur";
}

function getLimiteNumerique(nomParametre) {
    const nom = (nomParametre || "").toLowerCase();

    if (nom.includes("nitrate")) return 50;
    if (nom.includes("nitrite")) return 0.5;
    if (nom.includes("pesticide")) return 0.1;
    if (nom.includes("ammonium")) return 0.1;
    if (nom.includes("conductivité")) return 2500;
    if (nom.includes("ph")) return 9;
    if (nom.includes("plomb")) return 10;
    if (nom.includes("arsenic")) return 10;
    if (nom.includes("cadmium")) return 5;
    if (nom.includes("nickel")) return 20;
    if (nom.includes("mercure")) return 1;

    return null;
}

/* =========================
GRAPHIQUES EAU
========================= */

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

function chargerDonneesEau() {
    const ville = document.getElementById("ville").value.trim();
    const blocEaux = document.getElementById("resultat-eaux");.

    initMap();

    if (!ville) {
        alert("Veuillez entrer une ville");
        return;
    }

    blocEaux.style.display = "block";

    fetch("/api/eaux/?ville=" + encodeURIComponent(ville))
        .then(response => response.json())
        .then(data => {
            console.log("DONNÉES EAU :", data);

            if (data.error) {
                document.getElementById("eau-potable").innerHTML = `
                    <div class="alert alert-warning">
                        ${data.error}
                    </div>
                `;
                return;
            }

            document.getElementById("eaux-commune").textContent = data.commune;
            document.getElementById("eaux-insee").textContent = data.code_insee;

            afficherCommuneSurCarte(data);

            document.getElementById("eau-potable").innerHTML = `
                <div class="alert alert-light border mt-3">
                    <p><strong>Dernier prélèvement :</strong> ${data.dernier_prelevement || "Non disponible"}</p>
                    <p><strong>Conclusion sanitaire :</strong> ${data.conclusion || "Non disponible"}</p>
                </div>

                <div id="graphiques-eau-potable"></div>
            `;

            afficherGraphiquesEauPotableTroisAns(data.eau_potable || []);

            if (data.analyses_rivieres && data.analyses_rivieres.length > 0) {
                graphiquesRivieres.forEach(graph => graph.destroy());
                graphiquesRivieres = [];

                let htmlRivieres = `
                    <div class="mt-3">
                        <h5>Qualité des rivières par station</h5>
                `;

                data.analyses_rivieres.forEach((bloc, index) => {
                    const station = bloc.station;

                    htmlRivieres += `
                        <div class="card border-0 shadow-sm p-3 mt-3">
                            <h6>${station.libelle_station || "Station non renseignée"}</h6>

                            <p>
                                <strong>Code station :</strong>
                                ${station.code_station || "Non renseigné"}
                            </p>

                            <div id="graph-station-${index}"></div>
                        </div>
                    `;
                });

                htmlRivieres += `</div>`;

                document.getElementById("rivieres").innerHTML = htmlRivieres;

                data.analyses_rivieres.forEach((bloc, index) => {
                    afficherGraphiquesRivieresStation(
                        bloc.analyses || [],
                        `graph-station-${index}`
                    );
                });

            } else {
                document.getElementById("rivieres").innerHTML = `
                    <div class="alert alert-secondary mt-3">
                        Aucune analyse rivière trouvée.
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error(error);

            document.getElementById("rivieres").innerHTML = `
                <div class="alert alert-danger">
                    Erreur lors de la récupération des données eaux.
                </div>
            `;
        });
}