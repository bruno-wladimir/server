const  mongoose = require('mongoose');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');

const Message_agendamento = mongoose.model('Message_agendamento',{
    _numero: {
        type: Date,
        default: () => moment().toDate()
      },
    mensagemComLink: String,
    timestamp: Date,
    email:String

})

module.exports= Message_agendamento

