function masquerTousLesBlocsEnergie() {
    document.getElementById("blocBatimentsEnergie").style.display = "none";
    document.getElementById("blocSolaireEnergie").style.display = "none";
    document.getElementById("blocEolienEnergie").style.display = "none";
    document.getElementById("blocGeothermieEnergie").style.display = "none";
    document.getElementById("blocBiomasseEnergie").style.display = "none";
    document.getElementById("blocActionsEnergie").style.display = "none";
    document.getElementById("blocOutilsBatiments").style.display = "none";
}

function afficherBlocBatiments() {
    masquerTousLesBlocsEnergie();

    document.getElementById("blocBatimentsEnergie").style.display = "block";
    document.getElementById("blocOutilsBatiments").style.display = "block";

    setTimeout(function () {
        if (window.map) {
            map.invalidateSize(true);
        }
    }, 500);
}

function afficherBlocSolaire() {
    masquerTousLesBlocsEnergie();
    document.getElementById("blocSolaireEnergie").style.display = "block";
}

function afficherBlocEolien() {
    masquerTousLesBlocsEnergie();
    document.getElementById("blocEolienEnergie").style.display = "block";
}

function afficherBlocGeothermie() {
    masquerTousLesBlocsEnergie();
    document.getElementById("blocGeothermieEnergie").style.display = "block";
}

function afficherBlocBiomasse() {
    masquerTousLesBlocsEnergie();
    document.getElementById("blocBiomasseEnergie").style.display = "block";
}

function afficherBlocActionsEnergie() {
    masquerTousLesBlocsEnergie();
    document.getElementById("blocActionsEnergie").style.display = "block";
}

window.afficherBlocBatiments = afficherBlocBatiments;
window.afficherBlocSolaire = afficherBlocSolaire;
window.afficherBlocEolien = afficherBlocEolien;
window.afficherBlocGeothermie = afficherBlocGeothermie;
window.afficherBlocBiomasse = afficherBlocBiomasse;
window.afficherBlocActionsEnergie = afficherBlocActionsEnergie;
document.addEventListener("DOMContentLoaded", function () {
    masquerTousLesBlocsEnergie();
});