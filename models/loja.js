const  mongoose = require('mongoose');


const Loja = mongoose.model('Lojas',{
    nome_loja: String,
    telefone_loja: String,
    cidade: String,
    categoria: String,
    vendedores:Array,
    email : String,
    logo:String,
    qtd_envio: Number

})


module.exports= Loja