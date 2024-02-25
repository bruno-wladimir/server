
const router = require('express').Router();
const mongoose = require('mongoose');

const Perguntas = require('../models/perguntas');
const Respostas = require('../models/respostas');
const Link_validator = require('../models/Link_validator');
const Link_Mensagem = require('../models/link_mensagem');
const Loja = require('../models/loja');
const client = require('../models/whatsappClient');
var ativo = false;
let mensagensNaoEnviadas = [];


client.on('authenticated', () => {
    console.log('AUTHENTICATED');
    ativo = true;

    if (mensagensNaoEnviadas.length > 0) {
        enviarmensagensretidas();


    }
});


router.post('/salvar_resposta', async (req, res) => {

    const { respostas, link ,vendedor} = req.body

    console.log(respostas);

    try {

        const link_ = await Link_validator.findOne({ key: link, used: false });

        console.log("linkkkkkk" + link_.tel_cliente)

        if (link_) {

            const salvar_db = {// esse modelo precis ser identico ao models

                respostas,
                id_loja:link_.loja,
                Data: Date.now(),
                vendedor:vendedor
            }


            await Respostas.create(salvar_db)
            // const nova_loja = await loja.save();
             await disableLink(link)

            if (ativo == true) {

                const numero  = removeNonNumericChars(link_.tel_cliente)
                const _phoneId = await client.getNumberId("55" + numero)
                // //console.log("enviando para "+ _phoneId._serialized)
                const serialize = _phoneId._serialized;
                res.status(201).json({ message: "Resposta Salva" });
                client.sendMessage(serialize, "🎉 Opinião recebida. 🙏")

            }
            else {

                console.log("servidor iniciando..")
                salvarmensagemoff(link_.tel_cliente, "Você Esta Participando");
                res.status(201).json({ message: "Resposta Salva",obs: "servidor zap off " });


            }

        }
        else {
            res.status(201).json({ message: "link ja usado" });

        }


    } catch (error) {

        console.log("deu caca", error)

        res.status(201).json({ error: error.message });
    }


})
function removeNonNumericChars(inputString) {
    // Use uma expressão regular para substituir todos os caracteres não numéricos por uma string vazia
    return inputString.replace(/\D/g, '');
  }
function salvarmensagemoff(numero,message){

    mensagensNaoEnviadas.push({ 
      mensagem: message, 
      numeroTelefone: numero
  });
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
    }




async function disableLink(link) {
    console.log(link);
    //await  LinkModel.create({ key: link, used: false });

    const result = await Link_validator.findOne({ key: link, used: false });

    if (result) {
        console.log('link encontrado ')
        await Link_validator.updateOne({ key: link }, { $set: { used: true } })

    }
    else {

    }
    //   link.used = true;


}





router.get('/get_perguntas', async (req, res) => {


    const param1 = req.query.link;
    console.log(param1)
    // const lojaDeCalcados='lojaDeCalcados';

    try {
        // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);
        // console.log("entreiem tray")

        const links = await Link_validator.findOne({ key: param1, used: false })


        const categoria_find = await Loja.findOne({ email: links.loja })

        //    console.log("loja "+ categoria_find.categoria)
    // var resposta = await Perguntas.find({ categoria: categoria_find})


      var resposta = await Perguntas.find({ categoria: categoria_find.categoria })


        //  console.log("links"+links)


        res.json({resposta , vendedor: links.vendedor });



    } catch (error) {

        res.status(500).json({ error: 'Erro ao enviar mensagem', error });
    }
});


router.get('/testerota', async (req, res) => {
    const lojaDeCalcados = 'lojaDeCalcados';
    try {
        // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);
        console.log("entreiem tray")


        res.json({ "rota": "funcionaaaa" });



    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar mensagem', error });
    }
});
module.exports = router
