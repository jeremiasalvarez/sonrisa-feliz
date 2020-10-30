const express = require("express");
const router = express.Router();

const mercadopago = require('mercadopago');


mercadopago.configure({
    access_token: 'TEST-8954245393485760-102823-0ff502ba94a16dffef79b41228a683da-665143944'
});


router.post("/notifications", (req, res) => {

    console.log(req.query);

    return res.status(200);
})


router.post("/api/v1/mercadopago", async (req, res) => {

    let preference = {
        items: [
          {
            id: 99999999,
            title: req.body.product,
            unit_price: req.body.price,
            quantity: 1,
          }
        ],
        payer: {
            name: req.body.name,
            email: req.body.email
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
            success: "https://turnos-sonrisafeliz.herokuapp.com"
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
