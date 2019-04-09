var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Producto = require('../models/producto');

// ==========================================
// Obtener todos los productos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; 
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('tienda', 'nombre usuario img')
        .exec(
            (err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Producto',
                        errors: err
                    });
                }

                Producto.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        productos: productos,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener Producto
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('tienda')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar producto',
                    errors: err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    productos: productos,

                    mensaje: 'La tienda con el id ' + id + ' no existe',
                    errors: { message: 'No existe una tienda con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                productos: productos
            });

        })


});


// ==========================================
// Actualizar Producto
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Producto',
                errors: err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Producto con el id ' + id + ' no existe',
                errors: { message: 'No existe un Producto con ese ID' }
            });
        }


        producto.nombre = body.nombre;
        producto.usuario = req.usuario._id;
        producto.tienda = body.tienda;

        producto.save((err, productoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Producto',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo Producto
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var producto = new Producto({
        nombre: body.nombre,
        usuario: req.usuario._id,
        tienda: body.tienda
    });

    producto.save((err, productoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Producto',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoGuardado
        });


    });

});


// ============================================
//   Borrar un Producto por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar Producto',
                errors: err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un Producto con ese id',
                errors: { message: 'No existe un Producto con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoBorrado
        });

    });

});


module.exports = app;