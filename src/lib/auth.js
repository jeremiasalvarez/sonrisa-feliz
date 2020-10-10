module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/login");
  },

  validateLogInForm(req, res, next) {

    const result = validate(req.body.email, req.body.password);

    if (!result.success){ 
      req.flash("message", result.message);
    }
  
    
    return next();
  }
};

function validate(username, password) { 

  const errors = [];

  if (!username) {
    errors.push("No se ingreso un email valido");
  }
  if (!password) {
    errors.push("No se ingreso una contraseña");
  }

  if (errors.length > 0) {
    const message = errors.join("<br>");
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
