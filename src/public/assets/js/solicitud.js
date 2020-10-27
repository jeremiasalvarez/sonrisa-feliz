
let fechaSeleccionada;

const solicitud = document.querySelector("#solicitudTurno");

const botonSubmit = document.querySelector("#submit");

let imgUrl;

(() => {
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });
    const diaInput = document.getElementById('dia');
    diaInput.value = new Date().toDateInputValue();
    fechaSeleccionada = diaInput.value;
    diaInput.addEventListener("change", () => {
        fechaSeleccionada = diaInput.value;
        cargarHorariosDisponibles();
    })
    cargarHorariosDisponibles();
})()

async function cargarHorariosDisponibles() {

    botonSubmit.style.backgroundColor = "#6c757d";
    desactivarBotones([botonSubmit])

    document.querySelector("#spinnerHorario i").style.display = "block";
    document.getElementById("horario").classList.add("d-none");

    document.querySelector("#spinnerHorario").classList.add("m-t-5");

    const errDiv = document.getElementById("divErrorHorario");
    errDiv.classList.add("d-none")


    let result = await fetch(`/api/horarios-disponibles?fecha=${fechaSeleccionada}`);

    const { success, horarios, msg} = await result.json();
    
    if (success) {
        construirSelectBox(horarios);
        errDiv.innerText = ""
        document.getElementById("horario").style.display = "block";
        document.getElementById("horario").classList.remove("d-none");
        document.querySelector("#spinnerHorario i").style.display = "none";
        document.querySelector("#spinnerHorario").classList.remove("m-t-5");
        activarBotones([botonSubmit])
        botonSubmit.style.backgroundColor = "var(--primary)";
    } else {
        errDiv.innerText = msg;
        errDiv.classList.remove("d-none")

        document.querySelector("#spinnerHorario i").style.display = "none";
        document.querySelector("#spinnerHorario").classList.remove("m-t-5");

    } 

}

function construirSelectBox(horarios) {

    const selectBox = document.querySelector("#horario");
    limpiar(selectBox);

    horarios.forEach(horario => {

        const option = document.createElement("option");

        option.value = horario.id;

        option.innerText = `${horario.hora_inicio} - ${horario.hora_fin}`;

        selectBox.appendChild(option);
    })

}

function limpiar(selectBox) {

    while (selectBox.firstChild) {
        selectBox.firstChild.remove()
    }
}


function enviarImagen() {


    return new Promise((resolve, reject) => {

        const file = document.querySelector("#imagen").files[0];

        if (!file) {
            
            swal({
                title: "No selecciono una imagen",
                text: "Debe seleccionar una imagen representativa para solicitar un turno",
                icon: "error",
                button: {
                    text: "Entendido",
                    value: true,
                    visible: true,
                    className: "btn btn-primary btn-xl js-scroll-trigger",
                    closeModal: true,
                },
            })
        }

        getSignedRequest(file);

        function getSignedRequest(file){

            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/sign-s3?file_name=${file.name}&file_type=${file.type}`, false);
            xhr.onreadystatechange = () => {
              if(xhr.readyState === 4){
                if(xhr.status === 200){
                  const response = JSON.parse(xhr.responseText);
                  uploadFile(file, response.signedRequest, response.url);
                }
                else{
                    reject(xhr.responseText);
                }
              }
            };
            xhr.send();
        }
        
        function uploadFile(file, signedRequest, url){
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', signedRequest, false);
            xhr.onreadystatechange = () => {
              if(xhr.readyState === 4){
                if(xhr.status === 200){
                    // console.log(url);
                    imgUrl = url;
                    resolve(url);
                }
                else{
                    reject(JSON.stringify(xhr.responseText));
                }
              }
            };
            xhr.send(file);
        
        }



    })
        
}




solicitud.addEventListener("submit", async (e) => {

    
    e.preventDefault();
    desactivarBotones([botonSubmit]);
    agregarSpinner(botonSubmit);

    try {
        await enviarImagen();
    } catch (error) {
        
        const err = JSON.parse(error);
        console.log(error);
        if (err && err.wrongType){
            swal({
                title: "No Disponible",
                text:
                    `${err.msg ? err.msg : "Lo sentimos, ocurrio un error y tu solicitud no se envio correctamente"}`,
                icon: "error",
                button: {
                    text: "Entendido",
                    value: true,
                    visible: true,
                    className: "btn btn-primary btn-xl js-scroll-trigger",
                    closeModal: true,
                },
            })
            
            console.log("No se mando nada porque no se pudo subir la imagen");
            activarBotones([botonSubmit]);
            quitarSpinner(botonSubmit, "Solicitar Turno");
            return;
        }

    }


    const fecha_solicitada = document.querySelector("#dia").value;
    const horario_id = document.querySelector("#horario").value;
    const msg = document.querySelector("#msg").value;

    const data = {
        fecha_solicitada,
        horario_id,
        msg,
        imgPath: imgUrl
    }

    const result = await fetch("/pedirTurno", {
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
        document.location.href = `${redirectAdress}`

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
