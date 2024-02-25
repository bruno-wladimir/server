const  mongoose = require('mongoose');

const Respostas = mongoose.model('Respostas',{
   
    respostas:Array,
    id_loja:String,
    Data:Date,
    vendedor: String
})

module.exports= Respostas