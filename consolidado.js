//cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
    inicializarFormularios();
});

//inicializar los formularios
function inicializarFormularios() {
    const formulario1 = document.getElementById("formulario1");
    const formulario2 = document.getElementById("formulario2");

    const fileInput1 = document.getElementById("fileInput1");
    const fileInput2 = document.getElementById("fileInput2");

    document.getElementById("btnGenerarG").addEventListener("click", function (event) {
        let form2Valido = formulario2.reportValidity();
        let form1Valido = formulario1.reportValidity();

        if (form1Valido && form2Valido ) {
            if(fileInput1.files[0] === undefined && fileInput2.files[0] === undefined) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivos no seleccionados',
                    text: 'Por favor, selecciona un archivo Excel antes de continuar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            } else if(fileInput1.files[0] === undefined && fileInput2.files[0] !== undefined) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo formulario 1 no seleccionados',
                    text: 'Por favor, selecciona un archivo Excel antes de continuar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            } else if(fileInput1.files[0] !== undefined && fileInput2.files[0] === undefined) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo formulario 2 no seleccionados',
                    text: 'Por favor, selecciona un archivo Excel antes de continuar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            }else {
                procesarFormularios(fileInput1.files[0], fileInput2.files[0]);
            }
        }
    });
}

//lectua de rangos formularios
function procesarFormularios(file1, file2) {
    const colInicio1 = document.getElementById("columnaInicio1").value.toUpperCase();
    const colFin1 = document.getElementById("columnaFin1").value.toUpperCase();
    const filaInicio1 = parseInt(document.getElementById("filaInicio1").value);
    const filaFin1 = parseInt(document.getElementById("filaFin1").value);

    const colInicio2 = document.getElementById("columnaInicio2").value.toUpperCase();
    const colFin2 = document.getElementById("columnaFin2").value.toUpperCase();
    const filaInicio2 = parseInt(document.getElementById("filaInicio2").value);
    const filaFin2 = parseInt(document.getElementById("filaFin2").value);


    console.log("colInicio1: " + colInicio1);
    console.log("colFin1: " + colFin1);
    console.log("filaInicio1: " + filaInicio1);
    console.log("filaFin1: " + filaFin1);

    console.log("colInicio2: " + colInicio2);
    console.log("colFin2: " + colFin2);
    console.log("filaInicio2: " + filaInicio2);
    console.log("filaFin2: " + filaFin2);

    let val1 = validaciones(colInicio1, colFin1);
    let val2 = validaciones(colInicio2, colFin2);

    if (val1 === true) {
        if (val2 === true) {
            if (filaInicio1 > filaFin1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'FORMULARIO 1: La fila de inicio no puede ser mayor que la fila de fin.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            else if (filaInicio2 > filaFin2) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'FORMULARIO 2: La fila de inicio no puede ser mayor que la fila de fin.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            else {
                if (file1 && file2) {
                    console.log("Archivo seleccionado:", file1);
                    console.log("Archivo seleccionado:", file2);
                    //leerArchivo(file1, colInicio, colFin, filaInicio, filaFin);
                }
            }




        }


    }


}

//validaciones de rangos
function validaciones(columnaInicio, columnaFin) {
    // Arreglo de todas las letras del abecedario en strings
    const abecedario = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];

    let colInicio = 0, colFin = 0;

    for (let i = 0; i < abecedario.length; i++) {
        if (columnaInicio === abecedario[i]) {
            colInicio = i;
        }
        if (columnaFin === abecedario[i]) {
            colFin = i;
        }
    }

    if (colInicio > colFin) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La columna de inicio no puede ser mayor que la columna de fin.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
        return false;
    }
    else {
        return true;
    }

}

function regresarMenu() {
    window.history.back();
}