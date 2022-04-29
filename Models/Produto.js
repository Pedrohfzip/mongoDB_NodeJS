
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Produto = new Schema({
    nome: {
        type: String,
        require: false
    },
    preco: {
        type: Number,
        require: false
    }
})

mongoose.model('produtos', Produto)
