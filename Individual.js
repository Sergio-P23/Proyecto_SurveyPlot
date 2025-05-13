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
    const nameEncuesta = document.getElementById("nombreEncuesta").value;
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
        alert("Por favor, selecciona un archivo.");
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
    const container = document.getElementById("graficas");
    const downloadButton = document.querySelector("#graficas button");

    // Guardar estilos originales
    const originalStyle = container.getAttribute("style") || "";
    const originalClass = container.className;

    // Aplicar estilos temporales seguros para captura
    container.style.position = "static";
    container.style.overflow = "visible";
    container.style.maxHeight = "none";
    container.style.width = "100%";
    container.classList.remove("ocultar");
    container.classList.add("ver");
    downloadButton.style.display = "none";

    esperarRenderizadoDeGraficas().then(() => {
        html2canvas(container, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new window.jspdf.jsPDF("p", "mm", "a4");

            const imgWidth = 190;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("graficas.pdf");

            // Restaurar estado original
            container.setAttribute("style", originalStyle);
            container.className = originalClass;
            downloadButton.style.display = "block";
        }).catch((error) => {
            console.error("Error al generar el PDF:", error);
        });
    });
}