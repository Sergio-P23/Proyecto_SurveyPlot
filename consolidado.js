//cargar el DOM
document.addEventListener("DOMContentLoaded", function() {
    inicializarFormularios();
});

//inicializar los formularios
function inicializarFormularios(){
    const formulario1 = document.getElementById("inpustFormulario1");
    const formulario2 = document.getElementById("inpustFormulario2");

    const fileInput1 = document.getElementById("fileInput1");
    const fileInput2 = document.getElementById("fileInput2");

    formulario1.addEventListener("submit", function(event) {
        //RECARGAR LA PAGINA
        //event.preventDefault();
        procesarFormulario1(fileInput1);
    });
    formulario2.addEventListener("submit", function(event) {
        //RECARGAR LA PAGINA
        //event.preventDefault();
        procesarFormulario2(fileInput2);
    });
}

//lectua de rangos formularios
function procesarFormulario1(file1) {
    const colInicio = document.getElementById("colInicio");
    const colFin = document.getElementById("colFin");
    const filaInicio = document.getElementById("filaInicio");
    const filaFin = document.getElementById("filaFin");


}
function procesarFormulario2(file2) {
    const colInicio = document.getElementById("colInicio");
    const colFin = document.getElementById("colFin");
    const filaInicio = document.getElementById("filaInicio");
    const filaFin = document.getElementById("filaFin");
}





function regresarMenu(){
    window.history.back();
}