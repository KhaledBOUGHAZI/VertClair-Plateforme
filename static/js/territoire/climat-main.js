document.addEventListener("DOMContentLoaded", function () {

    initMap();

    if (typeof initialiserCouchesReelles === "function") {
        initialiserCouchesReelles();
    }

    const boutonClimat =
        document.getElementById("btn-climat");

    if (boutonClimat) {
        boutonClimat.onclick = function () {
            chargerClimat();
        };
    }
});

function viderBlocsClimat() {

    [
        "resultatClimat",
        "resultatRisques",
        "lectureTerritorialeCarte",
        "lectureTerritoriale",
        "projectionsClimatiques",
        "actionsPrioritaires"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.innerHTML = "";
        }
    });
}

async function chargerClimat() {

    console.log("chargerClimat lancé");

    const ville =
        document.getElementById("ville").value.trim();

    viderBlocsClimat();

    if (!ville) {
        alert("Veuillez entrer une commune");
        return;
    }

    document.getElementById("resultatClimat").innerHTML = `
        <div class="alert alert-info">
            Chargement des données climatiques publiques...
        </div>
    `;

    try {

        const response =
            await fetch(
                "/api/climat/?ville=" +
                encodeURIComponent(ville)
            );

            const responseEco =
    await fetch(
        "/api/economie-circulaire/?ville=" +
        encodeURIComponent(ville)
    );

const dataEco =
    await responseEco.json();

        const data =
            await response.json();
            
        if (data.error) {
            document.getElementById("resultatClimat").innerHTML = `
                <div class="alert alert-warning">
                    ${data.error}
                </div>
            `;
            return;
        }

        afficherCommuneSurCarteClimat(data);

        const responseRisques =
            await fetch(
                "/api/risques-climat/?ville=" +
                encodeURIComponent(ville)
            );

        const risquesData =
            await responseRisques.json();

        data.risques =
            risquesData;

        const responseSensibilite =
            await fetch(
                "/api/sensibilite-commune/?ville=" +
                encodeURIComponent(ville)
            );

        const sensibiliteData =
            await responseSensibilite.json();

        data.sensibilite =
            sensibiliteData;

        const responseClimatFutur =
            await fetch(
                "/api/climat-futur/?ville=" +
                encodeURIComponent(ville)
            );

        const climatFuturData =
            await responseClimatFutur.json();

        data.climat_officiel =
            climatFuturData;

        let resultatIndice = {
            indice: 50,
            aleas: 0,
            sensibilite: 50
        };

        if (typeof calculerIndiceVulnerabilite === "function") {
            resultatIndice =
                calculerIndiceVulnerabilite(data);
        }

        resultatIndice.data =
            data;

        if (typeof afficherIndiceVulnerabilite === "function") {
            afficherIndiceVulnerabilite(resultatIndice);
        }

        if (window.afficherLectureTerritoriale) {
            afficherLectureTerritoriale(data);
        }

        if (window.afficherProjectionsClimatiques) {
            afficherProjectionsClimatiques(data);
        }

        if (window.afficherActionsPrioritaires) {
            afficherActionsPrioritaires(data);
        }

    } catch (error) {

        console.error(error);

        document.getElementById("resultatClimat").innerHTML = `
            <div class="alert alert-danger">
                Erreur lors du chargement des données climat.
            </div>
        `;
    }
}

function afficherCommuneSurCarteClimat(data) {

    if (!data.centre) return;

    const lat =
        data.centre.coordinates[1];

    const lon =
        data.centre.coordinates[0];

    map.setView([lat, lon], 11);

    if (markerCommune) {
        map.removeLayer(markerCommune);
    }

    markerCommune =
        L.marker([lat, lon]).addTo(map);

    markerCommune
        .bindPopup(`<strong>${data.commune}</strong>`)
        .openPopup();

    const resultat =
        document.getElementById("resultatClimat");

    if (resultat) {
        resultat.innerHTML = "";
    }
}

window.chargerClimat =
    chargerClimat;