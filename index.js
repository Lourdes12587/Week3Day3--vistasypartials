const express = require('express');
const app = express();
require("dotenv").config({ path: "./env/.env" }); 
const session = require('express-session');

app.use(
    session({
        secret: "secret", 
        resave: false, 
        saveUninitialized: false, 
    })
);

app.listen(4000, () => { 
    console.log("Servidor corriendo en http://localhost:4000");
});

app.use("/resources", express.static(__dirname + "/public")); 

app.set('view engine', 'ejs'); 
//app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use("/", require("./router"));

