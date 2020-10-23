const cajaBusqueda = document.querySelector("#busqueda");


cajaBusqueda.addEventListener("input", aplicarFiltro);


function aplicarFiltro() {

    const valor = cajaBusqueda.value;

    const rows = document.querySelectorAll("tbody tr");

    if (valor === '') {
        rows.forEach(row => row.style.display = "");
        return;
    } 

    let sinResultados = true;
    rows.forEach(row => {

        const children = Array.from(row.children);

        const filtrado = children.some(data => data.innerText.toLowerCase().includes(valor.toLowerCase()));
        if (filtrado) {
            row.style.display = ""
            sinResultados = false;
        } else {
            row.style.display = "none";
        }
    })
    const texto = document.querySelector("#textoResultado");
    if (sinResultados) {
        texto.innerText = "No se encontraron resultados"       
    } else {
        texto.innerText = "";
    }
}