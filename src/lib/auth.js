const { getRol } = require("../lib/helpers");

module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/login?redirected=true");
  },

  validateLogInForm(req, res, next) {

    const result = validate(req.body.email, req.body.password);

    if (!result.success){ 
      req.flash("message", result.message);
    }
  
    
    return next();
  },

  async isAdmin(req, res, next) {

    const result = await getRol(req.user.id);

    req.admin = result.isAdmin;
    req.notAllowedMessage = !result.isAdmin ? "No tienes permisos para ver esta seccion" : "";

    next();
  }
};

function validate(username, password) { 

 
  if (!username || !password) {
    const message = "Asegurese de rellenar todos los campos"
    return {
      success: false,
      message
    }
  }

  return {
    success: true,
    message: "Ingresando al portal..."
  }

}
