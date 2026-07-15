function getValeur(item) {
    return (
        item.resultat_alphanumerique ||
        item.resultat_numerique ||
        item.resultat ||
        "Non renseigné"
    );
}

function getValeurNumerique(item) {
    const brut = String(getValeur(item))
        .replace(",", ".")
        .replace("<", "")
        .trim();

    const valeur = parseFloat(brut);

    if (isNaN(valeur)) return null;

    return valeur;
}

function getSeuil(nomParametre) {
    const nom = (nomParametre || "").toLowerCase();

    if (nom.includes("nitrate")) return "50 mg/L";
    if (nom.includes("nitrite")) return "0,5 mg/L";
    if (nom.includes("pesticide")) return "0,1 µg/L";
    if (nom.includes("ammonium")) return "0,1 mg/L";
    if (nom.includes("ph")) return "6,5 à 9";
    if (nom.includes("conductivité")) return "2 500 µS/cm";
    if (nom.includes("plomb")) return "10 µg/L";
    if (nom.includes("arsenic")) return "10 µg/L";
    if (nom.includes("cadmium")) return "5 µg/L";
    if (nom.includes("nickel")) return "20 µg/L";
    if (nom.includes("mercure")) return "1 µg/L";

    return "Non disponible";
}

function getUnite(nomParametre) {
    const nom = (nomParametre || "").toLowerCase();

    if (nom.includes("nitrate")) return "mg/L";
    if (nom.includes("nitrite")) return "mg/L";
    if (nom.includes("pesticide")) return "µg/L";
    if (nom.includes("ammonium")) return "mg/L";
    if (nom.includes("conductivité")) return "µS/cm";
    if (nom.includes("ph")) return "pH";
    if (nom.includes("température")) return "°C";
    if (nom.includes("plomb")) return "µg/L";
    if (nom.includes("arsenic")) return "µg/L";
    if (nom.includes("cadmium")) return "µg/L";
    if (nom.includes("nickel")) return "µg/L";
    if (nom.includes("mercure")) return "µg/L";

    return "Valeur";
}

function getLimiteNumerique(nomParametre) {
    const nom = (nomParametre || "").toLowerCase();

    if (nom.includes("nitrate")) return 50;
    if (nom.includes("nitrite")) return 0.5;
    if (nom.includes("pesticide")) return 0.1;
    if (nom.includes("ammonium")) return 0.1;
    if (nom.includes("conductivité")) return 2500;
    if (nom.includes("ph")) return 9;
    if (nom.includes("plomb")) return 10;
    if (nom.includes("arsenic")) return 10;
    if (nom.includes("cadmium")) return 5;
    if (nom.includes("nickel")) return 20;
    if (nom.includes("mercure")) return 1;

    return null;
}

/* =========================
GRAPHIQUES EAU
========================= */