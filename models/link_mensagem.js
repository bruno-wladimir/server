const  mongoose = require('mongoose');


const Link_Mensagem = mongoose.model('Mensagem',{
    nome_cliente: String,
    telefone_cliente: String,
    vendedor: String,
    loja: String,

})

module.exports= Link_Mensagem

