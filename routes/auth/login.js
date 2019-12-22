const Express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/User.js");


const router = Express.Router();

router.get("/view", (request, response) => {
    response.render("login");
  });

  router.post("/getToken", async (request, response) => {
    const { username, password } = request.body;
    try {
     const user = await User.findOne({ username });
  
      if (!user) return response.render("login", { error: "el usuario no existe" });
    
      const passwordDB = user.password;
  
      if (!bcrypt.compareSync(password, passwordDB))
        return request.render("login", { error: "La contraseña no es correcta" });
    
        request.session.currentUser = user;
        
        const respuesta = require("../../spotify-token/getToken.js");
        response.status(200).json({ message: respuesta });
        //console.log(require("../../spotify-token/getToken.js"));

        //redireccionamos aca
        
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Hubo un problema" });
    }
  });

module.exports = router;