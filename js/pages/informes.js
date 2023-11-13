const informesGuardadosStorage = localStorage.getItem("INFORMES");

//console.log('Estado actual del localStorage:', localStorage.getItem('INFORMES'));
//console.log(informesGuardadosStorage)
const cartelVerde = document.getElementsByClassName("verde")[0];
const cartelAmarillo = document.getElementsByClassName("amarillo")[0];
const cartelRojo = document.getElementsByClassName("rojo")[0];
const contenedorPrincipal = document.getElementsByClassName("main")[0];
const contenedorMapa = document.getElementsByClassName("container-mapa")[0];




function pantallaInicio() {
    if (!informesGuardadosStorage || informesGuardadosStorage.length === 0) {
        console.log("TEST informes NO guardados");

        cartelAmarillo.style.display = "block";
        cartelAmarillo.innerHTML =
            '<p><i class="fa-solid fa-exclamation"></i> No hay informes guardados para mostrar</p>';
        //contenedorPrincipal.style.visibility= "hidden"
    } else {
        contenedorPrincipal.style.visibility = "visible";

        const informesArray = informesGuardadosStorage.split(',');

        informesArray.forEach(async (informeString) => {
            const informe = informeString.split('|');

            const vAnio = informe[0];
            const vTipoRecuento = informe[1];
            const vTipoEleccion = informe[2];
            const vCategoriaId = informe[3];
            const vDistrito = informe[4];
            const vSeccionProvincial = informe[5];
            const vSeccionID = informe[6];
            const vCircuitoId = "";
            const vMesaId = "";

            const url = `https://resultados.mininterior.gob.ar/api/resultado/totalizado?año=${vAnio}&recuento=${vTipoRecuento}&idEleccion=${vTipoEleccion}&idCargo=${vCategoriaId}&idDistrito=${vDistrito}&idSeccionProvincial=${vSeccionProvincial}&idSeccion=${vSeccionID}&circuitoId=${vCircuitoId}&mesaId=${vMesaId}`;

            console.log(url);

            try {
                const response = await fetch(url);

                if (response.ok) {
                    console.log("RESPUESTA OK")

                    const data = await response.json();
                    const provincia = informe[6];
                    const mapa = mapas.find((mapa) => mapa.provincia.toLowerCase() === provincia.toLowerCase());
                    if (mapa) {
                        const svg = document.querySelector(".mapa");
                        svg.innerHTML = mapa.svg;
                        //contenedorMapa.appendChild(svg);
                    } else {
                        console.log("Mapa no encontrado para la provincia: ", provincia);
                    }
                } else {
                    console.error("Error en la consulta:", response);
                    console.log("TEST respuesta fail");
                }
            } catch (error) {
                console.error("Error en la consulta:", error);
            }
        });
    }
}

pantallaInicio();

