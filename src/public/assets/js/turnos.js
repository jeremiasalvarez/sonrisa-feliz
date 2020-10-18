

const initEventos = () => {

    console.log("cargado")

    const celdas = document.querySelectorAll(".fc-day");

    celdas.forEach(celda => celda.addEventListener("click", abrirModal));


}


function abrirModal(e) {

    console.log(e.target);
}