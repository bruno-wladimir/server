const  mongoose = require('mongoose');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');
const _data = moment();

const Message_agendamento = mongoose.model('Message_agendamento',{
    _numero: String,
    mensagemComLink: String,
    timestamp: Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    email:String

})

module.exports= Message_agendamento

