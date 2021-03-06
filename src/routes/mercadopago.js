const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const {completarPago} = require("../lib/helpers");

const instance = axios.create({
    baseURL: 'https://api.mercadopago.com/',
    timeout: 1000,
    headers: {'Authorization': `Bearer ${process.env.MP_TOKEN}`}
  });
//TODO cambiar al token real

const mercadopago = require('mercadopago');


mercadopago.configure({
    access_token: process.env.MP_TOKEN
});


router.post("/notifications", async (req, res) => {

    try {
        
        const { 'data.id':ID_PAGO , type, topic, id } = req.query;

        if (type === 'payment') {
            console.log(`ES UN PAGO, LA ID ES ${ID_PAGO}`);

            let result = await instance.get(`v1/payments/${ID_PAGO}`);
            // console.log(result)
            if (result.data.status == "approved") {
                console.log("APROBADO");
                const orderID = result.data.order.id;
                console.log("BUSCANDO ORDEN");
                let resultOrden = await instance.get(`merchant_orders/${orderID}`);
                const itemId = resultOrden.data.items[0].id;
                console.log(`ÒRDEN : ${resultOrden.data.items[0]}`)
                const update = await completarPago(itemId);
                
                if(update.success) {
                    console.log("SE actualizo correctamente");
                }
            }
        }
        if (topic === 'merchant_order') {
            console.log(`ES UNA ORDEN, LA ID ES: ${id}`);
        }

    } catch (error) {
        console.log(error);
    }
    return res.sendStatus(201)
})


router.post("/api/v1/mercadopago", async (req, res) => {

    let preference = {
        items: [
          {
            id: req.body.id_pendiente,
            title: `Sonrisa Feliz - Prestación - ${req.body.product}`,
            unit_price: Number(req.body.price),
            quantity: 1,
          }
        ],
        payer: {
            email: req.user.email
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'ticket'
                }
            ],
            excluded_payment_types: [
                {
                    id: 'ticket'
                }
            ], 
            installments: 1
        },
        back_urls: {
            failure: "https://turnos-sonrisafeliz.herokuapp.com",
            success: "https://turnos-sonrisafeliz.herokuapp.com/pendientes"
        },
        binary_mode: true,
        auto_return: "approved",
        notification_url: "https://turnos-sonrisafeliz.herokuapp.com/notifications"
      };
    
      const mp = await mercadopago.preferences.create(preference);
      return res.json(mp);

})



router.get("/pago", (req, res) => {
    return res.render("mp/pago");
})

router.post("/procesar_pago", (req, res) => {


        var payment_data = {
        transaction_amount: Number(req.body.transactionAmount),
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.paymentMethodId,
        issuer_id: req.body.issuer,
        payer: {
            email: req.body.email,
            identification: {
            type: req.body.docType,
            number: req.body.docNumber
            }
        }
        };

        mercadopago.payment.save(payment_data)
        .then(function(response) {
            res.status(response.status).json({
            status: response.body.status,
            status_detail: response.body.status_detail,
            id: response.body.id
            });
        })
        .catch(function(error) {
            res.status(response.status).send(error);
        });



    // const token = req.body.token;
    // const payment_method_id = req.body.payment_method_id;
    // const installments = req.body.installments;
    // const issuer_id = req.body.issuer_id;
    // mercadopago.configurations.setAccessToken("TEST-8954245393485760-102823-0ff502ba94a16dffef79b41228a683da-665143944");

    // var payment_data = {
    //     transaction_amount: 156,
    //     token: token,
    //     description: 'Gorgeous Cotton Knife',
    //     installments: Number(installments),
    //     payment_method_id: payment_method_id,
    //     issuer_id: issuer_id,
    //     payer: {
    //       email: 'test_user_16871453@testuser.com'
    //     }
    //   };
      
    //   // Guarda y postea el pago
    //   mercadopago.payment.save(payment_data).then(function (data) {
    //     // ...    
    //     // Imprime el estado del pago
    //     console.log(data)
    //     return res.json(data)
    //   }).catch(function (error) {
    //       console.log(error)
    //     return res.json(error)
    //   });
      

})










module.exports = router;
