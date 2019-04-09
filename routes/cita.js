var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Cita = require('../models/cita');

// ==========================================
// Obtener la cita
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cita.find({})
        .skip(desde)
        .limit(10)
        .populate('usuario', 'fecha usuario')
        .exec(
            (err, citas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando la Cita',
                        errors: err
                    });
                }

                Cita.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        citas: citas,
                        total: conteo
                    });

                })

            });
});


// ==========================================
// PUT:  Actualizar Cita
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Cita.findById(id, (err, cita) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Cita',
                errors: err
            });
        }

        if (!cita) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La cita con el id ' + id + ' no existe',
                errors: { message: 'No existe una cita con ese ID' }
            });
        }


        cita.nombre = body.nombre;
        cita.usuario = req.usuario._id;
        cita.fecha = body.fecha;
        

        cita.save((err, citaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cita',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cita: citaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo Cita
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var cita = new Cita({
        nombre: body.nombre,
        usuario: req.usuario._id,
        fecha: body.fecha,
    
    });

    cita.save((err, citaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Cita',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            cita: citaGuardado
        });


    });

});


// ============================================
//   Borrar una cita por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Cita.findByIdAndRemove(id, (err, citaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar la cita',
                errors: err
            });
        }

        if (!citaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una cita con ese id',
                errors: { message: 'No existe una cita con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            cita: citaBorrado
        });

    });

});


module.exports = app;