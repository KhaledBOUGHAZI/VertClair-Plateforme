function afficherDiagnosticCouchesReelles() {

    const zone = document.getElementById("diagnosticCouchesReelles");

    if (!zone) return;

    const nappes =
        document.getElementById("toggleRemonteesNappes")?.checked;

    const inondation =
        document.getElementById("toggleZonesInondablesTRI")?.checked;

    const argiles =
        document.getElementById("toggleArgiles")?.checked;

    const mouvements =
        document.getElementById("toggleMouvementsTerrain")?.checked;

    let lignes = [];

    if (nappes) {
        lignes.push("💧 Sensibilité potentielle aux remontées de nappes.");
    }

    if (inondation) {
        lignes.push("🌊 Commune concernée par un PPR inondation approuvé.");
    }

    if (argiles) {
        lignes.push("🧱 Exposition possible au retrait-gonflement des argiles.");
    }

    if (mouvements) {
        lignes.push("⛰️ Présence possible de mouvements de terrain recensés.");
    }

    if (lignes.length === 0) {
        zone.innerHTML = "";
        return;
    }

    zone.innerHTML = `
        <div class="alert alert-warning">
            <strong>Lecture des couches réelles :</strong>
            <ul class="mb-0 mt-2">
                ${lignes.map(ligne => `<li>${ligne}</li>`).join("")}
            </ul>
        </div>
    `;
}

window.afficherDiagnosticCouchesReelles = afficherDiagnosticCouchesReelles;