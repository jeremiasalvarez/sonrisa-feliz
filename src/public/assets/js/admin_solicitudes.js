const buttons = document.querySelectorAll('.btn-event-control');

const iconoRechazadoClass = "custom-icon bx bx-x-circle icon-x";

const iconoAceptadoClass = "custom-icon bx bx-check-circle icon-check";

const spinner =  '<i class="fas fa-spin fa-spinner"></i>';


                        
const listaSolicitudes = document.querySelector("#contenedorSolicitudes");

let emailProcesado;
let nombreProcesado;

buttons.forEach(button => button.addEventListener("click", procesarAccion));

async function procesarAccion(e) {

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
            const botonesRechazar = [document.querySelector(`#rechazar_${idSolicitud}`), document.querySelector(`#cerrarModalRechazar_${idSolicitud}`)];
             desactivarBotones(botonesRechazar);
             agregarSpinner(document.querySelector(`#rechazar_${idSolicitud}`));
             await rechazarSolicitud(idSolicitud)
            
            quitarSpinner(document.querySelector(`#rechazar_${idSolicitud}`), "Confirmar");
            activarBotones(botonesRechazar);
            break;
        case 'confirmar': 
            const botonesProgramar = [document.querySelector(`#confirmar_${idSolicitud}`), document.querySelector(`#cerrarModalProgramar_${idSolicitud}`)];
            desactivarBotones(botonesProgramar);
            agregarSpinner(document.querySelector(`#confirmar_${idSolicitud}`));
            await confirmarSolicitud(idSolicitud);
            quitarSpinner(document.querySelector(`#confirmar_${idSolicitud}`), "Confirmar");
            activarBotones(botonesProgramar);
            break;
        default:
            return;    
    }
}

async function delayPrueba() {

    return new Promise((res, rej) => {
        res();
    })
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
        id,
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

    const { success, msg, ocupado } = await result.json();

    //console.log(success, msg);



    if (success) {

        document.querySelector(`#hiddenButton_${id}`).click();

        cambiarIconoEstado(id, "acc");

        desactivarCarta(id);

        agregarAlerta(success, "Turno programado correctamente!");

    } else {

        if (ocupado) {
            swal({
                title: "No Disponible",
                text: msg,
                icon: "error",
                button: {
                    text: "Entendido",
                    value: true,
                    visible: true,
                    className: "btn btn-primary btn-xl js-scroll-trigger",
                    closeModal: true,
                },
            });
        }

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

function agregarSpinner(boton) {

    console.log(boton);

    boton.innerHTML = spinner;
}

function quitarSpinner(boton, texto) {

    boton.innerHTML = texto;

}

function desactivarBotones(botones){

    botones.forEach(boton => boton.style.pointerEvents = "none")

}

function activarBotones(botones) {

    botones.forEach(boton => boton.style.pointerEvents = "all")
}

