const tipoEleccion = 1;
const tipoRecuento = 1;

const cartelVerde = document.getElementById("pulgar");
const cartelAmarillo = document.getElementById("triangulo");
const cartelRojo = document.getElementById("exclamacion");

const anioElegido = document.querySelector(".anio");
const cargoElegido = document.querySelector(".cargo");
const distritoElegido = document.querySelector(".distrito");

async function cargarAnios() {
  const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");

  if (respuesta.ok) {
    const array = await respuesta.json();

    for (let i = 0; i < array.length; i++) {
      const anio = array[i];
      const opcion = document.createElement("option");
      opcion.value = anio;
      opcion.innerText = anio;
      anioElegido.append(opcion);
    }
  } else {
    alert("ERROR");
  }
}

cargarAnios();

async function cargarCargos() {
  const validarAnio = anioElegido.value;

  if (validarAnio && validarAnio !== "") {
    const response = await fetch(
      "https://resultados.mininterior.gob.ar/api/menu?año=" + validarAnio
    );

    if (response.ok) {
      const datosFiltros = await response.json();
      cargoElegido.innerHTML = '<option value="">cargo</option>';

      datosFiltros.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
          eleccion.Cargos.forEach((cargo) => {
            const opcion = document.createElement("option");
            opcion.value = cargo.IdCargo;
            opcion.innerText = cargo.Cargo;
            cargoElegido.appendChild(opcion);
          });
        }
      });
    } else {
      console.log("Error en la consulta de Cargos");
    }
  } else {
    cargoElegido.innerHTML = '<option value="">cargo</option>';
  }
}

async function cargarDistrito() {

}

async function cargarDistritos() {
  const validarAnio = anioElegido.value;
  const validarCargo = cargoElegido.value;

  if (validarAnio && validarAnio !== "" && validarCargo && validarCargo !== "") {
    const response = await fetch(
      "https://resultados.mininterior.gob.ar/api/menu?año=" + validarAnio
    );

    if (response.ok) {
      const datosFiltros = await response.json();

      distritoElegido.innerHTML = '<option value="">Seleccione un distrito</option>';

      datosFiltros.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
          eleccion.Cargos.forEach((cargo) => {
            if (cargo.IdCargo == validarCargo) {
              cargo.Distritos.forEach((distrito) => {
                const opcion = document.createElement("option");
                opcion.value = distrito.IdDistrito;
                opcion.innerText = distrito.Distrito;
                distritoElegido.appendChild(opcion);
              });
            }
          });
        }
      });
    } else {
      console.log("Error en la consulta de Distritos");
    }
  } else {
    distritoElegido.innerHTML = '<option value="">Seleccione un distrito</option>';
  }
}


