// Cargar el DOM antes de ejecutar su funcion
document.addEventListener("DOMContentLoaded", function () {
    //llama la funcion cuando el DOM esta listos
    inicializarFormulario();
});

// Inicializa el formulario y sus eventos
function inicializarFormulario() {
    // Obtiene el elemento del formulario y el input de archivo
    const formulario = document.getElementById("inputsFormulario");
    const fileInput = document.getElementById("fileInput");

    // captura el evento submit del formulario
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        procesarFormulario(fileInput);
    });
}

// extraccion de parametros
function procesarFormulario(fileInput) {

    const colInicio = document.getElementById("columnaInicio").value.toUpperCase();
    const colFin = document.getElementById("columnaFin").value.toUpperCase();
    const filInicio = parseInt(document.getElementById("filaInicio").value);
    const filFin = parseInt(document.getElementById("filaFin").value);

    //obtiene el primer archivo subido
    const file = fileInput.files[0];
    if (file) {
        leerArchivo(file, colInicio, colFin, filInicio, filFin);
        //mejorar alerta
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Archivo no seleccionado',
            text: 'Por favor, selecciona un archivo Excel antes de continuar.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    }
}

// Lee el archivo seleccionado
function leerArchivo(file, colInicio, colFin, filInicio, filFin) {
    const reader = new FileReader();

    //cuando el archivo se ha leido correctamente
    reader.onload = function (e) {
        const datos = new Uint8Array(e.target.result);
        const libroTrabajo = XLSX.read(datos, { type: "array" });
        const hojarespuestas = libroTrabajo.SheetNames[0];
        const sheet = libroTrabajo.Sheets[hojarespuestas];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });


        procesarRespuestas(jsonData, colInicio, colFin, filInicio, filFin);
        AlertaProcesado();
    };

    reader.readAsArrayBuffer(file);
}

// Muestra una alerta de éxito al procesar el archivo
function AlertaError() {
    Swal.fire({
        title: "problema",
        text: "El archivo no se procesó correctamente.",

        text: "El archivo se procesó con éxito.",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "Éxito",
        confirmButtonText: "ver graficas"
    }).then((result) => {
        if (result.isConfirmed) {
            alternarSecciones();
        }
    });
}

// Muestra una alerta de éxito al procesar el archivo
function AlertaProcesado() {
    Swal.fire({
        title: "¡Archivo procesado!",
        text: "El archivo se procesó con éxito.",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "Éxito",
        confirmButtonText: "ver graficas"
    }).then((result) => {
        if (result.isConfirmed) {
            alternarSecciones();
        }
    });
}

// Alterna entre las secciones del formulario y las gráficas
function alternarSecciones() {
    const formulario = document.getElementById("formulario-individual");
    const graficas = document.getElementById("graficas");

    formulario.classList.remove("ver");
    formulario.classList.add("ocultar");

    graficas.classList.remove("ocultar");
    graficas.classList.add("ver");
}

// Procesa las respuestas del archivo
function procesarRespuestas(datos, colInicio, colFin, filaInicio, filaFin) {
    const respuestasPosibles = [
        "Totalmente en desacuerdo",
        "En desacuerdo",
        "Ni de acuerdo, ni en desacuerdo",
        "De acuerdo",
        "Totalmente de acuerdo"
    ];

    const indiceColInicio = XLSX.utils.decode_col(colInicio);
    const indiceColFin = XLSX.utils.decode_col(colFin);
    const respuestas = [];

    for (let col = indiceColInicio; col <= indiceColFin; col++) {
        let conteoRespuestas = inicializarConteoRespuestas(respuestasPosibles);

        for (let fila = filaInicio - 1; fila < filaFin; fila++) {
            let respuesta = datos[fila]?.[col];
            if (respuestasPosibles.includes(respuesta)) {
                conteoRespuestas[respuesta]++;
            }
        }

        respuestas.push(conteoRespuestas);
    }

    mostrarResultadosConsola(respuestas, respuestasPosibles, filaInicio, filaFin);
    generarGraficas(respuestas);
}

// Inicializa el conteo de respuestas
function inicializarConteoRespuestas(respuestasPosibles) {
    const conteo = {};
    respuestasPosibles.forEach(respuesta => {
        conteo[respuesta] = 0;
    });
    return conteo;
}

// Muestra los resultados en la consola
function mostrarResultadosConsola(respuestas, respuestasPosibles, filaInicio, filaFin) {
    console.log(respuestas);

    respuestas.forEach((conteo, index) => {
        console.log(`\nPregunta ${index + 1}:`);
        respuestasPosibles.forEach(opcion => {
            console.log(`${opcion}: ${conteo[opcion]}`);
        });
        console.log(`\nTotal: ${filaFin - filaInicio + 1}\n`);
    });
}

// Genera las gráficas de las respuestas
function generarGraficas(respuestas) {
    const container = document.getElementById("graficas");
    container.innerHTML = "";

    respuestas.forEach((conteo, index) => {
        const col = document.createElement("div");
        col.className = "col-md-6 mb-4";

        const chartContainer = document.createElement("div");
        chartContainer.className = "p-3 shadow rounded bg-white";
        chartContainer.style.height = "400px";

        const canvas = document.createElement("canvas");
        canvas.id = `grafica-${index}`;
        chartContainer.appendChild(canvas);
        col.appendChild(chartContainer);
        container.appendChild(col);

        const labels = Object.keys(conteo);
        const data = labels.map(label => conteo[label]);

        new Chart(canvas, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: `Pregunta ${index + 1}`,
                    data: data,
                    backgroundColor: [
                        "#6eab46",
                        "#4270c1",
                        "#fbbd00",
                        "#42662a",
                        "#244276"
                    ],
                    borderColor: "#ffffff",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Respuestas - Pregunta ${index + 1}`
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value}`, // Muestra "Etiqueta: Valor"
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor,
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    }
                }
            }
        });
    });

    // Agregar botón "Descargar PDF"
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Descargar PDF";
    downloadButton.className = "btn btn-primary mt-4";
    downloadButton.onclick = generarPDF; // Asocia la función para generar el PDF
    container.appendChild(downloadButton);
}

//promesa
function esperarRenderizadoDeGraficas() {
    return new Promise((resolve) => {
        const total = document.querySelectorAll("canvas[id^='grafica-']").length;
        let listos = 0;
        const checkListos = setInterval(() => {
            listos = 0;
            document.querySelectorAll("canvas[id^='grafica-']").forEach(canvas => {
                if (canvas.offsetHeight > 0 && canvas.offsetWidth > 0) {
                    listos++;
                }
            });
            if (listos === total) {
                clearInterval(checkListos);
                resolve();
            }
        }, 200); // revisa cada 200ms
    });
}


// Función para generar el PDF
function generarPDF() {
    const canvases = document.querySelectorAll("canvas[id^='grafica-']");
    const pdf = new window.jspdf.jsPDF("p", "mm", "a4");

    const graficasPorPagina = 6;
    const imgWidth = 90; // ancho en mm
    const imgHeight = 70; // alto en mm
    const marginX = 10;
    const marginY = 10;
    const espacioVertical = 85;   // 70mm alto + 15mm espacio
    const espacioHorizontal = 100; // 90mm ancho + 10mm espacio

    let x = marginX;
    let y = marginY;
    let count = 0;

    canvases.forEach((canvas, index) => {
        const imgData = canvas.toDataURL("image/png");

        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

        count++;

        // Alternar entre columnas
        if (count % 2 === 0) {
            x = marginX;         // reiniciar columna izquierda
            y += espacioVertical; // mover a la siguiente fila
        } else {
            x += espacioHorizontal; // mover a la derecha
        }

        // Saltar de página cada 6 gráficas
        if (count % graficasPorPagina === 0 && index !== canvases.length - 1) {
            pdf.addPage();
            x = marginX;
            y = marginY;
        }
    });
    const nameEncuesta = document.getElementById("nombreEncuesta").value;

    pdf.save("graficas - " + nameEncuesta + ".pdf");
}