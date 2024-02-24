const  mongoose = require('mongoose');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');
const data = moment();

const Message_agendamento = mongoose.model('Message_agendamento',{
    _numero: String,
    mensagemComLink: String,
    timestamp: {
        type: Date,
        default: () => moment().toDate()
      },
    email:String

})

module.exports= Message_agendamento

