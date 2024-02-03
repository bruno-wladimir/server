const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const loja_router = require('./routes/loja')
const user_router = require('./routes/user');
const router = require('./routes/loja');
const port =process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());



const uri = "mongodb+srv://brunowladimir14:kjx7AcaQxLGU_ja@cluster0.cjhf316.mongodb.net/?retryWrites=true&w=majority";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true ,useNewUrlParser: true,
useUnifiedTopology: true,
tls: true,
tlsAllowInvalidHostnames: true, } };


mongoose.connect(uri, clientOptions)


// const categorias = ['Roupas', 'Calçados', 'Auto peças', 'Restaurantes', 'Supermercados'];
// const vendedores = ['Bruna', 'Ray', 'Bia']
// const dados_loja = {

//   nome: "Loja Bruno",
//   telefone: "31-9999999",
//   cidade: "jm",
//   categoria: "Roupas",
//   vendedores: vendedores
// };


// Rotas

app.use('/loja',loja_router)

app.use('/user',user_router)


app.post('/usuarios', async (req, res) => {

  const { nome, email } = req.body;
  const usuario = new Usuario({ nome, email });

  try {
    const novoUsuario = await usuario.save();
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);

});

