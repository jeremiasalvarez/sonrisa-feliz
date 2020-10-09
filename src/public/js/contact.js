const form = $(".php-email-form")[0];

const errorList = $("#errorList");

function addError(field) {
    errorList.append(`<li>El campo ${field} no es valido</li>`);
}

function validate() {
    const name = $("#from_name");
    const email = $("#from_email");
    const tel = $("#tel");
    // const name = $('#from_name');

    let check = true;

    if ($(name).val().trim() == "") {
        check = false;
        addError("Nombre");
    }

    if (
        $(email)
            .val()
            .trim()
            .match(
                /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
            ) == null
    ) {
        addError("Email");
        check = false;
    }
    if (
        $(tel)
            .val()
            .trim()
            .match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/) == null
    ) {
        addError("Telefono");
        check = false;
    }

    console.log(check);

    if (!check) {
        $(".error-div").css("display", "block");
    } else {
        $(".error-div").css("display", "none");
    }

    return check;
}

const btn = $("#submit");

$("form").on("submit", function (event) {
    event.preventDefault();

    errorList.empty();

    if (!validate()) {
        return;
    }

    btn.text("Enviando...");

    const serviceID = "default_service";
    const templateID = "template_3sgl7e3";

    emailjs.sendForm(serviceID, templateID, form).then(
        () => {
            btn.text("Solicitar Turno");
            swal({
                title: "Envio exitoso!",
                text:
                    "Tu solicitud se envio correctamente. La doctora se comunicara con usted a la brevedad.",
                icon: "success",
                button: {
                    text: "Entendido",
                    value: true,
                    visible: true,
                    className: "btn btn-primary btn-xl js-scroll-trigger",
                    closeModal: true,
                },
            });
            form.reset();
        },
        (err) => {
            btn.text("Solicitar Turno");
            swal({
                title: "Error",
                text:
                    "Lo sentimos, ocurrio un error y tu solicitud no se envio correctamente",
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
    );
});
