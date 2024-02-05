
const router = require('express').Router();
const  mongoose = require('mongoose');

const Perguntas = require('../models/perguntas');
const Respostas = require('../models/respostas');
const Link_validator = require('../models/Link_validator');
const Link_Mensagem = require('../models/link_mensagem');
const Loja = require('../models/loja');
const client = require('../models/whatsappClient');

router.post('/salvar_resposta', async (req, res) => {

//console.log("estou aqui",req.body)


  const { respostas ,link } = req.body

    console.log(respostas);
    // const respostas_recebidas =[ {
    //     pergunta,
    //     resposta,

    // }]

    //console.log(respostas)


    // const lojafind = await Link_validator.findOne({ key: link, used: false });
    // console.log("retorno loja "+ lojafind)

    try {

        const link_ = await Link_validator.findOne({ key:link , used: false });

        
        console.log("linkkkkkk"+ link_.tel_cliente )
  



if (link_ ){

    const salvar_db = {// esse modelo precis ser identico ao models
       
        respostas,
        id_loja:"1",
        Data:Date.now(),
    }
   

        await Respostas.create(salvar_db)
        // const nova_loja = await loja.save();
       await disableLink(link)
       
       
        const  _phoneId = await client.getNumberId("55"+ link_.tel_cliente)
// //console.log("enviando para "+ _phoneId._serialized)
const serialize = _phoneId._serialized;
       
       
        client.sendMessage(serialize, "Você Esta Participando")


        res.status(201).json({ message: "Resposta Salva" });

}   
else {
    res.status(201).json({ message: "link ja usado" });

}


    } catch (error) {
        res.status(201).json({ error: error.message });
    }


})



async function disableLink(link){
console.log(link);
    //await  LinkModel.create({ key: link, used: false });
  
   const result = await Link_validator.findOne({ key: link, used: false });

console.log(result)
    if (result){
        await  Link_validator.updateOne({ key: link } , {$set:{used: true}})

    }
    else{

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

           const links = await Link_validator.findOne({ key:param1,used: false })


           const categoria_find = await Loja.findOne({ email:links.loja})

        //    console.log("loja "+ categoria_find.categoria)

           
         var resposta = await Perguntas.find({ categoria:categoria_find.categoria})
            
            
          //  console.log("links"+links)
 

            res.json({resposta});
    
    
    
        } catch (error) {

            res.status(500).json({ error: 'Erro ao enviar mensagem' ,error});
        }
    });

    router.get('/testerota', async (req, res) => {
        const lojaDeCalcados='lojaDeCalcados';
            try {
                // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);
                console.log("entreiem tray")
    
        
                res.json({"rota": "funcionaaaa"});
        
        
        
            } catch (error) {
                res.status(500).json({ error: 'Erro ao enviar mensagem' ,error});
            }
        });
module.exports = router