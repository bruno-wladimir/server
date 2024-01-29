const router = require('express').Router();

const Loja = require('../models/loja')
const Respostas = require('../models/respostas')

const Perguntas = require('../models/perguntas')

router.get('/get_dados_lojista', async (req, res) => {

    var envio = {
        categoria: categorias,
        dados_loja: dados_loja
    }

    try {
        // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);
        res.json({ status: 'Mensagem enviada com sucesso!', envio });



    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

router.get('/get_respostas', async (req, res) => {
console.log("estou suqi")
const id_pesquisa='2';

    try {
        // await client.sendMessage("55"+ parametro2+"@c.us", parametro1);
    
        const respostasDaLoja = await Respostas.find({ loja_id:id_pesquisa})
        
        
        
        console.log(respostasDaLoja)

        res.json({ status: 'Mensagem enviada com sucesso!', response:respostasDaLoja });



    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar mensagem' ,error});
    }
});





router.post('/salvar_dados_logista', async (req, res) => {


    console.log("recebendo post")
    const { nome_loja, telefone_loja, cidade, categoria, vendedores } = req.body

    const loja = {

        nome_loja,
        telefone_loja,
        cidade,
        categoria,
        vendedores

    }
    const filtro = { nome_loja:nome_loja };
    try {
    const loja_find = await Loja.findOne({nome_loja:nome_loja })

    if (loja_find){

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




module.exports = router