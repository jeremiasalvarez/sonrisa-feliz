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
