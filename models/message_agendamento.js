const  mongoose = require('mongoose');


const Message_agendamento = mongoose.model('Message_agendamento',{
    _numero: String,
    mensagemComLink: String,
    timestamp: Date,
    email:String

})

module.exports= Message_agendamento

