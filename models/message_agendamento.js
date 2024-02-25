const  mongoose = require('mongoose');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');
const _data = moment();

const Message_agendamento = mongoose.model('Message_agendamento',{
    _numero: String,
    mensagemComLink: String,
    timestamp:{
      type: Date,
      default: () => moment().tz('America/Sao_Paulo').toDate() // Use moment-timezone para obter a data atual no fuso horário desejado
    } ,
    email:String

})

module.exports= Message_agendamento

