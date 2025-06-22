//cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
    inicializarFormularios();
});

// Variables globales para almacenar las respuestas de ambos archivos
let respuestasArchivo1 = null;
let respuestasArchivo2 = null;

//inicializar los formularios
function inicializarFormularios() {
    const formulario1 = document.getElementById("formulario1");
    const formulario2 = document.getElementById("formulario2");

    const fileInput1 = document.getElementById("fileInput1");
    const fileInput2 = document.getElementById("fileInput2");

    document.getElementById("btnGenerarG").addEventListener("click", function (event) {
        let form2Valido = formulario2.reportValidity();
        let form1Valido = formulario1.reportValidity();

        if (form1Valido && form2Valido) {
            if (fileInput1.files[0] === undefined && fileInput2.files[0] === undefined) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivos no seleccionados',
                    text: 'Por favor, selecciona los archivo Excel antes de continuar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            } else if (fileInput1.files[0] === undefined && fileInput2.files[0] !== undefined) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo formulario 1 no seleccionado',
                    text: 'Por favor, selecciona un archivo Excel antes de continuar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            } else if (fileInput1.files[0] !== undefined && fileInput2.files[0] === undefined) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo formulario 2 no seleccionado',
                    text: 'Por favor, selecciona un archivo Excel antes de continuar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            } else {
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

    let val1 = validaciones1(colInicio1, colFin1);
    let val2 = validaciones2(colInicio2, colFin2);

    if (val1 === true) {
        if (val2 === true) {
            if (filaInicio1 > filaFin1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error formulario 1',
                    text: 'La fila de inicio no puede ser mayor que la fila de fin.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            else if (filaInicio2 > filaFin2) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error formulario 2',
                    text: 'La fila de inicio no puede ser mayor que la fila de fin.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            else {
                if (file1 && file2) {
                    leerArchivo1(file1, colInicio1, colFin1, filaInicio1, filaFin1)
                    leerArchivo2(file2, colInicio2, colFin2, filaInicio2, filaFin2)
                }
            }
        }
    }
}

// Lee el archivo 1 
function leerArchivo1(file, colInicio, colFin, filInicio, filFin) {
    const reader = new FileReader();
    //cuando el archivo se ha leido correctamente
    reader.onload = function (e) {
        const datos = new Uint8Array(e.target.result);
        const libroTrabajo = XLSX.read(datos, { type: "array" });
        const hojarespuestas = libroTrabajo.SheetNames[0];
        const sheet = libroTrabajo.Sheets[hojarespuestas];
        const jsonData1 = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        procesarRespuestas1(jsonData1, colInicio, colFin, filInicio, filFin);
    };

    reader.readAsArrayBuffer(file);

}

// Lee el archivo 2
function leerArchivo2(file, colInicio, colFin, filInicio, filFin) {
    const reader = new FileReader();
    //cuando el archivo se ha leido correctamente
    reader.onload = function (e) {
        const datos = new Uint8Array(e.target.result);
        const libroTrabajo = XLSX.read(datos, { type: "array" });
        const hojarespuestas = libroTrabajo.SheetNames[0];
        const sheet = libroTrabajo.Sheets[hojarespuestas];
        const jsonData2 = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        procesarRespuestas2(jsonData2, colInicio, colFin, filInicio, filFin);
    };

    reader.readAsArrayBuffer(file);
}

// Procesa las respuestas del archivo 1
function procesarRespuestas1(datos1, colInicio, colFin, filaInicio, filaFin) {
    const respuestasPosibles = [
        "Totalmente en desacuerdo",
        "En desacuerdo",
        "Ni de acuerdo, ni en desacuerdo",
        "De acuerdo",
        "Totalmente de acuerdo"
    ];

    const indiceColInicio = XLSX.utils.decode_col(colInicio);
    const indiceColFin = XLSX.utils.decode_col(colFin);
    const respuestas1 = [];

    for (let col = indiceColInicio; col <= indiceColFin; col++) {
        let conteoRespuestas = inicializarConteoRespuestas1(respuestasPosibles);

        for (let fila = filaInicio - 1; fila < filaFin; fila++) {
            let respuesta = datos1[fila]?.[col];
            if (respuestasPosibles.includes(respuesta)) {
                conteoRespuestas[respuesta]++;
            }
        }

        respuestas1.push(conteoRespuestas);
    }

    // Inicializa el conteo de respuestas
    function inicializarConteoRespuestas1(respuestasPosibles) {
        const conteo = {};
        respuestasPosibles.forEach(respuesta => {
            conteo[respuesta] = 0;
        });
        return conteo;
    }

    respuestasArchivo1 = respuestas1;
    verificarYConsolidar();
    //mostrarResultadosConsola1(respuestas1, respuestasPosibles, filaInicio, filaFin);
}

// Procesa las respuestas del archivo 2
function procesarRespuestas2(datos2, colInicio, colFin, filaInicio, filaFin) {
    const respuestasPosibles = [
        "Totalmente en desacuerdo",
        "En desacuerdo",
        "Ni de acuerdo, ni en desacuerdo",
        "De acuerdo",
        "Totalmente de acuerdo"
    ];

    const indiceColInicio = XLSX.utils.decode_col(colInicio);
    const indiceColFin = XLSX.utils.decode_col(colFin);
    const respuestas2 = [];

    for (let col = indiceColInicio; col <= indiceColFin; col++) {
        let conteoRespuestas = inicializarConteoRespuestas1(respuestasPosibles);

        for (let fila = filaInicio - 1; fila < filaFin; fila++) {
            let respuesta = datos2[fila]?.[col];
            if (respuestasPosibles.includes(respuesta)) {
                conteoRespuestas[respuesta]++;
            }
        }

        respuestas2.push(conteoRespuestas);
    }

    // Inicializa el conteo de respuestas
    function inicializarConteoRespuestas1(respuestasPosibles) {
        const conteo = {};
        respuestasPosibles.forEach(respuesta => {
            conteo[respuesta] = 0;
        });
        return conteo;
    }

    respuestasArchivo2 = respuestas2;
    verificarYConsolidar();
    //mostrarResultadosConsola2(respuestas2, respuestasPosibles, filaInicio, filaFin);
}

// Verifica si ambos archivos están procesados y consolida
function verificarYConsolidar() {
    if (respuestasArchivo1 !== null && respuestasArchivo2 !== null) {
        consolidarRespuestas(respuestasArchivo1, respuestasArchivo2);
    }
}

function consolidarRespuestas(arr1, arr2) {
    const respuestasPosibles = [
        "Totalmente en desacuerdo",
        "En desacuerdo",
        "Ni de acuerdo, ni en desacuerdo",
        "De acuerdo",
        "Totalmente de acuerdo"
    ];

    const resultado = [];
    const maxLength = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLength; i++) {
        const obj1 = arr1[i] || {};
        const obj2 = arr2[i] || {};
        const claves = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
        const consolidado = {};

        claves.forEach(clave => {
            consolidado[clave] = (obj1[clave] || 0) + (obj2[clave] || 0);
        });

        resultado.push(consolidado);
    }

    mostrarResultadosConsolidados(resultado, respuestasPosibles);
}

// Muestra los resultados consolidados
function mostrarResultadosConsolidados(respuestas, respuestasPosibles) {
    console.log("=== RESULTADOS CONSOLIDADOS ===");
    console.log(respuestas);

    let totalGeneral = 0;
    
    respuestas.forEach((conteo, index) => {
        console.log(`\n--- PREGUNTA ${index + 1} CONSOLIDADA ---`);
        let totalPregunta = 0;
        
        respuestasPosibles.forEach(opcion => {
            console.log(`${opcion}: ${conteo[opcion]}`);
            totalPregunta += conteo[opcion];
        });
        
        console.log(`Total pregunta ${index + 1}: ${totalPregunta}`);
        
        if (index === 0) {
            totalGeneral = totalPregunta;
        }
    });
    
    console.log(`\n=== TOTAL GENERAL: ${totalGeneral} ===`);
}


//validaciones de rangos
function validaciones1(columnaInicio, columnaFin) {
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
            title: 'Error formulario 1',
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
function validaciones2(columnaInicio, columnaFin) {
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
            title: 'Error formulario 2',
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
//come back to the menu
function regresarMenu() {
    window.history.back();
}

// Muestra los resultados en la consola
// function mostrarResultadosConsola1(respuestas, respuestasPosibles,filaInicio, filaFin) {
//     console.log("=== ARCHIVO 1 ===");
//     console.log(respuestas);

//     respuestas.forEach((conteo, index) => {
//         console.log(`\nPregunta ${index + 1}:`);
//         respuestasPosibles.forEach(opcion => {
//             console.log(`${opcion}: ${conteo[opcion]}`);
//         });
//         console.log(`\nTotal: ${filaFin - filaInicio + 1}\n`);
//     });
// }