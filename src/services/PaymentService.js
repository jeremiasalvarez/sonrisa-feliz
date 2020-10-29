const axios = require("axios"); 

class PaymentService {
  constructor() {
    this.tokensMercadoPago = {
      prod: {},
      test: {
        access_token:
          "TEST-8954245393485760-102823-0ff502ba94a16dffef79b41228a683da-665143944" 
     // el access_token de MP
      }
    }; 
// declaramos de la siguiente manera el token
// para que sea más fácil cambiarlo dependiendo del ambiente
    this.mercadoPagoUrl = "https://api.mercadopago.com/checkout"; 
 // declaramos la url en el constructor para poder accederla a lo largo de toda la class
  }

  async createPaymentMercadoPago(name, price, unit, img) {  

        const url = `${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}`; 
        const items = [
        {
            id: "1234", 
            // id interno (del negocio) del item
            title: name, 
            // nombre que viene de la prop que recibe del controller
            description: "Descripción del producto o servicio", 
            // descripción del producto
            picture_url: "https://courseit.com.ar/static/logo.png", 
            // url de la imágen del producto, tiene que ser una url válida
            category_id: "1234", 
            // categoría interna del producto (del negocio)
            quantity: parseInt(unit), 
            // cantidad que estamos vendiendo, que tiene que ser un intiger
            currency_id: "ARS",
            // id de la moneda, que tiene que ser en ISO 4217
            unit_price: parseFloat(price) 
            // el precio, que por su complejidad tiene que ser tipo FLOAT
            }, {
            // si queremos agregar otro item, pasamos la misma información acá
            }
      ]; 
      const preferences = { 
                items, 
        // el array de objetos, items que declaramos más arriba
                external_reference: "referencia del negocio", 
        // referencia para identificar la preferenciaç
                payer: { 
        // información del comprador, si estan en producción tienen que traerlos del request
        //(al igual que hicimos con el precio del item) 
                name: "Lalo",
                surname: "Landa",
                email: "test_user_16871453@testuser.com", 
        // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba si estan 
        //en producción, deberian completar esta información 
        //de la misma manera que lo hicimos con items, units, y price
        
                phone: {
                    area_code: "11",
                    number: "22223333"
                },
                address: {
                    zip_code: "1111",
                    street_name: "False",
                    street_number: "123"
                }
                }, 
                payment_methods: {
                // declaramos el método de pago y sus restricciones
                excluded_payment_methods: [
                // aca podemos excluir metodos de pagos, tengan en cuenta que es un array de objetos
                    // donde el id de cada objeto es la exclusión
                    {
                    id: "amex"
        // acá estamos excluyendo el uso de la tarjeta American Express
                    }
                ],
                excluded_payment_types: [{ id: "atm" }],
        // aca podemos excluir TIPOS de pagos, es un array de objetos
        // Por ejemplo, aca estamos excluyendo pago por cajero
                installments: 6, 
        // mayor cantidad de cuotas permitidas
                default_installments: 6 
        // la cantidad de cuotas que van a aparecer por defecto
                }, 
                back_urls: {
        // declaramos las urls de redireccionamiento
                success: "https://turnos-sonrisafeliz.herokuapp.com/success", 
        // url a la que va a redireccionar si sale todo bien
                pending: "https://turnos-sonrisafeliz.herokuapp.com/pending",
        // url a la que va a redireccionar si decide pagar en efectivo por ejemplo
                failure: "https://turnos-sonrisafeliz.herokuapp.com/error"
        // url a la que va a redireccionar si falla el pago
                }, 
                notification_url: "https://turnos-sonrisafeliz.herokuapp.com/webhook", 
        // declaramos nuestra url donde recibiremos las notificaciones
        // es la misma ruta que declaramos en app.js
                auto_return: "approved" 
        // si la compra es exitosa automaticamente redirige a "success" de back_urls
      };
  
        //NOTA: TODAS las URLS que usemos tienen que ser reales,
        // si prueban con localhost, va a fallar 
        try {
            const request = await axios.post(url, preferences, {
        // hacemos el POST a la url que declaramos arriba, con las preferencias
            headers: { 
        // y el header, que contiene content-Type
                "Content-Type": "application/json"
            }
            });
            console.log(request);
            return request.data; 
        // devolvemos la data que devuelve el POST
        } catch (e) {
            console.log(e); 
        // mostramos error en caso de que falle el POST
        }
    }

}

module.exports = PaymentService;