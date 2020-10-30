// window.Mercadopago.setPublishableKey("TEST-52e78626-a17a-442d-87dc-9f67a2492655");
// window.Mercadopago.getIdentificationTypes();

// document.getElementById('cardNumber').addEventListener('change', guessPaymentMethod);

// function guessPaymentMethod(event) {
//    let cardnumber = document.getElementById("cardNumber").value;
//    if (cardnumber.length >= 6) {
//        let bin = cardnumber.substring(0,6);
//        window.Mercadopago.getPaymentMethod({
//            "bin": bin
//        }, setPaymentMethod);
//    }
// };

// function setPaymentMethod(status, response) {
//    if (status == 200) {
//        let paymentMethod = response[0];
//        document.getElementById('paymentMethodId').value = paymentMethod.id;

//        if(paymentMethod.additional_info_needed.includes("issuer_id")){
//            getIssuers(paymentMethod.id);
//        } else {
//            getInstallments(
//                paymentMethod.id,
//                document.getElementById('transactionAmount').value
//            );
//        }
//    } else {
//        alert(`payment method info error: ${response}`);
//    }
// }
// function getIssuers(paymentMethodId) {
//     window.Mercadopago.getIssuers(
//         paymentMethodId,
//         setIssuers
//     );
//  }
 
//  function setIssuers(status, response) {
//     if (status == 200) {
//         let issuerSelect = document.getElementById('issuer');
//         response.forEach( issuer => {
//             let opt = document.createElement('option');
//             opt.text = issuer.name;
//             opt.value = issuer.id;
//             issuerSelect.appendChild(opt);
//         });
 
//         getInstallments(
//             document.getElementById('paymentMethodId').value,
//             document.getElementById('transactionAmount').value,
//             issuerSelect.value
//         );
//     } else {
//         alert(`issuers method info error: ${response}`);
//     }
//  }
//  function getInstallments(paymentMethodId, transactionAmount, issuerId){
//     window.Mercadopago.getInstallments({
//         "payment_method_id": paymentMethodId,
//         "amount": parseFloat(transactionAmount),
//         "issuer_id": issuerId ? parseInt(issuerId) : undefined
//     }, setInstallments);
//  }
 
//  function setInstallments(status, response){
//     if (status == 200) {
//         document.getElementById('installments').options.length = 0;
//         response[0].payer_costs.forEach( payerCost => {
//             let opt = document.createElement('option');
//             opt.text = payerCost.recommended_message;
//             opt.value = payerCost.installments;
//             document.getElementById('installments').appendChild(opt);
//         });
//     } else {
//         alert(`installments method info error: ${response}`);
//     }
//  }
//  doSubmit = false;
// document.getElementById('paymentForm').addEventListener('submit', getCardToken);
// function getCardToken(event){
//    event.preventDefault();
//    if(!doSubmit){
//        let $form = document.getElementById('paymentForm');
//        window.Mercadopago.createToken($form, setCardTokenAndPay);
//        return false;
//    }
// };

// function setCardTokenAndPay(status, response) {
//    if (status == 200 || status == 201) {
//        let form = document.getElementById('paymentForm');
//        let card = document.createElement('input');
//        card.setAttribute('name', 'token');
//        card.setAttribute('type', 'hidden');
//        card.setAttribute('value', response.id);
//        form.appendChild(card);
//        doSubmit=true;
//        form.submit();
//    } else {
//        alert("Verify filled data!\n"+JSON.stringify(response, null, 4));
//    }
// };

const botonesPagar = document.querySelectorAll(".btn-pagar");

const actualizarEstado = () => {

    const estados = document.querySelectorAll(".estado-pago");

    estados.forEach(estado => {

        const id = estado.id.split("_")[1];
        const yaPago = estado.value == 1;

        if (yaPago) {
            cambiarIconoEstado(id, "acc");
            desactivarCartaPago(id);
        }
    })
}

actualizarEstado();


function desactivarCartaPago(id) {

    const link = document.querySelector(`#pendienteLink_${id}`);
    const arrows = document.querySelectorAll(`#pendienteLink_${id} i`);

    arrows.forEach(arrow => arrow.style.color = "#6c757d");

    link.style.pointerEvents = "none";
    link.style.color = "#6c757d";

}



const addEvents = () => {

    botonesPagar.forEach(boton => {
        boton.addEventListener("click", procesarPago);
    })
}

addEvents();

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


