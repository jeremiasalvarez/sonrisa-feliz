const buttons = document.querySelectorAll('.btn-event-control');

const iconoRechazadoClass = "custom-icon bx bx-x-circle icon-x";

const iconoAceptadoClass = "custom-icon bx bx-check-circle icon-check";


                        
const listaSolicitudes = document.querySelector("#contenedorSolicitudes");

let emailProcesado;
let nombreProcesado;

buttons.forEach(button => button.addEventListener("click", procesarAccion));

function procesarAccion(e) {

    // console.log("PRESIONADO:\n")
    // console.log(e.target);
    const idPresionado = e.target.id;

    const accion = idPresionado.split("_")[0];
    const idSolicitud = idPresionado.split("_")[1];

    emailProcesado = document.querySelector(`#email_${idSolicitud}`).value;
    nombreProcesado = document.querySelector(`#nombre_${idSolicitud}`).value;

    // console.log(`ID SOLICITUD: ${idSolicitud}`)
    // console.log(`ACCION: ${accion}`)


    switch (accion) {

        case 'rechazar':
             rechazarSolicitud(idSolicitud)
            break;
        case 'confirmar': 
             confirmarSolicitud(idSolicitud);
            break;
        default:
            return;    
    }

}

async function rechazarSolicitud(id){

    
    const motivo = document.querySelector(`#motivo_id${id}`).value;

    console.log(motivo);

    const result = await fetch(`/solicitudes/rechazar`,
    {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify({id, motivo, email: emailProcesado, nombre: nombreProcesado})
    }
    );

    const { success } = await result.json();

    if (success) {

        document.querySelector(`#hiddenButtonRechazar_${id}`).click();

        cambiarIconoEstado(id, "del");         
        desactivarCarta(id);
        agregarAlerta(success, "La solicitud fue rechazada correctamente");
     }

}

async function confirmarSolicitud(id) {

    const id_usuario = document.querySelector(`#id_usuario_${id}`).value.split("_")[2];
    
    const data = {
        usuario_id: id_usuario,
        fecha: document.querySelector(`#fecha_${id}`).value,
        horario_id: document.querySelector(`#horario_${id}`).value,
        prestacion_id: document.querySelector(`#prestacion_${id}`).value,
        nombre: nombreProcesado,
        email: emailProcesado
    }
    
    if (!data.fecha) {
        mostrarError(id);
        return;
    }

    const result = await fetch("/solicitudes/aceptar", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    })

    const json = await result.json();

    if (json.success) {

        document.querySelector(`#hiddenButton_${id}`).click();

        cambiarIconoEstado(id, "acc");

        desactivarCarta(id);

        agregarAlerta(success, "Turno programado correctamente!");

    } else {

        console.log(json);
        document.querySelector(`#hiddenButton_${id}`).click();
        agregarAlerta(false, "Algo salio mal. El turno no fue programado correctamente");
    }

}

function mostrarError(id) {

    const errorDiv = document.querySelector(`#error_${id}`);

    errorDiv.classList.remove('d-none');
}

function ocultarError(id) {
    const errorDiv = document.querySelector(`#error_${id}`);

    errorDiv.classList.add('d-none')
}

function cambiarIconoEstado(id, accion) {

    const eliminadoColor = "var(--danger)";
    const aceptadoColor = "var(--success)";

    const className = accion === "del" ? iconoRechazadoClass : iconoAceptadoClass;
    
    const iconoAfectado = document.querySelector(`#estado_${id}`);
    iconoAfectado.classList.forEach(name => {
        iconoAfectado.classList.remove(name)
    });

    className.split(" ").forEach(name => {
        iconoAfectado.classList.add(name);
    })
    
    iconoAfectado.style.color = accion === "del" ? eliminadoColor : aceptadoColor;
}

function desactivarCarta(id) {
    
    const link = document.querySelector(`#solicitudLink_${id}`);
    const arrows = document.querySelectorAll(`#solicitudLink_${id} i`);

    arrows.forEach(arrow => arrow.style.color = "#6c757d");

    link.style.pointerEvents = "none";
    link.style.color = "#6c757d";
    link.click();

    const carta = document.querySelector(`#solicitudCarta_${id}`);
}

function agregarAlerta(exito, texto) {

    const alertTemplate = `<div class="alert alert-warning alert-dismissible fade show"         role="alert">
<strong>Holy guacamole!</strong> You should check in on some of those fields below.
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
                        </div>`;
    const alertaDiv = document.createElement("div");

    const botonCerrar = document.createElement("button");
    botonCerrar.classList.add("close");
    botonCerrar.setAttribute("data-dismiss", "alert");
    botonCerrar.setAttribute("aria-label", "Close");
    botonCerrar.innerHTML = `<span aria-hidden="true">&times;</span>`;

    
    const tipo = exito ? "alert-success" : "alert-danger";

    "alert alert-dismissible fade show".split(" ").forEach(className => {
        alertaDiv.classList.add(className);
    })

    alertaDiv.classList.add(`${tipo}`);

    alertaDiv.innerHTML = `<strong>${texto}</strong>`;

    alertaDiv.setAttribute("role", "alert");

    alertaDiv.appendChild(botonCerrar);

    listaSolicitudes.prepend(alertaDiv);


}