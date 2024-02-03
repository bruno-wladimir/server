const  mongoose = require('mongoose');


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
          }
          // Adicione mais campos conforme necessário
        },
      ],
      // Adicione mais campos conforme necessário
    });
    


module.exports= Sorteio