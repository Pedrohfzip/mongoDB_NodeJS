
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Categoria = new Schema({
    nome: {
        type: String,
        require: false
    }
})

mongoose.model('categorias', Categoria)

