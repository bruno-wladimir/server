const  mongoose = require('mongoose');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');

const Sorteio = mongoose.model('Sorteio',{
    nome_promocao: {
        type: String,
        required: false,
      },
      ativa: {
        type: Boolean,
        required: false,
      },
      cidade: {
        type: String,
        required: false,
      },
      sorteado: {
        type: String,
        required: false,
      },
      dataInicio: {
        type: String,
        required: false,
      },
      dataTermino: {
        type: String,
        required: false,
      },
      participantes: [
        {
          nome: {
            type: String,
            required: false,
          },
          tel: {
            type: String,
            required: false,
          },
          email_loja: {
            type: String,
            required: false,
          },
          vendedor: {
            type: String,
            required: false,
          },
          data_cadastro:{
            type: Date,
            default: () => moment().tz('America/Sao_Paulo').toDate() // Use moment-timezone para obter a data atual no fuso horário desejado
          } ,
          // Adicione mais campos conforme necessário
        },
      ],
      // Adicione mais campos conforme necessário
    });
    


module.exports= Sorteio