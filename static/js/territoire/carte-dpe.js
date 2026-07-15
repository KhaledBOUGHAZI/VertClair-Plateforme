var coucheDPE = null;
var donneesCarteDPE = [];

async function afficherCarteDPE(){

    const ville = document.getElementById("ville").value;

    if(!ville){
        alert("Veuillez entrer une commune");
        return;
    }

    initMap();

    const response = await fetch(
        "/api/carte-dpe/?ville=" + encodeURIComponent(ville)
    );

    const data = await response.json();

    if(data.error){
        alert(data.error);
        return;
    }

    donneesCarteDPE = data.dpe || [];

    if(donneesCarteDPE.length === 0){
        alert("Aucun DPE géolocalisé trouvé");
        return;
    }

    afficherPointsDPE();

    const bounds = L.latLngBounds(
        donneesCarteDPE.map(b => [b.lat, b.lon])
    );

    map.fitBounds(bounds, {
        padding: [30, 30]
    });
}


function afficherPointsDPE(){

    initMap();

    const filtre = document.getElementById("filtre-dpe").value;

    if(coucheDPE){
        map.removeLayer(coucheDPE);
    }

    coucheDPE = L.layerGroup().addTo(map);

    const stats = {
        A:0, B:0, C:0, D:0, E:0, F:0, G:0
    };

    donneesCarteDPE.forEach(function(batiment){

        const classe = batiment.classe_dpe;

        if(stats[classe] !== undefined){
            stats[classe]++;
        }

        if(filtre !== "ALL"){

            if(filtre === "FG" && !(classe === "F" || classe === "G")){
                return;
            }

            if(filtre !== "FG" && classe !== filtre){
                return;
            }
        }

        const color = couleurDPE(classe);

        const point = L.circleMarker(
            [batiment.lat, batiment.lon],
            {
                radius: 7,
                color: color,
                fillColor: color,
                fillOpacity: 0.9
            }
        );

        point.bindPopup(`
            <strong>${batiment.adresse}</strong><br>
            DPE : ${batiment.classe_dpe}<br>
            GES : ${batiment.ges}<br>
            Conso : ${batiment.conso} kWh/m²/an
        `);

        point.addTo(coucheDPE);
    });

    afficherStatsDPE(stats);
}


function couleurDPE(classe){

    if(classe === "A") return "#00b050";
    if(classe === "B") return "#92d050";
    if(classe === "C") return "#ffff00";
    if(classe === "D") return "#ffc000";
    if(classe === "E") return "#ff9900";
    if(classe === "F") return "#ff0000";
    if(classe === "G") return "#990000";

    return "#999999";
}

window.afficherCarteDPE = afficherCarteDPE;
window.afficherPointsDPE = afficherPointsDPE;