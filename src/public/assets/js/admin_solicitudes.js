const buttons = document.querySelectorAll('.btn-event-control');

const iconoRechazadoClass = "custom-icon bx bx-x-circle icon-x";

const iconoAceptadoClass = "custom-icon bx bx-check-circle icon-check";




buttons.forEach(button => button.addEventListener("click", procesarAccion));

function procesarAccion(e) {

    // console.log("PRESIONADO:\n")
    // console.log(e.target);
    const idPresionado = e.target.id;

    const accion = idPresionado.split("_")[0];
    const idSolicitud = idPresionado.split("_")[1];

    // console.log(`ID SOLICITUD: ${idSolicitud}`)
    // console.log(`ACCION: ${accion}`)

    const data = {
        id_solicitud: idSolicitud,
        fecha: document.querySelector(`#fecha_${idSolicitud}`).value,
        horario_id: document.querySelector(`#horario_${idSolicitud}`).value,
        prestacion_id: document.querySelector(`#prestacion_${idSolicitud}`).value
    }

    switch (accion) {

        case 'rechazar':
             rechazarSolicitud(idSolicitud)
            break;
        case 'confirmar': 
             confirmarSolicitud(data);
            break;
        default:
            return;    
    }

}

async function rechazarSolicitud(id){

    cambiarIconoEstado(id, "del");

    desactivarCarta(id);

    return;

    const confirm = await swal({
        title: "¿Esta seguro(a)?",
        text: "Una vez eliminada, ya no podra ver la solicitud",
        icon: "warning",
        buttons: true,
        dangerMode: true,
                });
    
    if (!confirm) return;

    const result = await fetch(`/solicitudes/rechazar?id=${id}`,
    {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify({id})
    }
    );

    const { success } = await result.json();

    if (success) {
        const iconoEliminado = document.querySelector(`#estado_${id}`);
        const pendienteClass = iconoEliminado.classList.values();

        iconoEliminado.className.replace(pendienteClass, iconoRechazadoClass);

    }

}

function confirmarSolicitud(data) {

    const { id_solicitud: id, fecha } = data;

    if (!fecha) {
        mostrarError(id);
        return;
    }

    document.querySelector(`#hiddenButton_${id}`).click();

    cambiarIconoEstado(id, "acc");

    desactivarCarta(id);

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