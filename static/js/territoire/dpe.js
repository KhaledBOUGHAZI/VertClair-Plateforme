let dpeMarkers = [];

function couleurDPE(classe) {
    if (classe === "A") return "green";
    if (classe === "B") return "lightgreen";
    if (classe === "C") return "yellow";
    if (classe === "D") return "orange";
    if (classe === "E") return "darkorange";
    if (classe === "F") return "red";
    if (classe === "G") return "darkred";
    return "gray";
}

function chargerDPE() {
    const ville = document.getElementById("ville").value.trim();

    if (!ville) {
        alert("Veuillez entrer une commune");
        return;
    }

    initMap();

    fetch("/api/dpe-commune/?ville=" + encodeURIComponent(ville))
        .then(response => response.json())
        .then(data => {
            console.log("DPE commune :", data);

            if (data.error) {
                alert(data.error);
                return;
            }

            if (data.centre) {
                afficherCommuneSurCarte(data);
            }

            afficherSyntheseDPE(data);
            chargerCarteDPE(ville);
        })
        .catch(error => {
            console.error(error);
            alert("Erreur chargement DPE");
        });
}

function afficherSyntheseDPE(data) {
    const bloc = document.getElementById("resultat-dpe");

    if (!bloc) return;

    bloc.innerHTML = `
        <h4>${data.commune}</h4>
        <p><strong>Nombre de DPE :</strong> ${data.nombre_dpe}</p>
        <p><strong>Classe dominante :</strong> ${data.classe_dominante}</p>
        <p><strong>Part de passoires F/G :</strong> ${data.part_passoires} %</p>
        <p><strong>Source :</strong> ${data.source}</p>
    `;
}

function chargerCarteDPE(ville) {
    fetch("/api/carte-dpe/?ville=" + encodeURIComponent(ville))
        .then(response => response.json())
        .then(data => {
            console.log("Carte DPE :", data);

            if (data.error) {
                alert(data.error);
                return;
            }

            afficherPassoiresSurCarte(data.dpe || []);
        })
        .catch(error => {
            console.error(error);
            alert("Erreur chargement carte DPE");
        });
}

function afficherPassoiresSurCarte(dpeList) {
    dpeMarkers.forEach(marker => map.removeLayer(marker));
    dpeMarkers = [];

    dpeList.forEach(dpe => {
        if (!dpe.lat || !dpe.lon) return;

        const marker = L.circleMarker([dpe.lat, dpe.lon], {
            radius: 7,
            color: couleurDPE(dpe.classe_dpe),
            fillColor: couleurDPE(dpe.classe_dpe),
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
            <strong>${dpe.adresse}</strong><br>
            DPE : ${dpe.classe_dpe}<br>
            GES : ${dpe.ges}<br>
            Conso : ${dpe.conso}
        `);

        dpeMarkers.push(marker);
    });
}