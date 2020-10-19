
const solicitud = document.querySelector("#solicitudTurno");
// const user_id = document.querySelector("#userId").value;
const botonSubmit = document.querySelector("#submit");

const enviarImagen = async () => {

    const img = document.querySelector("#imagen");

    const formData = new FormData();
    formData.append('imagen', img.files[0]);
    try {
        const result = await fetch('/upload-img', {

            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: formData
    
        });

        const {success} = await result.json();

        return success;

    } catch (error) {
        console.log(error)
    }
    
    

}


solicitud.addEventListener("submit", async (e) => {

    const imgSubida = await enviarImagen();

    if (!imgSubida) {
        console.log("ISDMSMDSDSDSDSDSDSD");
        return;
    }

    desactivarBotones([botonSubmit]);
    agregarSpinner(botonSubmit);

    const dia_id = document.querySelector("#dia").value;
    const horario_id = document.querySelector("#horario").value;
    const msg = document.querySelector("#msg").value;
    const img = document.querySelector("#imagen").value;

    e.preventDefault();

    const data = {
        dia_id,
        horario_id,
        msg
    }

    //console.log(user_id, horario_id, dia_id)

    const result = await fetch("http://localhost:4000/pedirTurno", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    });

    const resultJson = await result.json();

    const { success, redirectAdress, msg: messageError } = resultJson;

    if (success) {
        await swal({
            title: "Envio exitoso!",
            text:
                "Tu solicitud se envio correctamente. Nos comunicaremos con usted a la brevedad.",
            icon: "success",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        });
        document.location.href = `http://localhost:4000${redirectAdress}`

    } else {
        swal({
            title: "No Disponible",
            text:
                `${messageError ? messageError : "Lo sentimos, ocurrio un error y tu solicitud no se envio correctamente"}`,
            icon: "error",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        });
        activarBotones([botonSubmit]);
        quitarSpinner(botonSubmit, "Solicitar Turno");
    }
    

})
