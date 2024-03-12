const  mongoose = require('mongoose');


const Link_validator = mongoose.model('Link_validator',{
    nome_cliente: String,
    key: String,
    used: Boolean,
    loja: String,
    Data:String,
    tel_cliente:String,
    vendedor: String,
})

module.exports= Link_validator

