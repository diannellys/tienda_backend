var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El id tienda es un campo obligatorio ']
    }
});


module.exports = mongoose.model('Categoria', productoSchema);