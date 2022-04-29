
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
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    }
})

mongoose.model('produtos', Produto)
