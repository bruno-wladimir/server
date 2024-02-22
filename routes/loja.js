const router = require('express').Router();
const bodyParser = require('body-parser');
const qrcode = require('qrcode-terminal');
// const { Client, LocalAuth } = require('whatsapp-web.js');

const Loja = require('../models/loja')
const Respostas = require('../models/respostas')
const { MessageMedia } = require('whatsapp-web.js');

const Perguntas = require('../models/perguntas');
const Link_Mensagem = require('../models/link_mensagem');
const Categorias = require('../models/categorias');
const Sorteio = require('../models/sorteio');
const  mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Link_validator = require('../models/Link_validator');
const client = require('../models/whatsappClient');
const fs = require('fs');
const Message_agendamento = require('../models/message_agendamento');

let qrread = "";
let ativo  = false; 
let mensagensNaoEnviadas = [];
//qrcode.generate(qrd, { small: true });



//INICIO ZAP 

// const client = new Client({

//   puppeteer: {
//     headless: true,

//   },
//   authStrategy: new LocalAuth({
//     clientId: "YOU_CLIENTE_ID"
//   })
// })

//client.initialize(); // remover comentario para rodar 


client.on('loading_screen', (percent, message) => {
  console.log('LOADING SCREEN', percent, message);
});
client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });

  // const qrCodePath = './qr-code.png';
  // qrcode.toFile(qrCodePath, qr, { small: true }, (err) => {
  //   if (err) {
  //     console.error('Erro ao salvar o QR code:', err);
  //     return;
  //   }
  //   console.log('QR code salvo em:', qrCodePath);
  // });

});

client.on('ready', () => {
  console.log('Client is ready!');

  if (mensagensNaoEnviadas.length>0 ){
    enviarmensagensretidas();


  }

});

client.on('message', msg => {
  console.log("Recebendo mensagem ", msg.body)
  if (msg.body == '!ping') {
    msg.reply('pong');
  }


});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
  ativo= true;


});


// FIM MODULO ZAP
router.get('/qr', async (req, res) => {
  let qr = await new Promise((resolve, reject) => {
      client.once('qr', (qr) => resolve(qr))
  })
  res.send(qr)
})

router.get('/testnumber', async (req, res) => {
  console.log("test number")
  var _phoneId = await client.getNumberId("5531999631088")


  try {
    if (_phoneId) {
      res.json({ status: _phoneId._serialized });

      //here use _phoneId._serialized with valid whatsapp_id 
    } else {
      //Handle invalid number
      res.json({ status: 'invalido!' });

    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }

});
router.get('/getqr', async (req, res) => {


 res.status(200).json(qrcode.generate(qrread, { small: true }));


})

router.get('/get_dados_lojista', async (req, res) => {
  const param1 = req.query.email;

  console.log("mensagem" + param1);
  const { nome_loja, telefone_loja, cidade, categoria, vendedores, email ,logo} = req.body

  const loja = {

    nome_loja,
    telefone_loja,
    cidade,
    categoria,
    vendedores,
    email,
    logo
  }

  const filtro = { email: email };
  try {
    const loja_find = await Loja.findOne({ email: param1 })

    if (loja_find) {


      res.status(201).json({ message: "Loja encontrada , trazendo dados ", loja: loja_find });


    }
    else {
      res.status(201).json({ message: "Loja não encontrada" });

    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }



});

router.get('/get_respostas', async (req, res) => {
  const linkKey  = req.query.email

 

  try {
    // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);

    const respostasDaLoja = await Respostas.find({ id_loja: linkKey })



    console.log(respostasDaLoja)

    res.json({ status: 'Mensagem enviada com sucesso!', response: respostasDaLoja });



  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem', error });
  }
});





router.post('/salvar_dados_logista', async (req, res) => {
  console.log("recebendo post",req.body)
  const { nome_loja, telefone_loja, cidade, categoria, vendedores, email ,logo} = req.body

  const loja = {

    nome_loja,
    telefone_loja,
    cidade,
    categoria,
    vendedores,
    email,
    logo
  }
  const filtro = { email: email };
  try {
    const loja_find = await Loja.findOne({ email: email })

    if (loja_find) {

      const resultado = await Loja.updateOne(filtro, loja);


      res.status(201).json({ message: "Nome ja existe, dados atualizados" });


    }
    else {

      await Loja.create(loja)

      // const nova_loja = await loja.save();
      res.status(201).json({ message: "incluido com suscesso" });

    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }


})

router.post('/criarloja', async (req, res) => {
  console.log("recebendo post", req.body.email)
  //  const { email } = req.body

  const loja = {

    email: req.body.email
  }

  try {

    var dados =  await  Loja.create(loja)
console.log(dados)
    // const nova_loja = await loja.save();
    res.status(201).json({ message: "incluido com suscesso" });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }


})

router.post('/usuarios', async (req, res) => {
  console.log("recebendo na rota send")

  const { nome, email } = req.body;
  const usuario = new Usuario({ nome, email });

  try {
    const novoUsuario = await usuario.save();
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
)

router.post('/send', async (req, res) => {// aqui manda para o zap do clinte e salva uma copia no banco de dados 
console.log("te cliente : "+ req.body.telefone_cliente)
  const dadosLoja = {
    nome_cliente,
    telefone_cliente,
    vendedor,
    loja,
    email,
    urlimage,
  } = req.body

  var novo_participante = {
    nome: req.body.nome_cliente,
    tel: req.body.telefone_cliente,
    email_loja: req.body.email,
    vendedor: vendedor,
    logo : req.body.urlimage
  }

  try {

    const primeiroDocumento = await Loja.findOne({ email: email });
    console.log(" DB BUSCAR LOJA ",primeiroDocumento)


    const cidade = primeiroDocumento.cidade;

    const nome_loja = primeiroDocumento.nome_loja;
    const condição = {
      ativa: true,
      cidade: cidade
      // Substitua com o valor desejado
    };

    const resultado = await Sorteio.findOneAndUpdate({ $and: [condição] },
       { $push: { participantes: novo_participante } },{ new: true })

       console.log(" DB BUSCAR SORTEIO "+ resultado)

    //console.log("resulr"+ resultado);



    //await Sorteio.create(dadosLoja)
    const link  = await  gerar_link(email,telefone_cliente);

    await sendzapfunction(req.body.telefone_cliente,link,nome_loja); //aqui manda a mensagem para o clinte
    res.status(200).json({ message: "Cadastrado com sucesso na promoção " });

  }

  catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });

  }

})


async function gerar_link (email,telefone_cliente){
  console.log(" tel ")

  const linkKey = uuidv4();

  // await LinkModel.create({ key: linkKey, used: false });
  const links = { 
    key: linkKey,
    used: false,
  tel_cliente: telefone_cliente,
    loja:email
  }

  await Link_validator.create(links)
 
  const link2 = "https://app.opinu.com.br/user-inicio/"+linkKey
  return link2;
}



router.get('/gerar-link', async (req, res) => {
  const linkKey = uuidv4();
 // const link = `http://localhost:5173/user-inicio/${linkKey}`;


 // await LinkModel.create({ key: linkKey, used: false });
 const links = { 
   key: linkKey,
   used: false

 }
try{
  await Link_validator.create(links)


  res.json({ linkKey });
}
catch{
  res.json({ "erro":"erro al criar link" });

}




});


router.get('/validarlink', async (req, res) => {
  // const linkKey = "http://localhost:5173/user-inicio/"+ req.query.url;
  const linkKey  = req.query.url

  console.log("acessando link "+ linkKey)

  const link = await Link_validator.findOne({ key: linkKey, used: false });

  if (link) {
    // Faça o que for necessário quando o link é acessado pela primeira vez
    console.log("link acessado ")

    res.send({st:"link ok"});

    // Depois de acessado, marque como inválido

  } else {
    console.log("link ja usado ")
    res.status(403).send({st:"link ja usado "});
  }
});




router.post('/createpromotion', async (req, res) => {// aqui manda para o zap do clinte e salva uma copia no banco de dados 
  console.log(req.body)

  var grava_sorteio = {
    nome_promocao: req.body.nome_promocao,
    cidade: req.body.cidade,
    dataInicio: req.body.dataInicio,
    dataTermino: req.body.dataTermino,
    ativa: req.body.ativa
  }

  try {
    await Sorteio.create(grava_sorteio)
    //await Sorteio.create(dadosLoja)

    res.status(200).json({ message: "gravado  com sucesso " });



  }

  catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });


  }


})






router.get('/getparticipantes', async (req, res) => {

  const cidade = "João Monlevade"

  try {
    // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);

    const sorteio = await Sorteio.find({ cidade: cidade })
    if (sorteio) {
      console.log("sorteio encontrado ");


    }


    res.json({ response: sorteio[0].participantes });



  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem', error });
  }
});


router.post('/salvar_perguntas', async (req, res) => {
 // amoticons aceito const opcoes = const opcoes = ["Excelente 😃", "Bom 🙂", "Regular 😐", "Ruim ☹️", "Sim 😊", "Não 😕"];
// caso adcione mais precisamos remover no codigo pois vai dar erro no relatorio , ele pega excelente + emoticon , entÃo não passa no switch case 

 const perguntasPosVenda = [
  {
    categoria: "Loja Física",
    perguntas: [
      {
        pergunta: "Qual é o seu nível de satisfação geral com a sua experiência de compra?",
        opcoes: ["Excelente 😃", "Bom 🙂", "Regular 😐", "Ruim ☹️"]
      },
      {
        pergunta: "Foi fácil encontrar o que procurava em nossa loja?",
        opcoes: ["Sim 😊", "Não 😕"]
      },
      {
        pergunta: "Como você avalia o ambiente geral da loja em termos de limpeza, organização?",
        opcoes: ["Excelente 😃", "Bom 🙂", "Regular 😐", "Ruim ☹️"]
      },
      {
        pergunta: "A respeito do preço dos produtos o que você achou?",
        opcoes: ["Excelente 😃", "Bom 🙂", "Regular 😐", "Ruim ☹️"]
      },
      {
        pergunta: "Você encontrou uma boa variedade de produtos para escolher na loja?",
        opcoes: ["Sim 😊", "Não 😕"]
      },
      {
        pergunta: "Você recomendaria esta loja a um amigo ou familiar?",
        opcoes: ["Sim 😊", "Não 😕"]
      }
    ]
  },
  {
    categoria: "Loja Online",
    perguntas: [
      {
        pergunta: "Qual é o seu nível de satisfação geral com a sua experiência de compra?",
        opcoes: ["Excelente 😃", "Bom 🙂", "Regular 😐", "Ruim ☹️"]
      },
      {
        pergunta: "Foi fácil comprar em nossa loja?",
        opcoes: ["Sim 😊", "Não 😕"]
      },
      {
        pergunta: "A respeito do preço dos produtos o que você achou?",
        opcoes: ["Excelente 😃", "Bom 🙂", "Regular 😐", "Ruim ☹️"]
      },
      {
        pergunta: "Você encontrou uma boa variedade de produtos para escolher na loja?",
        opcoes: ["Sim 😊", "Não 😕"]
      },
      {
        pergunta: "Você recomendaria esta loja a um amigo ou familiar?",
        opcoes: ["Sim 😊", "Não 😕"]
      }
    ]
  }
];



  // const { nome_loja, telefone_loja, cidade, categoria, vendedores } = req.body

  try {
    await Perguntas.create(perguntasPosVenda)


    res.status(201).json({ message: "perguntas adicionadas" });



  } catch (error) {
    res.status(400).json({ error: error.message });
  }


})

function getMimeTypeFromExtension(extension) {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    // Adicione mais casos conforme necessário para outros tipos de arquivo
    default:
      return 'application/octet-stream'; // Tipo MIME genérico para outros tipos de arquivo
  }
}
function removeNonNumericChars(inputString) {
  // Use uma expressão regular para substituir todos os caracteres não numéricos por uma string vazia
  return inputString.replace(/\D/g, '');
}
async function sendzapfunction(numero_recebido,link,nome_loja) {

  const numero  = removeNonNumericChars(numero_recebido)
  
  //const stringWithoutQuotes = urlimage.replace(/'/g, '');
  console.log("numero recebido ",numero)
//console.log("urlimagem:", urlimage)
  if (ativo === false){

console.log("servidor iniciando")

salvarmensagemoff(link,numero);
  }
 else {

 try {
 const  _phoneId = await client.getNumberId("55"+ numero)
console.log("enviando para "+ _phoneId)


const serialize = _phoneId._serialized;
console.log("numero preparado"+ serialize)
 
    if (serialize) {
      // const response = await fetch("https://firebasestorage.googleapis.com/v0/b/pesquisa-ec906.appspot.com/o/mopspray.png?alt=media&token=2488a3d9-c8b4-4c32-9946-343b50e31f88");
      // const arrayBuffer = await response.arrayBuffer();

      // const buffer = Buffer.from(arrayBuffer);

      // const urlParts = urlimage.split('.');
      // const extension = urlParts[urlParts.length - 1];
      
      // // Obtendo o tipo MIME da extensão do arquivo
      // const mimeType = getMimeTypeFromExtension(extension);
      
      // // Criando o objeto MessageMedia com a URL da imagem e o tipo MIME
      // const media = new MessageMedia(mimeType, urlimage);

      // await client.sendMessage(serialize, media);

      const mensagemComLink = `*🎉 Olá! 🎉*\n\nocê recebe esta mensagem por ter comprado na *${nome_loja}*.\n
      *🎉 Compartilhe sua opinião e nos ajude a melhorar (clique no link) 👉
      ${link} Seu feedback é anônimo. A loja não tem acesso aos seus dados.` ;


      //await client.sendMessage( serialize,mensagemComLink);


      const message = new Message_agendamento({ serialize, mensagemComLink ,timestamp: new Date()});

      try {
        const novoUsuario = await Message_agendamento.create(message);
      } catch (error) {
      }

      // const media = new MessageMedia('image/png', buffer.toString('base64'), 'imagem.png');
      
      // await client.sendMessage(serialize, media, { caption: mensagemComLink });

    console.log("Mensagem enviada");

      //here use _phoneId._serialized with valid whatsapp_id 


    } else { // aqui eu posso salvar em um arquivo e mandar para loja por exemplo . 

      //Handle invalid number
      console.log("Mensagem nao enviada - numero incorreto!! ");

    }
  
  } catch (error) {

  }

    console.log("ERRO NO CATCH ",error);

  }
 
}


setInterval(async () => {
  console.log("verificando se tem mensagem para enviar ")
  // Calcula a data e hora 4 minutos no passado
  const fourMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  // Usa $lte para encontrar mensagens agendadas que foram criadas há 4 minutos ou mais
  const messagesToSend = await Message_agendamento.find({ timestamp: { $lte: fourMinutesAgo } });

  // Envia as mensagens agendadas
  messagesToSend.forEach(async (message) => {

    const response = await fetch("https://firebasestorage.googleapis.com/v0/b/pesquisa-ec906.appspot.com/o/mopspray.png?alt=media&token=2488a3d9-c8b4-4c32-9946-343b50e31f88");
    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

   /// const media = new MessageMedia('image/png', buffer.toString('base64'), 'imagem.png');
      
    //await client.sendMessage(message.serialize, media, { caption: message.mensagemComLink });
    await client.sendMessage(message.serialize,message.mensagemComLink );

    // await client.sendMessage(message.serialize, message.mensagemComLink);
    await Message_agendamento.deleteOne({ _id: message._id }); // Remove a mensagem do banco de dados
  });
},60 * 1000);

function salvarmensagemoff(message,numero){

  mensagensNaoEnviadas.push({ 
    mensagem: message, 
    numeroTelefone: numero
});
console.log(mensagensNaoEnviadas)

}
async function enviarmensagensretidas(){

if(mensagensNaoEnviadas.length >0){

  for (const mensagem of mensagensNaoEnviadas) {
    // Enviar a mensagem utilizando a API do WhatsApp

    const  _phoneId = await client.getNumberId("55"+ mensagem.numeroTelefone)
    // //console.log("enviando para "+ _phoneId._serialized)
    const serialize = _phoneId._serialized
    
    // const serialized = _phoneId._serialized
     
        if (serialize) {
          await client.sendMessage(serialize, `${mensagem.mensagem}`);
        }

}


}

mensagensNaoEnviadas = [];
}
module.exports = router
