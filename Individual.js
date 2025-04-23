//Cargar el DOM antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
    //Buscael el docymento HTML referencias a elementos del formulario
    const formulario = document.getElementById("inputsFormulario");
    const fileInput = document.getElementById("fileInput");

    //es un evento que tiene una funcion define lo que pasara cuando el usuario envía el formulario
    formulario.addEventListener("submit", function (event) {
        //evita que se recargue la pagina html QUITAR CUANDO SE AÑADA ALERTA DE DESCARGAR
        event.preventDefault();
        //Capturar los datos ingresados por el usuario y almacenarlos en variables
        const nameEncuesta = document.getElementById("nombreEncuesta").value;
        const colInicio = document.getElementById("columnaInicio").value.toUpperCase();
        const colFin = document.getElementById("columnaFin").value.toUpperCase();
        const filInicio = parseInt(document.getElementById("filaInicio").value);
        const filFin = parseInt(document.getElementById("filaFin").value);

        //lista de archivos subidos por el usuario, en este caso solo uno
        const file = fileInput.files[0];
        //Crea un objeto FileReader, que permite leer archivos en el navegador
        const reader = new FileReader();

        //El evento onload se activa cuando el archivo se ha leído correctamente
        reader.onload = function (e){
            //Convierte el archivo Excel a una estructura binaria que pueda ser procesada por XLSX(e.target.result contiene los datos leídos) 
            const datos = new Uint8Array(e.target.result);
            //almacenamos el libro para trabajar con la funcion XLSX.read
            const libroTrabajo= XLSX.read(datos, { type: "array" });

            //analizamos la primera hoja
            const hojarespuestas = libroTrabajo.SheetNames[0];
            //accedemos a la hoja de respuestas
            const sheet = libroTrabajo.Sheets[hojarespuestas];
            //Convierte una hoja Excel a un arreglo de filas (cada fila del excel es un arreglo)
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            //Estamos listos para analizar las respuestas de los usuarios en el rango que nos interesa.
            procesarRespuestas(jsonData, colInicio, colFin, filInicio, filFin);
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
                    // Oculta el formulario
                    document.getElementById("formulario").classList.add("d-none");
            
                    // Muestra la sección de gráficas
                    document.getElementById("graficas").classList.remove("d-none");
                    document.getElementById("graficas").classList.add("d-block");
                }
            });
        };
        //lee el archivo seleccionado como un bloque binario 
        reader.readAsArrayBuffer(file);
    });
    //variable para almacenar las respuestas procesadas
    let respuestas = [];

    //Función para procesar las respuestas
    function procesarRespuestas(datos, colInicio, colFin, filaInicio, filaFin) {
        //inicializar el arreglo de respuestas
        const respuestasPosibles = [
            "Totalmente en desacuerdo",
            "En desacuerdo",
            "Ni de acuerdo, ni en desacuerdo",
            "De acuerdo",
            "Totalmente de acuerdo"
        ];
        //función convierte una letra de columna de Excel a su índice numérico (A=0, B=1, C=2, etc.)
        const indiceColInicio = XLSX.utils.decode_col(colInicio);
        const indiceColFin = XLSX.utils.decode_col(colFin);

        //bucle que se repetira por cada columna en el rango especificado por el usuario
        for (let col = indiceColInicio; col <= indiceColFin; col++) {
            //crear objeto literal para cada pregunta
            let conteoRespuestas = {
                "Totalmente en desacuerdo": 0,
                "En desacuerdo": 0,
                "Ni de acuerdo, ni en desacuerdo": 0,
                "De acuerdo": 0,
                "Totalmente de acuerdo": 0
            };
            //bucle que se repetira por cada fila en el rango especificado por el usuario
            for (let fila = filaInicio - 1; fila < filaFin; fila++) {
                //Acceder a la respuesta en la fila y columna especificadas
                let respuesta = datos[fila]?.[col];
                //verificar si la respuesta es válida (no es undefined o null)
                if (respuestasPosibles.includes(respuesta)) {
                    conteoRespuestas[respuesta]++;
                }
            }
            // Agregar el conteo de respuestas al arreglo de respuestas
            respuestas.push(conteoRespuestas);
        }
        // Mostrar el conteo de respuestas en la consola
        console.log(respuestas);
        
        // Mostrar resultados ordenados por columna
        respuestas.forEach((conteo, index) => {
            console.log(`\nPregunta ${index + 1}:`);
            respuestasPosibles.forEach(opcion => {
                console.log(`${opcion}: ${conteo[opcion]}`);
            });
            //total
            console.log(`\nTotal: ${filaFin - filaInicio + 1}\n`);
        });
        
    }
});


