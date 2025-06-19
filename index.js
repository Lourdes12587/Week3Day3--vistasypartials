const express = require("express"); // 1
const app = express();
require("dotenv").config({ path: "./env/.env" }); //5
const db = require("./database/db"); //11

app.listen(4000, () => { //2
    console.log("Servidor corriendo en http://localhost:4000");
});

app.use("/resources", express.static(__dirname + "/public")); // 6

app.use(express.urlencoded({ extended: true })); // 3
app.use(express.json())

app.set('view engine', 'ejs'); //7
//app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', {
        nombre: "NUNboating",
        experiencia: "animete a crearla",
    });
});

app.get('/register', (req, res) => {
  res.render('register', { register: true});
});

app.get('/login', (req, res) => {
    res.render('login', {
        login: true,
        nombre: "Lourdes",
        apellido:"ortiz",
    });

});




