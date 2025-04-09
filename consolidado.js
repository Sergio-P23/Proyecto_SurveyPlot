let respuestas = [];

//Cargar el DOM antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
    //Buscael el docymento HTML referencias a elementos del formulario
    const formulario = document.getElementById("inputsFormulario");
    const fileInput = document.getElementById("fileInput");

    //es un evento que tiene una funcion define lo que pasara cuando el usuario envía el formulario
    formulario.addEventListener("submit", function (event) {
        //evita que se recargue la pagina html
        event.preventDefault();
        //Capturar los datos ingresados por el usuario y almacenarlos en variables
        const nombreEncuesta = document.getElementById("nombreEncuesta").value;
        const columnaInicio = document.getElementById("columnaInicio").value.toUpperCase();
        const columnaFin = document.getElementById("columnaFin").value.toUpperCase();
        const filaInicio = parseInt(document.getElementById("filaInicio").value);
        const filaFin = parseInt(document.getElementById("filaFin").value);
        
        //Validar que los campos sean correctos(eliminar apenas funcione)
        console.log("Nombre de la Encuesta:", nombreEncuesta);
        console.log("Columna de Inicio:", columnaInicio);
        console.log("Columna de Fin:", columnaFin);
        console.log("Fila donde inician las preguntas:", filaInicio);
        console.log("Fila donde terminan las preguntas:", filaFin);

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            procesarRespuestas(jsonData, columnaInicio, columnaFin, filaInicio, filaFin);
            alert("Archivo procesado con éxito.");
        };

        reader.readAsArrayBuffer(file);
    });

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

        

        for (let col = indiceColInicio; col <= indiceColFin; col++) {
            let conteoRespuestas = {
                "Totalmente en desacuerdo": 0,
                "En desacuerdo": 0,
                "Ni de acuerdo, ni en desacuerdo": 0,
                "De acuerdo": 0,
                "Totalmente de acuerdo": 0
            };

            for (let fila = filaInicio - 1; fila < filaFin; fila++) {
                let respuesta = datos[fila]?.[col];
                if (respuestasPosibles.includes(respuesta)) {
                    conteoRespuestas[respuesta]++;
                }
            }

            // console.log(`\nPregunta ${col - indiceColInicio + 1}`);
            
            //Mostramos las respuestas en el orden correcto
            // respuestasPosibles.forEach(respuesta => {
            //     console.log(`${respuesta}\t${conteoRespuestas[respuesta]}`);
            // });

            respuestas.push(conteoRespuestas);
            

            //console.log(`\nTotal: ${filaFin - filaInicio + 1}\n`); 
        }
        let respuestas2=respuestas;
        console.log(respuestas);
        console.log(respuestas2);

        
        const consolidado = respuestas.map((obj, i) => ({

            "Totalmente en desacuerdo": obj["Totalmente en desacuerdo"] + respuestas2[i]["Totalmente en desacuerdo"],
                "En desacuerdo": obj["En desacuerdo"] + respuestas2[i]["En desacuerdo"],
                "Ni de acuerdo, ni en desacuerdo": obj["Ni de acuerdo, ni en desacuerdo"] + respuestas2[i]["Ni de acuerdo, ni en desacuerdo"],
                "De acuerdo": obj["De acuerdo"] + respuestas2[i]["De acuerdo"],
                "Totalmente de acuerdo":obj["Totalmente de acuerdo"] + respuestas2[i]["Totalmente de acuerdo"],
          }));
        
        console.log(consolidado); 
        

    }
    
});
