const  mongoose = require('mongoose');


const Perguntas = mongoose.model('Perguntas',{
    categoria: String,
    perguntas: [{
        pergunta:String,
        opcoes: Array,
        pergunta_aberta:String ,
        resposta_aberta: String,
    }]
   
})


module.exports= Perguntas