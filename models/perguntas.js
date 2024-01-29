const  mongoose = require('mongoose');


const Perguntas = mongoose.model('Perguntas',{
    categoria: String,
    perguntas: [{
        pergunta:String,
        opcoes: Array,
    }]
   
})


module.exports= Perguntas