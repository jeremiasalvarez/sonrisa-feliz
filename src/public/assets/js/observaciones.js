const checkboxes = document.querySelectorAll("input[type='checkbox']");
let htmlBackup;
let nuevoHtml;

checkboxes.forEach(checkbox => {
    unCheck(checkbox);
    checkbox.addEventListener("CheckboxStateChange", edicion);
});

function unCheck(checkbox) {
    checkbox.checked = false;
}

function edicion(e) {

    const activado = e.target.checked == true;
    const id = e.target.id.split("_")[1];
    const textoAnterior = document.querySelector(`#observacionContainer_${id}`).innerText;
    if (activado) {
        
        activarTextArea(id, textoAnterior);
        activarBotonEditar(id);
    } else {
        desactivarTextArea(id);
        desactivarBotonEditar(id)
    }

}


function activarBotonEditar(id) {
    document.querySelector(`#confirmarEdicion_${id}`).disabled = false;
    document.querySelector(`#confirmarEdicion_${id}`).style.pointerEvents = "all";
    document.querySelector(`#confirmarEdicion_${id}`).addEventListener("click", handler);
}

function handler(e) {

    const id = e.target.id.split("_")[1];
    enviarNuevaObservacion(id);
}


function desactivarBotonEditar(id) {
    document.querySelector(`#confirmarEdicion_${id}`).disabled = true;
    document.querySelector(`#confirmarEdicion_${id}`).style.pointerEvents = "none";
    document.querySelector(`#confirmarEdicion_${id}`).removeEventListener("click", handler)
}

function activarTextArea(id, texto) {

    const container = document.querySelector(`#observacionContainer_${id}`);
    htmlBackup = container.innerHTML;
    container.innerHTML = construirTextArea(id, texto);

}

function desactivarTextArea(id) {
    const container = document.querySelector(`#observacionContainer_${id}`);
    container.innerHTML = htmlBackup;
}

function construirTextArea(id, texto) {

    const template = `
    <div id="errorEditar_${id}" style="color: var(--danger)"></div>
    <div class="form-group m-t-10">
        <textarea style="resize: none;" id="observacion_valor_${id}" class="form-control textarea-form" name="msg" rows="5"
        placeholder=${texto ? "" : "Observaciones.."}>${texto ? texto : ""}
        </textarea>
    </div>`
    return template;
}

function actualizarHtml(id, texto) {

    const container = document.querySelector(`#observacionContainer_${id}`);

    container.innerHTML = texto;
} 


async function enviarNuevaObservacion(id) {

    const nuevaObservacion = document.querySelector(`#observacion_valor_${id}`).value;

    if(nuevaObservacion == '') {

        document.querySelector(`#errorEditar_${id}`).innerText = "El texto no puede estar vacio";
        return;
    }

    const boton = document.querySelector(`#confirmarEdicion_${id}`);
    desactivarBotones([boton]);
    agregarSpinner(boton);

    const data = {
        id_historia: id,
        observacion: nuevaObservacion
    }

    const result = await fetch("/api/observaciones", {

        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)

    })

    const { success, msg } = await result.json();

    console.log(success);

    if (success) {

        swal({
            title: "Historia clinica actualizada",
            text:
                msg,
            icon: "success",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        });
        
        activarBotones([boton]);
        quitarSpinner(boton, "Guardar Cambios");
        document.querySelector(`#hiddenButtonConfirmar_${id}`).click();
        htmlBackup = nuevaObservacion;
        actualizarHtml(id, nuevaObservacion);
        desactivarBotonEditar(id);
    } else {
        swal({
            title: "Algo salio mal",
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

}
