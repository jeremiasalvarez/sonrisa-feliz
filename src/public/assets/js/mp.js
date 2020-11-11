
const botonesPagar = document.querySelectorAll(".btn-pagar");


const addEvents = () => {

    botonesPagar.forEach(boton => {
        boton.addEventListener("click", procesarPago);
    })
}

addEvents();

const actualizarEstado = () => {

    const estados = document.querySelectorAll(".estado-pago");

    estados.forEach(estado => {

        const id = estado.id.split("_")[1];
        const yaPago = estado.value == 1;

        if (yaPago) {
            cambiarIconoEstado(id, "acc");
            // desactivarCartaPago(id);
            cambiarTextoEstado(id);
            actualizarBoton(id);
            agregarTicket(id);
        }
    })
}

actualizarEstado();

function actualizarBoton(id) {

    const boton = document.querySelector(`#botonPagar_${id}`);

    boton.removeEventListener("click", procesarPago);
    boton.addEventListener("click", () => {
        verInforme(id);
    });
    boton.innerHTML = "Ver Informe"
    boton.setAttribute("data-toggle","modal");
    boton.setAttribute("data-target",`#modalInforme_${id}`);
}

function verInforme(id) {



}


function cambiarTextoEstado(id) {

    const texto = document.querySelector(`#pendiente_id_${id} .texto-estado`);
    
    texto.classList.remove("text-danger")
    texto.classList.add("text-success")

    texto.innerHTML = `<strong>Turno abonado correctamente.</strong>`
    
}

function agregarTicket(id) {



}


function desactivarCartaPago(id) {

    const link = document.querySelector(`#pendienteLink_${id}`);
    const arrows = document.querySelectorAll(`#pendienteLink_${id} i`);

    arrows.forEach(arrow => arrow.style.color = "#6c757d");

    link.style.pointerEvents = "none";
    link.style.color = "#6c757d";

}

async function procesarPago(e) {

    const id = e.target.id.split("_")[1];
    const botonPresionado = document.getElementById(`botonPagar_${id}`);

    agregarSpinner(botonPresionado);
    desactivarBotones([botonPresionado]);   

    const redirect = await getLinkDePago(id);
    document.location.href = `${redirect}`
    quitarSpinner(botonPresionado, "Pagar Solicitud");
    activarBotones([botonPresionado]);
    // cambiarIconoEstado(id, "acc");

}

async function getLinkDePago(id) {

    try {
        
        const data = {
            id_pendiente: id,
            product: document.querySelector(`#pendientePrestacion_${id}`).value,
            price: document.querySelector(`#pendientePrecio_${id}`).value
        }

        let link = await fetch("/api/v1/mercadopago", {

            method: 'post',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: JSON.stringify(data)
        });
        link = await link.json();
        console.log(link.body.init_point);
        return link.body.init_point;
    } catch (error) {
        
    }

}


