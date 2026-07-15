function calculCO2() {

    const inputs = document.querySelectorAll(".conso");
    const totalSpan = document.getElementById("total");

    let total = 0;

    inputs.forEach(function (input) {

        const conso =
            parseFloat(input.value) || 0;

        let coeff = 0;

        if (input.dataset.coeff) {
            coeff =
                parseFloat(input.dataset.coeff) || 0;
        }

        if (input.dataset.code && window.facteursEmission) {

            const facteur =
                window.facteursEmission[input.dataset.code];

            if (typeof facteur === "object") {
                coeff =
                    parseFloat(facteur.coefficient) || 0;
            } else {
                coeff =
                    parseFloat(facteur) || 0;
            }
        }

        const resultat =
            conso * coeff;

        const ligne =
            input.closest("tr");

        const resultSpan =
            ligne.querySelector(".result");

        if (resultSpan) {
            resultSpan.textContent =
                resultat.toFixed(2);
        }

        total += resultat;
    });

    if (totalSpan) {
        totalSpan.textContent =
            total.toFixed(2);
    }
}

window.calculCO2 = calculCO2;