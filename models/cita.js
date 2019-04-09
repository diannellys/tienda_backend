var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var citaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fecha: { type: Date, required: [true, 'La fecha es necesaria'] },
}, { collection: 'citas' });

module.exports = mongoose.model('Citas', citaSchema);