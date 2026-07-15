function lancerQuiz() {
    changerFenny(
        "quiz",
        "🎯 Petite question écologique..."
    );

    afficherTexte(`
        <h4>🎯 Mini quiz</h4>
        <p>À quoi sert principalement une zone humide ?</p>

        <button class="btn btn-outline-secondary me-2 mb-2" onclick="repondreQuiz(false)">
            À construire plus facilement
        </button>

        <button class="btn btn-outline-success me-2 mb-2" onclick="repondreQuiz(true)">
            À stocker l’eau et accueillir la biodiversité
        </button>

        <button class="btn btn-outline-secondary me-2 mb-2" onclick="repondreQuiz(false)">
            À supprimer les moustiques
        </button>

        <div id="reponse-quiz" class="mt-3"></div>
    `);
}

function repondreQuiz(estBonneReponse) {
    const reponse = document.getElementById("reponse-quiz");

    if (estBonneReponse) {
        changerFenny(
            "sauter",
            "🎉 Bravo ! Bonne réponse."
        );

        reponse.innerHTML = `
            <div class="alert alert-success">
                Bravo ✅ ! Une zone humide stocke l’eau, limite parfois les inondations et accueille une biodiversité très riche.
            </div>
        `;

    } else {
        changerFenny(
            "quiz",
            "😅 Pas tout à fait..."
        );

        reponse.innerHTML = `
            <div class="alert alert-warning">
                Pas exactement 😉. Une zone humide agit plutôt comme une éponge naturelle du territoire.
            </div>
        `;
    }
}

window.lancerQuiz = lancerQuiz;
window.repondreQuiz = repondreQuiz;