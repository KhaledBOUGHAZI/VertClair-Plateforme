function lancerSimulation() {
    changerFenny(
        "reflechir",
        "📈 Simulons des actions écologiques."
    );

    afficherTexte(`
        <h4>📈 Comment améliorer votre score ?</h4>
        <p>Choisissez une action pour voir son effet potentiel sur le territoire.</p>

        <button class="btn btn-outline-success me-2 mb-2" onclick="appliquerSimulation('haies')">
            🌳 Planter des haies
        </button>

        <button class="btn btn-outline-primary me-2 mb-2" onclick="appliquerSimulation('eau')">
            💧 Restaurer une zone humide
        </button>

        <button class="btn btn-outline-warning me-2 mb-2" onclick="appliquerSimulation('sol')">
            🏡 Désimperméabiliser les sols
        </button>

        <button class="btn btn-outline-secondary me-2 mb-2" onclick="reinitialiserSimulation()">
            🔄 Réinitialiser la simulation
        </button>

        <div id="resultat-simulation" class="mt-3"></div>
    `);
}

function appliquerSimulation(action) {
    const resultat = document.getElementById("resultat-simulation");
    const scoreBar = document.getElementById("score-bar");

    if (actionsSimulees.includes(action)) {
        resultat.innerHTML = `
            <div class="alert alert-info">
                Cette action a déjà été prise en compte dans la simulation.
            </div>
        `;
        return;
    }

    actionsSimulees.push(action);

    let gain = 0;
    let message = "";

    if (action === "haies") {
        gain = 5;
        message = "Les haies facilitent le déplacement des espèces et améliorent les continuités écologiques.";
    }

    if (action === "eau") {
        gain = 8;
        message = "Les zones humides stockent l’eau, accueillent la biodiversité et peuvent limiter certains effets des inondations.";
    }

    if (action === "sol") {
        gain = 6;
        message = "La désimperméabilisation permet à l’eau de mieux s’infiltrer et réduit le ruissellement.";
    }

    let scoreActuel = parseInt(scoreBar.innerHTML);
    let nouveauScore = Math.min(scoreActuel + gain, 100);

    scoreBar.style.width = nouveauScore + "%";
    scoreBar.innerHTML = nouveauScore + " / 100";

    resultat.innerHTML = `
        <div class="alert alert-success">
            <strong>Impact simulé : +${gain} points</strong><br>
            ${message}
        </div>
    `;

    changerFenny(
        "heureux",
        `🌿 +${gain} points ! Belle action.`
    );
}

function reinitialiserSimulation() {
    const scoreBar = document.getElementById("score-bar");
    const resultat = document.getElementById("resultat-simulation");

    actionsSimulees = [];

    scoreBar.style.width = scoreInitial + "%";
    scoreBar.innerHTML = scoreInitial + " / 100";

    if (resultat) {
        resultat.innerHTML = `
            <div class="alert alert-secondary">
                La simulation a été réinitialisée.
            </div>
        `;
    }

    modeIdle();
}

window.lancerSimulation = lancerSimulation;
window.appliquerSimulation = appliquerSimulation;
window.reinitialiserSimulation = reinitialiserSimulation;