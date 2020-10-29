const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");
const { isLoggedIn, isAdmin } = require("../lib/auth");
const PaymentController = require("../controllers/PaymentController");
const PaymentService = require("../services/PaymentService"); 
const PaymentInstance = new PaymentController(new PaymentService()); 

router.post("/payment/new", (req, res) => 
  PaymentInstance.getMercadoPagoLink(req, res) 
);

router.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));


router.post("/process_payment", isLoggedIn, isAdmin, (req, res) => {

    console.log(req.body);
    
    mercadopago.configurations.setAccessToken("TEST-8954245393485760-102823-0ff502ba94a16dffef79b41228a683da-665143944");
    const payment_data = {
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
          return res.status(response.status).json({
            status: response.body.status,
            status_detail: response.body.status_detail,
            id: response.body.id
          });
        })
        .catch(function(error) {
          console.log(error)
          return res.json(error);
        }); 

})

router.get("/success", (req, res) => {
  return res.send("EXITO")
})

router.get("/pending", (req, res) => {
  return res.send("PENDIENTE")
  
})

router.get("/error", (req, res) => {
  return res.send("ERROR")
})

router.get("/webhook", (req, res) => {
  return res.send("webhook")
})

//*user prueba 1
// {
//     "id": 665155583,
//     "nickname": "TETE1472951",
//     "password": "qatest595",
//     "site_status": "active",
//     "email": "test_user_16871453@testuser.com"
// }

//* user 2
// {
//     "id": 665143944,
//     "nickname": "TETE8337519",
//     "password": "qatest7837",
//     "site_status": "active",
//     "email": "test_user_62416462@testuser.com"
// }



module.exports = router;