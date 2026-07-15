function afficherBlocActeurs() {
    document.getElementById("economieCirculaire").style.display = "block";
    document.getElementById("indiceDechets").style.display = "none";
    document.getElementById("explicationIndiceDechets").style.display = "none";
    document.getElementById("actionsDechets").style.display = "none";
}

function afficherBlocPerformance() {
    document.getElementById("economieCirculaire").style.display = "none";
    document.getElementById("indiceDechets").style.display = "block";
    document.getElementById("explicationIndiceDechets").style.display = "block";
    document.getElementById("actionsDechets").style.display = "none";
}

function afficherBlocActions() {
    document.getElementById("economieCirculaire").style.display = "none";
    document.getElementById("indiceDechets").style.display = "none";
    document.getElementById("explicationIndiceDechets").style.display = "none";
    document.getElementById("actionsDechets").style.display = "block";
}

window.afficherBlocActeurs = afficherBlocActeurs;
window.afficherBlocPerformance = afficherBlocPerformance;
window.afficherBlocActions = afficherBlocActions;