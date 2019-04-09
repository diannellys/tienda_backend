var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Tienda = require('../models/tienda');

// ==========================================
// Obtener todas las tiendas
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Tienda.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, tiendas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tienda',
                        errors: err
                    });
                }

                Tienda.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        tiendas: tiendas,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Tienda por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Tienda.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, tienda) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar tienda',
                    errors: err
                });
            }

            if (!tienda) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El tienda con el id ' + id + 'no existe',
                    errors: { message: 'No existe un tienda con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                tienda: tienda
            });
        })
})





// ==========================================
// Actualizar tienda
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Tienda.findById(id, (err, tienda) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar tienda',
                errors: err
            });
        }

        if (!tienda) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tienda con el id ' + id + ' no existe',
                errors: { message: 'No existe un tienda con ese ID' }
            });
        }


        tienda.nombre = body.nombre;
        tienda.usuario = req.usuario._id;

        tienda.save((err, tiendaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar tienda',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                tienda: tiendaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo tienda
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tienda = new Tienda({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    tienda.save((err, tiendaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tienda',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            tienda: tiendaGuardado
        });


    });

});


// ============================================
//   Borrar un tienda por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Tienda.findByIdAndRemove(id, (err, TiendaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar tienda',
                errors: err
            });
        }

        if (!TiendaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un tienda con ese id',
                errors: { message: 'No existe un tienda con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            tienda: TiendaBorrado
        });

    });

});


module.exports = app;