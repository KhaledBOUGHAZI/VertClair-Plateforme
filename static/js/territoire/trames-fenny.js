function changerFenny(etat, message) {
    const fenny = document.getElementById("fenny");
    const texte = document.getElementById("fenny-texte");

    if (fenny) {
        fenny.src = `/static/images/fenny/fenny_${etat}.png`;
    }

    if (texte && message) {
        texte.innerHTML = message;
    }
}

function modeIdle() {
    changerFenny(
        "neutre",
        "🌿 La biodiversité est précieuse."
    );
}

window.changerFenny = changerFenny;
window.modeIdle = modeIdle;