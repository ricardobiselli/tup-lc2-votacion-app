const informesGuardadosStorage = JSON.parse(localStorage.getItem("INFORMES"));
console.log('Estado actual del localStorage:', localStorage.getItem('INFORMES'));
console.log(informesGuardadosStorage)
const pasos = document.querySelector(".container-pasos");
const cartelVerde = document.getElementsByClassName("verde")[0];
const cartelAmarillo = document.getElementsByClassName("amarillo")[0];
const cartelRojo = document.getElementsByClassName("rojo")[0];


function pantallaInicio() {

    if (!informesGuardadosStorage || informesGuardadosStorage.length === 0) {
        console.log("TEST informes NO guardados")

        pasos.style.visibility = "hidden";
        cartelAmarillo.style.display = "block";
        cartelAmarillo.innerHTML =
            '<p><i class="fa-solid fa-exclamation"></i> No hay informes guardados para mostrar</p>';
    } else {
        procesarInformes();
        pasos.style.visibility = "visible";
    }
}
pantallaInicio();

function procesarInformes() {
    informesGuardadosStorage.forEach(async (informe) => {

        const vAnio = informe.vAnio;
        const tipoRecuento = informe.vTipoRecuento;
        const tipoEleccion = informe.vTipoEleccion;
        const categoriaId = informe.vCategoriaId;
        const distrito = informe.vDistrito;
        const seccionProvincial = informe.vSeccionProvincial;
        const seccionId = informe.vSeccionID;
        const circuitoId = informe.vcircuitoId;
        const mesaId = informe.vmesaId;

        

        const url = `https://resultados.mininterior.gob.ar/api/resultado/totalizado?año=${vAnio}&recuento=${tipoRecuento}&idEleccion=${tipoEleccion}&idCargo=${categoriaId}&idDistrito=${distrito}&idSeccionProvincial=${seccionProvincial}&idSeccion=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
        try {
            const response = await fetch(url);
            console.log(response)

            if (response.ok) {
                const data = await response.json();
                armarTabla(data);
            } else {
                console.error("Error en la consulta:", response);
            }
        } catch (error) {
            console.error("Error en la consulta:", error);
        }
    });
}

function armarTabla(data) {
    
}


