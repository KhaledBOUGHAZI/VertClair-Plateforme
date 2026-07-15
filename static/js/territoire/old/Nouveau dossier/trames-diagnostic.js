var actionsSimulees = [];
var scoreInitial = 0;

function genererDiagnostic(commune) {
    actionsSimulees = [];

    const diagnostic = document.getElementById("diagnostic");
    const contenu = document.getElementById("diagnostic-content");
    const scoreBar = document.getElementById("score-bar");

    diagnostic.style.display = "block";

    let score = 68;
    let theme = "biodiversité locale";

    const communeMin = commune.toLowerCase();

    if (communeMin.includes("arles")) {
        score = 82;
        theme = "zones humides et biodiversité";
    } else if (communeMin.includes("fontainebleau")) {
        score = 82;
        theme = "forêt et continuités écologiques";
    } else if (communeMin.includes("chamonix")) {
        score = 82;
        theme = "montagne, eau et milieux sensibles";
    } else if (communeMin.includes("la rochelle")) {
        score = 82;
        theme = "littoral, eau et biodiversité";
    } else if (
        communeMin.includes("paris") ||
        communeMin.includes("lyon") ||
        communeMin.includes("marseille")
    ) {
        score = 55;
        theme = "urbanisation et renaturation";
    }

    scoreInitial = score;

    scoreBar.style.width = score + "%";
    scoreBar.innerHTML = score + " / 100";

    contenu.innerHTML = `
        <ul>
            <li>✓ Présence possible d’espaces naturels remarquables.</li>
            <li>✓ Enjeux de continuités écologiques à proximité.</li>
            <li>✓ Sensibilité potentielle liée à l’eau et aux milieux humides.</li>
            <li>✓ Présence possible de biodiversité remarquable.</li>
            <li>✓ Thématique principale identifiée : <strong>${theme}</strong>.</li>
        </ul>
    `;
}

function genererSynthese() {
    const scoreBar = document.getElementById("score-bar");

    let scoreFinal = parseInt(scoreBar.innerHTML);

    let actionsTexte = actionsSimulees
        .map(a => {
            if (a === "haies") return "🌳 plantation de haies";
            if (a === "eau") return "💧 restauration de zone humide";
            if (a === "sol") return "🏡 désimperméabilisation des sols";
            return a;
        })
        .join(", ");

    if (actionsTexte === "") {
        actionsTexte = "Aucune action simulée";
    }

    afficherTexte(`
        <h4>📄 Mini diagnostic écologique</h4>

        <div class="alert alert-success">
            <p>
                <strong>Score écologique simulé :</strong>
                ${scoreFinal} / 100
            </p>

            <p>
                <strong>Actions prises en compte :</strong><br>
                ${actionsTexte}
            </p>
        </div>

        <p>
            🌍 Ce diagnostic simplifié permet d’illustrer comment certaines actions locales peuvent améliorer la qualité écologique d’un territoire.
        </p>
    `);

    changerFenny(
        "decouvrir",
        "📄 Ton mini diagnostic est prêt !"
    );
}

window.genererDiagnostic = genererDiagnostic;
window.genererSynthese = genererSynthese;