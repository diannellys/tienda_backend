var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tienda: {
        type: Schema.Types.ObjectId,
        ref: 'Tienda',
        required: [true, 'El id tienda es un campo obligatorio ']
    }
});


module.exports = mongoose.model('Producto', productoSchema);