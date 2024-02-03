const  mongoose = require('mongoose');

const Categorias = mongoose.model('Categorias',{
    
    categoria:Array,

})


module.exports= Categorias