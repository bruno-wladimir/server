const  mongoose = require('mongoose');


const Message_agendamento = mongoose.model('Message_agendamento',{
    telefone_cliente: String,
    link: String,
    timestamp: Date,

})

module.exports= Message_agendamento

