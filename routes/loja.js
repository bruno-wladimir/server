const router = require('express').Router();
const bodyParser = require('body-parser');
const qrcode = require('qrcode-terminal');
// const { Client, LocalAuth } = require('whatsapp-web.js');

const Loja = require('../models/loja')
const Respostas = require('../models/respostas')

const Perguntas = require('../models/perguntas');
const Link_Mensagem = require('../models/link_mensagem');
const Categorias = require('../models/categorias');
const Sorteio = require('../models/sorteio');
const  mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Link_validator = require('../models/Link_validator');
const client = require('../models/whatsappClient');
const fs = require('fs');

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
  // if (mensagensNaoEnviadas.length>0 ){
  //   enviarmensagensretidas();


  // }

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
  const { nome_loja, telefone_loja, cidade, categoria, vendedores, email } = req.body

  const loja = {

    nome_loja,
    telefone_loja,
    cidade,
    categoria,
    vendedores,
    email
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
  console.log("estou suqi")
  const id_pesquisa = '1';

  try {
    // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);

    const respostasDaLoja = await Respostas.find({ id_loja: id_pesquisa })



    console.log(respostasDaLoja)

    res.json({ status: 'Mensagem enviada com sucesso!', response: respostasDaLoja });



  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem', error });
  }
});





router.post('/salvar_dados_logista', async (req, res) => {
  console.log("recebendo post")
  const { nome_loja, telefone_loja, cidade, categoria, vendedores, email } = req.body

  const loja = {

    nome_loja,
    telefone_loja,
    cidade,
    categoria,
    vendedores,
    email
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

    await Loja.create(loja)

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
    email
  } = req.body

  var novo_participante = {
    nome: req.body.nome_cliente,
    tel: req.body.telefone_cliente,
    email_loja: req.body.email,
    vendedor: vendedor
  }

  try {

    const primeiroDocumento = await Loja.findOne({ email: email });
    console.log(" DB BUSCAR LOJA ",primeiroDocumento)


    const cidade = primeiroDocumento.cidade;

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

    await sendzapfunction(req.body.telefone_cliente,link); //aqui manda a mensagem para o clinte
    res.status(200).json({ message: "Cadastrado com sucesso na promoção " });

  }

  catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });

  }

})


async function gerar_link (email,telefone_cliente){
  console.log(" GERAR LINK ")

  const linkKey = uuidv4();

  // await LinkModel.create({ key: linkKey, used: false });
  const links = { 
    key: linkKey,
    used: false,
  tel_cliente: telefone_cliente,
    loja:email
  }

  await Link_validator.create(links)
 
  const link2 = "https://willowy-eclair-7514f9.netlify.app/user-inicio/"+linkKey
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

  const perguntasPosVenda = [
    {
      categoria: "lojaDeRoupas",
      perguntas: [
        {
          pergunta: "Como você avalia a experiência de compra em nossa loja de roupas?",
          opcoes: ["Excelente", "Bom", "Regular", "Ruim"]
        },
        {
          pergunta: "Encontrou facilmente o que procurava em nossa loja?",
          opcoes: ["Sim", "Não"]
        },
        {
          pergunta: "Qual foi o aspecto mais positivo da sua compra de roupas conosco?",
          opcoes: ["Variedade de produtos", "Atendimento ao cliente", "Qualidade dos produtos", "Preços competitivos"]
        },
        {
          pergunta: "Você ficou satisfeito com o tempo de entrega ou retirada do seu pedido?",
          opcoes: ["Sim", "Não"]
        },
        {
          pergunta: "Recomendaria nossa loja de roupas a amigos ou familiares?",
          opcoes: ["Sim", "Não"]
        }
      ]
    },
    {
      categoria: "lojaDeCalcados",
      perguntas: [
        {
          pergunta: "Como você avalia a qualidade dos calçados que adquiriu em nossa loja?",
          opcoes: ["Excelente", "Bom", "Regular", "Ruim"]
        },
        {
          pergunta: "Você recebeu auxílio adequado dos nossos funcionários na escolha do calçado?",
          opcoes: ["Sim", "Não"]
        },
        {
          pergunta: "Qual foi o principal motivo da sua escolha ao comprar calçados conosco?",
          opcoes: ["Estilo", "Conforto", "Preço", "Marca"]
        },
        {
          pergunta: "Como você avalia a variedade de tamanhos e estilos disponíveis em nossa loja?",
          opcoes: ["Ótima", "Boa", "Regular", "Insatisfatória"]
        },
        {
          pergunta: "Alguma sugestão ou comentário adicional sobre a sua experiência em nossa loja de calçados?"
        }
      ]
    },
    {
      categoria: "restaurante",
      perguntas: [
        {
          pergunta: "Qual é a sua opinião sobre a qualidade dos pratos que você experimentou em nosso restaurante?",
          opcoes: ["Excelente", "Bom", "Regular", "Ruim"]
        },
        {
          pergunta: "Como você avalia o atendimento prestado por nossa equipe durante sua visita?",
          opcoes: ["Excelente", "Bom", "Regular", "Ruim"]
        },
        {
          pergunta: "Você ficou satisfeito com o tempo de espera pelos pratos no restaurante?",
          opcoes: ["Sim", "Não"]
        },
        {
          pergunta: "Houve algum prato ou aspecto específico que você gostaria de ver melhorado em nosso cardápio?"
        },
        {
          pergunta: "Você pretende voltar ao nosso restaurante ou nos recomendar a outras pessoas?",
          opcoes: ["Sim", "Não"]
        }
      ]
    },
    {
      categoria: "lojaDeAcessorios",
      perguntas: [
        {
          pergunta: "Como você avalia a qualidade dos acessórios que adquiriu em nossa loja?",
          opcoes: ["Excelente", "Bom", "Regular", "Ruim"]
        },
        {
          pergunta: "Você encontrou facilmente os acessórios que estava procurando em nossa loja?",
          opcoes: ["Sim", "Não"]
        },
        {
          pergunta: "Qual foi o principal motivo da sua escolha ao comprar acessórios conosco?",
          opcoes: ["Estilo", "Originalidade", "Preço", "Marca"]
        },
        {
          pergunta: "Como você avalia a variedade de acessórios disponíveis em nossa loja?",
          opcoes: ["Ótima", "Boa", "Regular", "Insatisfatória"]
        },
        {
          pergunta: "Alguma sugestão ou comentário adicional sobre a sua experiência em nossa loja de acessórios?"
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
async function sendzapfunction(numero,link) {
//   if (ativo === false){

// console.log("servidor iniciando")
// salvarmensagemoff(link,numero);
//   }
  

 console.log(" send zap function ")
 try {
 const  _phoneId = await client.getNumberId("55"+ numero)
console.log("enviando para "+ _phoneId)


const serialize = _phoneId._serialized;
console.log("numero preparado"+ serialize)
 
    if (serialize) {
      await client.sendMessage(serialize,`${link}`);

    console.log("Mensagem enviada");

      //here use _phoneId._serialized with valid whatsapp_id 


    } else { // aqui eu posso salvar em um arquivo e mandar para loja por exemplo . 

      //Handle invalid number
      console.log("Mensagem nao enviada - numero incorreto ");

    }
  } catch (error) {
  
    console.log("ERRO NO CATCH ",error);

  }
 
}


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
