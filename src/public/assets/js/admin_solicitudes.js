const buttons = document.querySelectorAll('.btn-event-control');

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

    if (!data.fecha) {
        mostrarError(idSolicitud)
    } else {
        ocultarError(idSolicitud)
    }

    switch (accion) {

        case 'rechazar':
             rechazarSolicitud(idSolicitud)
            break;
        case 'confirmar': 
            // confirmarSolicitud(idSolicitud);
            break;
        default:
            return;    
    }

}

async function rechazarSolicitud(id){

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

    }

    console.log(json);

}

function confirmarSolicitud(id) {
    console.log("funcion confirmar")
}

function mostrarError(id) {

    const errorDiv = document.querySelector(`#error_${id}`);

    errorDiv.classList.remove('d-none');
}

function ocultarError(id) {
    const errorDiv = document.querySelector(`#error_${id}`);

    errorDiv.classList.add('d-none')

}