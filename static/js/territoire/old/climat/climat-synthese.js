function afficherSyntheseTerritoriale(data) {

    const zone =
        document.getElementById("planActionAdaptation");

    if (!zone) return;

    const score =
        data.risques?.score_vulnerabilite ||
        data.score_vulnerabilite ||
        50;

    let niveau = "modérée";

    if (score >= 70) {
        niveau = "élevée";
    } else if (score < 40) {
        niveau = "faible";
    }

    zone.innerHTML += `
        <div class="card shadow-sm p-4 mb-4">

            <h4>🧭 Synthèse territoriale VertClair</h4>

            <p>
                Le territoire présente une vulnérabilité climatique
                <strong>${niveau}</strong>.
            </p>

            <p>
                Les priorités doivent porter sur la réduction de l’exposition
                aux aléas, l’adaptation des bâtiments, la gestion de l’eau
                et le renforcement de la résilience des espaces publics.
            </p>

        </div>
    `;
}

window.afficherSyntheseTerritoriale =
    afficherSyntheseTerritoriale;