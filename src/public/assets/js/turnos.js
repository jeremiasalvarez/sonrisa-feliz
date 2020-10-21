let seleccionado;

let botonConfirmarReprogramar;
let botonConfirmarCancelar;


const activarAside = () => {

    document.querySelector("#spinnerContainer").remove();
    document.querySelector("aside").style.display = "block";
    document.querySelector("section").style.height = "unset";
}

const ordenarTurnos = (turns) => {

    return turns.sort((a, b) => a.id_horario - b.id_horario);
}

const clearEventos = () => {

    document.querySelectorAll(".fc-day div").forEach(n => {

        n.style.pointerEvents = "none"
    } );

}

const initEventos = () => {

    clearEventos();

    const celdas = document.querySelectorAll(".fc-day");

    celdas.forEach(celda => celda.addEventListener("click", turnosDelDia));

    const botonNext = document.querySelector(".fc-button-next");
    const botonPrev = document.querySelector(".fc-button-prev");
    const botonToday = document.querySelector(".fc-button-today");

    [botonNext, botonPrev, botonToday].forEach(boton => boton.addEventListener("click", initEventos));

     console.log(turnos)
}

function formatDate(fecha) {

    const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ];

    const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado"
    ];


    const split = fecha.split("/");
    let mes = split[1];
    let numero = split[0];
    let año = split[2];
    // console.log(fecha);
    let date = new Date(`${mes}/${numero}/${año}`);

    // console.log(date.getUTCDay());
    const dia = date.getUTCDay();

    if (numero < 10) {
        numero = numero[1];
    }

    return `${dias[dia]}, ${numero} de ${meses[mes - 1]} del ${año}`;

}


const appendAside = (fecha) => {

    const aside = document.querySelector("#turnosDia");

    console.log(`Fecha seleccionada: ${fecha}`);

    formatDate(fecha) 
    document.querySelector("#turnosDia .title h4").innerHTML = formatDate(fecha)    


    const divInicial = document.createElement("div");

    divInicial.classList.add("p-0");

    let turnosEnFecha = turnos.filter(turno => turno.fecha === fecha);
    turnosEnFecha = ordenarTurnos(turnosEnFecha);

    // console.log(turnosEnFecha)

    // console.log(aside.childNodes)

    if (aside.childNodes.length > 4) aside.childNodes[4].remove();

    // aside.childNodes.forEach((node, index) => {
    //     if (index === 4 && aside.childNodes.length > 4) node.remove();
    // })
    
    if (turnosEnFecha.length === 0){ 
        
        divInicial.innerHTML = "<p>Sin turnos</p>"

        aside.appendChild(divInicial);

        return;

    }

    turnosEnFecha.forEach(turno => {

        const { id_turno, 
                nombre_paciente, 
                telefono, 
                apellido, 
                nombre_prestacion,
                id_usuario,
                hora_fin,
                hora_inicio,
                dia,
                fechaNombre,
                email,
                dni,
                img_ruta} = turno;


        const row = document.createElement("div");

        row.classList.add("turno", "row");
        row.id = `turnoContainer_${id_turno}`
        
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("p-0", "col-xl");

        cardContainer.innerHTML = 
        `<a id="tituloTurno_${id_turno}" data-toggle="collapse" 
        href="#collapseTurno${id_turno}"  
        role="button"
        aria-expanded="true" aria-controls="collapseExample1"
        class="btn btn-primary btn-block p-0 shadow-sm with-chevron collapsed">
            <p class="d-flex align-items-center justify-content-between mb-0 px-3 py-2"><strong
                    class="text-left">Horario: ${hora_inicio} - ${turno.hora_fin} <br> Paciente: ${[apellido, nombre_paciente].join(" ")}</strong><i class="fa fa-angle-down"></i>
            </p>
        </a>
        <div id="collapseTurno${id_turno}" class="collapse shadow-sm show">
					<div class="card">
						<div class="card-body">
                            <p class="font-italic mb-0 ">
                            <input type="hidden" id="imgRuta_${id_turno}" value="${img_ruta}">
                            <input type="hidden" id="diaAnterior_${id_turno}" value="${dia}">
                            <input type="hidden" id="fechaAnterior_${id_turno}" value="${fechaNombre}">
                            <input type="hidden" id="inicioAnterior_${id_turno}" value="${hora_inicio}">
                            <input type="hidden" id="finAnterior_${id_turno}" value="${hora_fin}">
                            <input id="emailUsuario_${id_turno}" type="hidden" name="emailUsuario_${id_turno}" value=${email}>
                            <input id="nombreUsuario_${id_turno}" type="hidden" name="nombre_${id_turno}" value=${nombre_paciente}>
                            <p class="refer-text">Telefono: ${telefono}</p>
                            <p class="refer-text">E-mail: ${email} </p>
                            <p class="refer-text">Prestacion a realizar: ${nombre_prestacion}</p>
                            </p>
                            
                            ${img_ruta ? `
                            <div class="p-t-10 d-flex justify-content-start align-items-center">
                                <p class="refer-text p-0">Imagen ilustrativa: </p>
                                <a class="btn btn-primary m-l-10" href="${img_ruta}"
                                    data-lightbox="${img_ruta}" data-title="Imagen enviada por el solicitante">Ver
                                    Imagen</a>
                            </div>` :    
                            `
                            <div class="p-t-10 d-flex justify-content-start align-items-center">
                                <p class="refer-text p-0">Imagen ilustrativa: </p>
                                <span class="d-inline-block" tabindex="0" data-toggle="tooltip" title="Este usuario no proveyó una imagen">
                                 <button class="m-l-10 btn btn-primary" style="pointer-events: none;" type="button" disabled>Sin Imagen</button>
                                </span>
                            </div>`}
                            

                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center flex-res">
                            <button style="margin: 1rem 0.5rem;" class="btn btn-primary" data-toggle="modal"
                                data-target="#modalReProgramar${id_turno}">Re-Programar Turno</button>
                            <button style="margin: 1rem 0.5rem;" data-toggle="modal" data-target="#modalCancelar${id_turno}"
                                class="btn btn-danger btn-rechazar">Cancelar Turno</button>

                                <div class="modal fade" id="modalCancelar${id_turno}" tabindex="-1" role="dialog"
                                aria-labelledby="modalCancelarTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div style="background-color: var(--light);" class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle">Cancelar Turno</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <p class="modal-title">A continuación indique el motivo de la cancelacion del turno, si asi lo desea.
                                            <br>
                                                El paciente sera notificado via e-mail.
                                            <br>
                                            <p class="modal-title text-danger">Esta acción no se puede deshacer.</p>
                                            </p>
                                            <div class="pt-3 pb-1">
                                                <div class="form-group">
                                                    <label for="motivo">Motivo: <small>(opcional)</small></label>
                                                    <textarea name="motivo" id="motivoCancelar_${id_turno}"
                                                        class="form-control"></textarea>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button id="cerrarModalCancelar_${id_turno}" type="button"
                                                class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                            <button style="min-width: 100px;" id="cancelar_${id_turno}" type="button"
                                                class="btn btn-danger btn-event-control">Confirmar</button>
                                            <button id="hiddenButtonCancelar_${id_turno}" style="display: none;"
                                                data-dismiss="modal"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="modalReProgramar${id_turno}" tabindex="-1" role="dialog"
                                aria-labelledby="modalReProgramarTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div style="background-color: var(--light);" class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle">Re-Programar Turno</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <p class="modal-title">
                                            A continuación puede indicar fecha y horarios nuevos para este turno. Ademas del motivo de dicha modificación.
                                            <br>
                                                El paciente sera notificado via e-mail.
                                            </p>
                                            <div class="pt-3 pb-1">
                                                <div class="form-group">
                                                    
                                                    <label for="fecha">Nueva Fecha del Turno:</label>
                                                    <input class="form-control" type="date" name="fecha"
                                                        id="fechaTurnoNueva_${id_turno}" value=${fecha} required>
                                                    <div id="error_${id_turno}" class="d-none text-danger p-2">
                                                        Debe especificar la fecha del turno
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="horario">Nuevo Horario del Turno:</label>
                                                    ${horariosHtml(id_turno)}
                                                </div>
                                                <div class="form-group">
                                                    <label for="motivo">Motivo: <small>(opcional)</small></label>
                                                    <textarea name="motivo" id="motivoReprogramar_${id_turno}"
                                                        class="form-control"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button id="cerrarModalReProgramar_${id_turno}" style="min-width: 100px;"
                                                type="button" class="btn btn-secondary"
                                                data-dismiss="modal">Cancelar</button>
                                            <button style="min-width: 100px;" id="reprogramar_${id_turno}" type="button"
                                                class="btn btn-success btn-event-control">Confirmar
                                            </button>
                                            <button id="hiddenButtonReprogramar_${id_turno}" style="display: none;"
                                                data-dismiss="modal"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        
                    </div>
		</div>`;
        
        row.appendChild(cardContainer);
        

        divInicial.appendChild(row);

    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    }())
    
    aside.appendChild(divInicial);
    $(".collapse").collapse('hide');

    actualizarEventos();

}

function horariosHtml(id) {

    let html = "";

    const selectBox = document.createElement("select");

    selectBox.classList.add("form-control");

    selectBox.id = `horarioNuevo_${id}`;

    horarios.forEach(horario => {

        const option = document.createElement("option");

        option.id = horario.id;
        option.value = horario.id;
        option.innerHTML = `${horario.hora_inicio} - ${horario.hora_fin}`;

        selectBox.appendChild(option);
    })

    return selectBox.outerHTML;
}


function turnosDelDia(e) {

    // console.log(e.target);

    const prev = document.querySelector(".selected");

    if (prev) {
        prev.classList.remove("selected");
    }

    const id = e.target.id;

    e.target.classList.add("selected");

    if (seleccionado === id) return;

    seleccionado = id;
    
    appendAside(seleccionado);

}

function diaDefault() {
    
    const hoy = document.querySelector(".fc-today").id;

    appendAside(hoy);
}

function actualizarEventos() {

    const botonesEventos = document.querySelectorAll(".btn-event-control");

    botonesEventos.forEach(boton => boton.addEventListener("click", validarAccion));
}

async function validarAccion(e) {

    // console.log(e.target);
    const split = e.target.id.split("_");
    const boton = e.target;
    const accion = split[0];
    const id = split[1];

    console.log(split)

    // console.log(`Accion: ${accion}, ID TURNO: ${id}`)

    switch (accion) {
        
        case 'cancelar':

            desactivarBotones([boton, boton.previousElementSibling]);
            agregarSpinner(boton);
            await cancelarTurno(id);
            quitarSpinner(boton, "Confirmar");
            activarBotones([boton, boton.previousElementSibling]);
                
            document.querySelector(`#hiddenButtonCancelar_${id}`).click();
            break;

        case 'reprogramar':
            desactivarBotones([boton, boton.previousElementSibling]);
            agregarSpinner(boton);
            await reprogramarTurno(id);
            quitarSpinner(boton, "Confirmar");
            activarBotones([boton, boton.previousElementSibling]);
        
            break;
        
        default: 
            break;    
    }
}

async function cancelarTurno(id) {

    const motivo = document.querySelector(`#motivoCancelar_${id}`).value;
    const inicioAnterior = document.querySelector(`#inicioAnterior_${id}`).value;
    const finAnterior = document.querySelector(`#finAnterior_${id}`).value;
    const fechaAnterior = document.querySelector(`#fechaAnterior_${id}`).value;
    const nombreUsuario = document.querySelector(`#nombreUsuario_${id}`).value;
    const emailUsuario = document.querySelector(`#emailUsuario_${id}`).value;
    const diaAnterior = document.querySelector(`#diaAnterior_${id}`).value;
    const imgPath = document.querySelector(`#imgRuta_${id}`).value;

    const payload = {
        id_turno: id,
        inicioAnterior,
        finAnterior,
        fechaAnterior,
        nombreUsuario,
        emailUsuario,
        diaAnterior,
        motivo,
        imgPath
    }

    console.log("PAYLOAD:\n", payload);

    const data = await fetch("/api/turnos/cancelar", {
        
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(payload)
    });

    const result = await data.json();

    console.log(result);
    
    if (result.success) {

        inhabilitarCarta(id);

        console.log("TURNOS ANTES:\n",turnos);
        let index = turnos.findIndex(turno => turno.id_turno == id);

        console.log("INDEX: ",index);

        turnos.splice(index, 1);

        console.log("TURNOS DESPUES:\n",turnos);

        // turnos = turnos.map(turno => {
        //     if (turno.id_turno != id){
        //         return turno;
        //     }
        // });

        swal({
            title: "Turno Cancelado",
            text: result.msg,
            icon: "success",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        });
    } else {

        swal({
            title: "Ocurrio un error",
            text: result.msg,
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

    //inhabilitarCarta(id);
    
}

function cartaReprogramada(idTurno, nuevaFecha) {

    const divIcono = document.createElement("div");

    divIcono.classList.add("d-flex", "justify-content-start", "align-items-center");
    divIcono.id = `divIcono_${idTurno}`;

    const p = document.createElement("p");

    p.classList.add("text-uppercase", "text-primary");
    p.style.fontWeight = "600";
    p.style.marginLeft = "0.5rem";
    p.textContent = `turno reprogramado para el ${nuevaFecha}`;

    const iconoReprogramado = document.createElement("i");

    iconoReprogramadoClass.split(" ").forEach(clase => {
        iconoReprogramado.classList.add(clase);
    });

    divIcono.appendChild(iconoReprogramado)
    divIcono.appendChild(p);

    const divContainer = document.querySelector(`#turnoContainer_${idTurno} div`);


    const carta = document.getElementById(`tituloTurno_${idTurno}`);

    divContainer.insertBefore(divIcono, carta);

    carta.click();
    carta.style.pointerEvents = "none";

}


function inhabilitarCarta(idTurno) {


    const previous = document.querySelector(`#divIcono_${idTurno}`); //si hay otro icono de antes

    if (previous) {
        previous.parentElement.removeChild(previous);
    }

    // console.log(idTurno);
    const divContainer = document.querySelector(`#turnoContainer_${idTurno} div`);

    const divIcono = document.createElement("div");

    divIcono.classList.add("d-flex", "justify-content-start", "align-items-center");
    divIcono.id = `divIcono_${idTurno}`;

    const p = document.createElement("p");

    p.classList.add("text-uppercase", "text-danger");
    p.style.fontWeight = "600";
    p.style.marginLeft = "1rem";
    p.textContent = "turno cancelado";

    const iconoReprogramado = document.createElement("i");

    iconoRechazadoClass.split(" ").forEach(clase => {
        iconoReprogramado.classList.add(clase);
    });

    divIcono.appendChild(iconoReprogramado)
    divIcono.appendChild(p);

    const carta = document.getElementById(`tituloTurno_${idTurno}`);

    divContainer.insertBefore(divIcono, carta);


    carta.style.backgroundColor = "var(--danger)";

    carta.click();

    carta.style.pointerEvents = "none";

}


async function reprogramarTurno(id) {

    const fechaNueva = document.querySelector(`#fechaTurnoNueva_${id}`).value;
    const horarioNuevo = document.querySelector(`#horarioNuevo_${id}`).value;
    const motivo = document.querySelector(`#motivoReprogramar_${id}`).value;
    const inicioAnterior = document.querySelector(`#inicioAnterior_${id}`).value;
    const finAnterior = document.querySelector(`#finAnterior_${id}`).value;
    const fechaAnterior = document.querySelector(`#fechaAnterior_${id}`).value;
    const nombreUsuario = document.querySelector(`#nombreUsuario_${id}`).value;
    const emailUsuario = document.querySelector(`#emailUsuario_${id}`).value;
    const diaAnterior = document.querySelector(`#diaAnterior_${id}`).value;

    const payload = {
        id_turno: id,
        fecha: fechaNueva,
        id_horario: horarioNuevo,
        motivo,
        inicioAnterior,
        finAnterior,
        fechaAnterior,
        emailUsuario,
        nombreUsuario,
        diaAnterior
    }

    const data = await fetch("/api/turnos/reprogramar", {
        
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(payload)
    });

    const result = await data.json();

    console.log(result);

    if (result.success) {  

        cartaReprogramada(id, result.nueva_fecha);
        // console.log("LA ID ES: " + id);
        turnos.map(turno => {
            if (turno.id_turno == id){ 
                turno.fecha = result.fecha_calendario;
                turno.hora_inicio = result.nuevaHoraInicio;
                turno.hora_fin = result.nuevaHoraFin;
                turno.fechaNombre = result.nueva_fecha;
                turno.id_horario = horarioNuevo;
                // console.log(`turno actualizado: ${turno.fecha}, id:${turno.id_turno}`)
            }
        });
        swal({
            title: "Turno Reprogramado",
            text: `El turno fue reprogramado correctamente para el ${result.nueva_fecha} de
                    ${result.nuevaHoraInicio} a ${result.nuevaHoraFin}`,
            icon: "success",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        });
        document.querySelector(`#hiddenButtonReprogramar_${id}`).click();

        // console.log(turnos);
    } else {
        
        swal({
            title: "No Disponible",
            text: result.msg,
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

    // console.log(payload);

}

