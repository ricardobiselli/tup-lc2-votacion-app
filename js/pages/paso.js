const tipoEleccion = 1;
const tipoRecuento = 1;

const cartelVerde = document.getElementsByClassName("verde")[0];
const cartelAmarillo = document.getElementsByClassName("amarillo")[0];
const cartelRojo = document.getElementsByClassName("rojo")[0];

const anioSelect = document.querySelector(".anio");
const cargoSelect = document.querySelector(".cargo");
const distritoSelect = document.querySelector(".distrito");

const seccionSelect = document.querySelector(".seccion");
const hdSeccionProvincial = document.getElementById("hdSeccionProvincial");

const botonFiltrar = document.querySelector(".boton-filtrar");


const pasos = document.querySelector(".container-pasos");

function pantallaInicio() {
    cartelAmarillo.style.display = "block";
    cartelAmarillo.innerHTML =
        '<p><i class="fa-solid fa-exclamation"></i>  Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR</p>';
    pasos.style.visibility = "hidden";
    console.log("TEST funcion ocultar pantalla OK ");
}

pantallaInicio();

async function cargarAnios() {
    const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");

    if (respuesta.ok) {
        const array = await respuesta.json();

        for (let i = 0; i < array.length; i++) {
            const anio = array[i];
            const opcion = document.createElement("option");
            opcion.value = anio;
            opcion.innerText = anio;
            anioSelect.append(opcion);
        }
    } else {
        alert("ERROR");
    }
}

cargarAnios();

async function cargarCargos() {
    const validarAnio = anioSelect.value;

    if (validarAnio && validarAnio !== "") {
        const response = await fetch(
            "https://resultados.mininterior.gob.ar/api/menu?año=" + validarAnio
        );

        if (response.ok) {
            const datosFiltros = await response.json();
            jsonDatos = datosFiltros
            cargoSelect.innerHTML = '<option value="">cargo</option>';

            datosFiltros.forEach((eleccion) => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach((cargo) => {
                        const opcion = document.createElement("option");
                        opcion.value = cargo.IdCargo;
                        opcion.innerText = cargo.Cargo;
                        cargoSelect.appendChild(opcion);
                    });
                }
            });
        } else {
            console.log("Error Cargos");
        }
    } else {
        cargoSelect.innerHTML = '<option value="">cargo</option>';
    }

    console.log("finaliza cargarCargos");
}



async function cargarDistritos() {
    const validarAnio = anioSelect.value;
    const validarCargo = cargoSelect.value;

    if (validarAnio && validarAnio !== "" && validarCargo && validarCargo !== "") {
        const response = await fetch(
            "https://resultados.mininterior.gob.ar/api/menu?año=" + validarAnio
        );

        if (response.ok) {
            const datosFiltros = await response.json();

            distritoSelect.innerHTML = '<option value="">Seleccione un distrito</option>';

            datosFiltros.forEach((eleccion) => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach((cargo) => {
                        if (cargo.IdCargo == validarCargo) {
                            cargo.Distritos.forEach((distrito) => {
                                const opcion = document.createElement("option");
                                opcion.value = distrito.IdDistrito;
                                opcion.innerText = distrito.Distrito;
                                distritoSelect.appendChild(opcion);
                            });
                        }
                    });
                }
            });

            const distritoSeleccionado = distritoSelect.value;
            console.log("Distrito seleccionado antes de cargarSeccion:", distritoSeleccionado);

        } else {
            console.log("Error en la consulta de Distritos");
        }
    } else {
        distritoSelect.innerHTML = '<option value="">Seleccione un distrito</option>';
    }
}


async function cargarSeccion() {
    console.log("TEST!!!!!! Comienza cargarSeccion");
    seccionSelect.innerHTML = "";
    hdSeccionProvincial.value = "";
    try {
        const anioSeleccionado = anioSelect.value;
        const cargoSeleccionado = cargoSelect.value;
        const distritoSeleccionado = distritoSelect.value;

        console.log("Valores seleccionados:", anioSeleccionado, cargoSeleccionado, distritoSeleccionado);

        if (
            anioSeleccionado &&
            anioSeleccionado !== "" &&
            cargoSeleccionado &&
            cargoSeleccionado !== "" &&
            distritoSeleccionado &&
            distritoSeleccionado !== ""
        ) {
            const datosFiltrados = jsonDatos;

            const eleccionesFiltradas = datosFiltrados.filter(
                (eleccion) => eleccion.IdEleccion === tipoEleccion
            );

            const cargoSeleccionadoObj = eleccionesFiltradas[0].Cargos.filter(
                (cargo) => cargo.IdCargo === cargoSeleccionado
            );

            const distritoSeleccionadoObj = cargoSeleccionadoObj[0].Distritos.filter(
                (distrito) => distrito.IdDistrito == distritoSeleccionado
            );

            console.log("Objeto distrito seleccionado:", distritoSeleccionadoObj);

            hdSeccionProvincial.value =
                distritoSeleccionadoObj[0].SeccionesProvinciales[0].IDSeccionProvincial;
            console.log("Valor antes de asignar a hdSeccionProvincial:", distritoSeleccionadoObj[0].SeccionesProvinciales[0].IDSeccionProvincial);


            const secciones =
                distritoSeleccionadoObj[0].SeccionesProvinciales[0].Secciones;

            const optionPr = document.createElement("option");
            optionPr.value = "Sección";
            optionPr.innerText = "Sección";
            seccionSelect.appendChild(optionPr);

            secciones.forEach((seccion) => {
                const option = document.createElement("option");
                option.value = seccion.IdSeccion;
                option.text = seccion.Seccion;
                seccionSelect.appendChild(option);

                console.log("Valor de sección:", seccion.IdSeccion);
            });
        } else {
            seccionSelect.innerHTML = "";
            const primerOpt = document.createElement("option");
            primerOpt.innerText = "Sección";
            seccionSelect.appendChild(primerOpt);
        }
    } catch (error) {
        console.error("Error en cargarSeccion:", error);
    }

    console.log("TEST!!!!!! Finaliza cargarSeccion");
}



async function filtrarResultados() {
    console.log("Entro a filtrarResultados");
    const anioEleccion = anioSelect.value;
    const tipoRecuentoValor = tipoRecuento;
    const tipoEleccionValor = tipoEleccion;
    const categoriaId = cargoSelect.value;
    const distritoId = distritoSelect.value;
    const seccionProvincialId = hdSeccionProvincial.value;
    //console.log("Valor de hdSeccionProvincial:", hdSeccionProvincial.value);
    const seccionId = seccionSelect.value;
    const circuitoId = '';
    const mesaId = '';

    console.log("Valores de los filtros:");
    console.log("anioEleccion:", anioEleccion);
    console.log("tipoRecuentoValor:", tipoRecuentoValor);
    console.log("tipoEleccionValor:", tipoEleccionValor);
    console.log("categoriaId:", categoriaId);
    console.log("distritoId:", distritoId);
    console.log("seccionProvincialId:", seccionProvincialId);
    console.log("seccionId:", seccionId);
    console.log("circuitoId:", circuitoId);
    console.log("mesaId:", mesaId);


    console.log("TEST mensajes advertencia");
    console.log("anioEleccion:", anioEleccion);
    console.log("categoriaId:", categoriaId);
    console.log("distritoId:", distritoId);
    console.log("seccionId:", seccionId);

    if (
        !anioEleccion ||
        anioEleccion == "Año" ||
        !categoriaId ||
        categoriaId == "Cargo" ||
        !distritoId ||
        distritoId == "Distrito" ||
        !seccionId ||
        seccionId == "Sección"
    ) {
        console.log("Falta seleccionar algún campo");

        // no estan funcionando losmensajes:
        const mensaje =
            anioEleccion == "Año"
                ? "No seleccionó el año"
                : categoriaId == "Cargo"
                    ? "No seleccionó el cargo"
                    : distritoId == "Distrito"
                        ? "No seleccionó el distrito"
                        : seccionId == "Sección"
                            ? "No seleccionó la seccion"
                            : "";
        console.log("TEST Mensaje construido:", mensaje);
        cartelAmarillo.style.display = "block";
        cartelAmarillo.innerHTML = `<p><i class="fa-solid fa-exclamation"></i> Falta seleccionar algún campo: ${mensaje}</p>`;
        return;
    }


    try {
        const response = await fetch(
            `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta:", data);
            cartelAmarillo.style.display = "none";
            pasos.style.visibility = "visible";

            const titulo = document.getElementById("titulo");
            const textoPath = document.getElementById("texto-path");

            titulo.innerText = `Elecciones ${anioEleccion} | Paso`;

            const opcionSeleccionadaCargo = cargoSelect.options[cargoSelect.selectedIndex];

            const opcionSeleccionadaDist =
                distritoSelect.options[distritoSelect.selectedIndex];
            const opcionSeleccionadaSeccion = seccionSelect.options[seccionSelect.selectedIndex]

            textoPath.innerText = `${anioEleccion} > Paso > Provisorio > ${opcionSeleccionadaCargo.text} > ${opcionSeleccionadaDist.text}> ${opcionSeleccionadaSeccion.text}`;

            const mesasEscrutadas = document.getElementById("mesas-escrutadas");
            const electores = document.getElementById("electores");
            const participacion = document.getElementById("participacion");

            mesasEscrutadas.innerText = data.estadoRecuento.mesasTotalizadas;
            electores.innerText = data.estadoRecuento.cantidadElectores;
            participacion.innerText = `%${data.estadoRecuento.participacionPorcentaje}`;

            const mapa = mapas.find(
                (mapas) =>
                    mapas.provincia.toLowerCase() ==
                    opcionSeleccionadaDist.text.toLowerCase()
            );
            const provincia = document.querySelector(".titulomapa");
            const svg = document.querySelector(".mapa");
            provincia.innerText = mapa.provincia;
            svg.innerHTML = mapa.svg;

        } else {
            console.error("Error:", response);
            cartelRojo.style.display = "block";
            setTimeout(() => {
                cartelAmarillo.style.display = "none";
            }, 4000);
        }
    } catch (error) {
        console.error("Error en la consulta:", error);
    }
}

function agregarInforme() {

    const vAnio = anioSelect.value;
    const vTipoRecuento = tipoRecuento;
    const vTipoEleccion = tipoEleccion;
    const vCategoriaId = cargoSelect.value;
    const vDistrito = distritoSelect.value;
    const vSeccionProvincial = hdSeccionProvincial.value;
    const vSeccionID = seccionSelect.value;

    const nuevoRegistro = `${vAnio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${vSeccionID}`;
    const key = "INFORMES"

    const informeJson = localStorage.getItem(key)
    const informeObjeto = JSON.parse(informeJson);
    let registroInformes = []

    if (registroInformes.includes(nuevoRegistro)) {
        cartelAmarillo.style.display = "block";
        cartelAmarillo.innerHTML =
            '<p><i class="fa-solid fa-exclamation"></i> Ya existe este registro!</p>';
    } else {
        registroInformes.push(nuevoRegistro);
        localStorage.setItem("INFORMES", JSON.stringify(registroInformes));
        cartelVerde.style.display = "block";
    }
}

