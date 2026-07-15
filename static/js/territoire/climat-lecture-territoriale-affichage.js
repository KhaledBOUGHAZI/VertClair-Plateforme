function afficherLectureTerritoriale(data) {

    const zone =
        document.getElementById(
            "lectureTerritoriale"
        );

    if (!zone) return;

    const texte =
        genererLectureTerritoriale(data);

    zone.innerHTML = `
        <div class="card shadow-sm mb-4">
            <div class="card-body">

                <h4>
                    📍 Lecture territoriale
                </h4>

                <p class="mb-0">
                    ${texte}
                </p>

            </div>
        </div>
    `;
}

window.afficherLectureTerritoriale =
    afficherLectureTerritoriale;