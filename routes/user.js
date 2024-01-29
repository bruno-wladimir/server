
const router = require('express').Router();

const Perguntas = require('../models/perguntas');
const Resposta = require('../models/respostas');

router.post('/salvar_resposta', async (req, res) => {

//console.log("estou aqui",req.body)


  const { respostas } = req.body

    
    // const respostas_recebidas =[ {
    //     pergunta,
    //     resposta,

    // }]

    //console.log(respostas)

    const salvar_db = {// esse modelo precis ser identico ao models
       
        respostas,
        id_loja:"1",
        Data:Date.now(),
    }
   

    try {

    await Resposta.create(salvar_db)
        // const nova_loja = await loja.save();
        res.status(201).json({ message: "Resposta Salva " });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }


})


router.get('/get_perguntas', async (req, res) => {
    console.log("estou  em perguntas")
    const lojaDeCalcados='lojaDeCalcados';
        try {
            // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);
            console.log("entreiem tray")

            const perguntas_da_categoria = await Perguntas.find({ categoria:lojaDeCalcados})
            
            
            console.log(perguntas_da_categoria)
 

            res.json({perguntas_da_categoria});
    
    
    
        } catch (error) {
            res.status(500).json({ error: 'Erro ao enviar mensagem' ,error});
        }
    });
module.exports = router