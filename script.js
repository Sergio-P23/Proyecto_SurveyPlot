//ese evento Le dice al navegador que espere hasta que toda la estructura del HTML haya sido cargada antes de ejecutar el código dentro de la función
document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar el formulario
    const formulario = document.getElementById("inputsFormulario");

    // Agregar un evento escuchador para que detecte el evento submit del formulario
    formulario.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar que la página se recargue

        // Capturar los valores de los inputs
        const nombreEncuesta = document.getElementById("nombreEncuesta").value;
        const columnaInicio = document.getElementById("columnaInicio").value.toUpperCase();
        const columnaFin = document.getElementById("columnaFin").value.toUpperCase();
        const filaFin = document.getElementById("filaFin").value;

        // Mostrar los valores en la consola
        console.log("Nombre de la Encuesta:", nombreEncuesta);
        console.log("Columna de Inicio:", columnaInicio);
        console.log("Columna de Fin:", columnaFin);
        console.log("Fila donde terminan las preguntas:", filaFin);
    });
});

