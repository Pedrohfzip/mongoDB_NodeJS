
    //DECLARAÇÕES

const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const { config } = require("nodemon");
const mongoose = require("mongoose")
const app = express();
const admin = require("./routers/admin")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const port = 4000

//=================================

    //Public

    app.use(express.static(path.join(__dirname,"public")))
    
    //Middleware => observa cada requisição do servidor
    app.use( (req,res,next) => {
        console.log("Middleware")
        next()
    })

//=================================


    //CONFIGS

//sessões
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
//Middleware
app.use( (req,res,next) =>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next();
})
//config handlebars
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars')

//config body-parser
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

//Configuração Mongodb
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/categorias").then( () => {
    console.log("Conectado ao mongodb");
}).catch( (e) => {
    console.log("Erro conexão ao mongodb"+e);
});

//=================================


    //Rotas

    
//rota admin
app.use('/admin', admin)

app.get('/', (req,res) => {
    res.render("home/index")
})

app.listen(port, () => {
    console.log(`Servidor iniciado`)
})

//=================================