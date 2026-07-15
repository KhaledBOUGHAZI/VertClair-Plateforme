function afficherStatsDPE(stats){

    const total =
        stats.A +
        stats.B +
        stats.C +
        stats.D +
        stats.E +
        stats.F +
        stats.G;

    const passoires =
        stats.F + stats.G;

    const tauxPassoires =
        total > 0
        ? ((passoires / total) * 100).toFixed(1)
        : 0;

    let classeDominante = "D";
    let maxClasse = 0;

    for(const classe in stats){

        if(stats[classe] > maxClasse){
            maxClasse = stats[classe];
            classeDominante = classe;
        }
    }

    document.getElementById("syntheseDPE").innerHTML = `
        <h4>📊 Synthèse énergétique territoriale</h4>

        <div class="row mt-4">

            <div class="col-md-3">
                <div class="card p-3 shadow-sm">
                    <h5>Total DPE</h5>
                    <h2>${total}</h2>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card p-3 shadow-sm">
                    <h5>Passoires F/G</h5>
                    <h2>${passoires}</h2>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card p-3 shadow-sm">
                    <h5>% passoires</h5>
                    <h2>${tauxPassoires}%</h2>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card p-3 shadow-sm">
                    <h5>Classe dominante</h5>
                    <h2>${classeDominante}</h2>
                </div>
            </div>

        </div>

        <hr>

        <h5>🧠 Analyse automatique</h5>

        <p>
            La commune présente <strong>${passoires}</strong> passoires thermiques.
            La classe dominante est <strong>${classeDominante}</strong>.
            Le taux de bâtiments énergivores atteint
            <strong>${tauxPassoires}%</strong>.
        </p>

        <ul>
            <li>Isolation thermique prioritaire</li>
            <li>Pilotage énergétique recommandé</li>
            <li>Réduction des besoins de chauffage</li>
            <li>Amélioration du confort d’été</li>
        </ul>
    `;

    document.getElementById("statsCarteDPE").innerHTML = `
        <strong>Nombre de DPE affichés :</strong>
        A:${stats.A} | B:${stats.B} | C:${stats.C} |
        D:${stats.D} | E:${stats.E} |
        F:${stats.F} | G:${stats.G}
    `;
}

window.afficherStatsDPE = afficherStatsDPE;