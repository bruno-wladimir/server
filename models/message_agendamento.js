const  mongoose = require('mongoose');


const Message_agendamento = mongoose.model('Message_agendamento',{
    serialize: String,
    mensagemComLink: String,
    timestamp: Date,

})

module.exports= Message_agendamento

