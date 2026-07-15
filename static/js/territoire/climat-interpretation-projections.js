function calculerEvolutionProjection(indicateurs, cle) {

    const ref =
        indicateurs.reference?.[cle];

    const futur =
        indicateurs["2100"]?.[cle];

    if (
        ref === null ||
        ref === undefined ||
        futur === null ||
        futur === undefined
    ) {
        return null;
    }

    return {
        reference: ref,
        futur: futur,
        ecart: Math.round((futur - ref) * 100) / 100,
        multiplicateur: ref > 0
            ? Math.round((futur / ref) * 10) / 10
            : null
    };
}

function genererInterpretationProjections(data) {

    const climat =
        data.climat_officiel;

    if (!climat || !climat.indicateurs) return "";

    const indicateurs =
        climat.indicateurs;

    const temperature =
        calculerEvolutionProjection(
            indicateurs,
            "temperature_moyenne"
        );

    const jours30 =
        calculerEvolutionProjection(
            indicateurs,
            "jours_30"
        );

    const nuits =
        calculerEvolutionProjection(
            indicateurs,
            "nuits_tropicales"
        );

    const solSec =
        calculerEvolutionProjection(
            indicateurs,
            "sol_sec"
        );

    let lignes = [];

    if (temperature) {
        lignes.push(
            `Température moyenne : +${temperature.ecart} °C`
        );
    }

    if (jours30) {
        lignes.push(
            `Jours ≥ 30°C : ${jours30.reference} → ${jours30.futur} jours/an`
        );
    }

    if (nuits) {
        lignes.push(
            `Nuits tropicales : ${nuits.reference} → ${nuits.futur} nuits/an`
        );
    }

    if (solSec) {
        lignes.push(
            `Jours de sol sec : +${solSec.ecart} jours/an`
        );
    }

    return lignes;
}

window.genererInterpretationProjections =
    genererInterpretationProjections;