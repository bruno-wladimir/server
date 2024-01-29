const  mongoose = require('mongoose');


const Loja = mongoose.model('Lojas',{
    nome_loja: String,
    telefone: String,
    cidade: String,
    categoria: String,
    vendedores:Array
})


module.exports= Loja