document.addEventListener("DOMContentLoaded", function () {

    initMap();

    const boutonDPE = document.getElementById("btn-dpe");
    const boutonPassoires = document.getElementById("btn-passoires");

    if (boutonDPE) {
        boutonDPE.addEventListener("click", function () {
            chargerDPE();
        });
    }

    if (boutonPassoires) {
        boutonPassoires.addEventListener("click", function () {
            chargerDPE();
        });
    }

});