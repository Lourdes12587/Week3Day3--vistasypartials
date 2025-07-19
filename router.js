const express = require('express');
const router = express.Router();
//const { body, validationResult } = require ("express-validator");
const bcrypt = require("bcryptjs"); 
const db = require("./database/db");


//RUTAS
router.get('/', (req, res) => {
    res.render('index', {
        nombre: "NUNboating",
        experiencia: "animete a crearla",
    });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register', { register: true});
});

//router.get('/admin', (req, res) => {
  //if (req.session.loggedin){
    //res.render('admin', {
    //    login: true,
    //     name: req.session.name
        
    //});
  //} else {
    //res.render('admin', { 
    //    login: false,
    //    name: "Debe iniciar sesion" 
        
    //});
  //}
//});

router.get('/admin', (req, res) => {
  if (req.session.loggedin){
    res.render('admin', {
        login: true,
        name: req.session.name,
        rol: req.session.rol  // ✅ enviamos el rol a la vista
    });
  } else {
    res.render('admin', { 
        login: false,
        name: "Debe iniciar sesión",
        rol: null              // ✅ evitamos error en la vista
    });
  }
});

router.get('/productos', (req, res) => {
  res.render('productos');
});

//ruta cerrar sesion
router.get ('/logout', function (req,res) {
  res.session.destroy (() => {
    res.redirect('/index')
  })
});

//login
router.post("/login", async (req, res) => {      
    const user = req.body.user;
    const pass = req.body.pass;
  
    if (user && pass) {
    db.query(
        "SELECT * FROM usuario WHERE usuario = ?", 
        [user], 
        async (error, results) => {
            if (
                results.length == 0 ||
                !(await bcrypt.compare(pass, results[0].pass))
            ) {
                res.render("login", {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'Usuario y/o contraseña incorrectos',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login',
                    login: false,
                });
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].nombre;
                req.session.rol = results[0].rol;

                res.render("login", {
                    alert: true,
                    alertTitle: 'Conexion exitosa',
                    alertMessage: 'Has iniciado sesión correctamente',
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'admin',
                    login: false,
                });
            }
        }
    );
} else {
    res.render("login", {
        alert: true,
        alertTitle: 'Advertencia',
        alertMessage: 'Ingrese el usuario y/o contraseña',
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'login',
        login: false,  
    });
}
});

//register
router.post("/register", async (req, res) => { 
       
            const user = req.body.user;
            const name = req.body.name;
            const rol = req.body.rol;            
            const pass = req.body.pass;
            
            const passwordHash = await bcrypt.hash(pass, 8); 

            db.query(
                "INSERT INTO usuario SET ?", 
            {
                    usuario: user,
                    nombre: name,
                    rol: rol,
                   pass: passwordHash,
                },
                (error, results) => { 
                    if (error) {
                        console.log(error);
                    } else {
                        res.render("register", { 
                            alert: true,
                            alertTitle: 'Registro exitoso',
                            alertMessage: 'Tu cuenta fue creada',
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 2500,
                            ruta: "",
                        });
                    }
                }
           );
        });


module.exports=router;

//register-validation
//router.post("/register",
//    [
//        body("user") 
//            .exists()
//            .isLength({ min: 4 })
//            .withMessage("El usuario debe tener al menos 4 caracteres"),
//        body("name")
//            .isLength({ min: 4 })
//            .withMessage("El nombre debe tener al menos 4 caracteres"),
//        body("pass")
//            .isLength({ min: 4 })
//            .withMessage("La contraseña debe tener al menos 4 caracteres"),
//        body("email").isEmail().withMessage("El email no es valido"),
//        body("edad").isNumeric().withMessage("La edad debe ser un número"),
//    ],
//    async (req, res) => { 
//        const errors = validationResult(req); 
//        if (!errors.isEmpty()) {
 
//            console.log(req.body);

//            const valores = req.body; 
//            const validacionErrores = errors.array(); 
            
//            res.render("register", { 
//                validaciones: validacionErrores,
//                valores: valores,
                
//            });

//        } else {
      
//            const user = req.body.user;
//            const name = req.body.name;
//            const rol = req.body.rol;
//            const pass = req.body.pass;
//            const passwordHash = await bcrypt.hash(pass, 8);

//            db.query(
//                "INSERT INTO usuario SET ?",
//                {
//                    usuario: user,
//                    nombre: name,
//                    rol: rol,
//                    pass: passwordHash,
//                },
//                (error, results) => {
//                    if (error) {
//                        console.log(error);
//                    } else {
//                        res.render('register', {
//                            alert: true,
//                            alertTitle: 'Registro',
//                            alertMessage: 'El usuario se ha registrado correctamente',
//                            alertIcon: 'success',
//                            showConfirmButton: false,
//                            timer: 1500,
//                            ruta: "",
                    
//                        });
//                    }
//                }
//            );
//        }
//    }
//);





