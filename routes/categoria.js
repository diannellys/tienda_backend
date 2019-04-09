var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Categoria = require('../models/categoria');

// ==========================================
// Obtener todos las categorias
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('producto')
        .exec(
            (err, categorias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Categorias',
                        errors: err
                    });
                }

                Categoria.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        categorias: categorias,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener Categoria
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Categoria.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('producto')
        .exec((err, categoria) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar categoria',
                    errors: err
                });
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La categoria con el id ' + id + ' no existe',
                    errors: { message: 'No existe un medico con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoria
            });

        })


});


// ==========================================
// Actualizar Categoria
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Producto',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Producto con el id ' + id + ' no existe',
                errors: { message: 'No existe un Producto con ese ID' }
            });
        }


        categoria.nombre = body.nombre;
        categoria.usuario = req.usuario._id;
        categoria.producto = body.categoria;

        categoria.save((err, categoriaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo Producto
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var categoria = new Producto({
        nombre: body.nombre,
        usuario: req.usuario._id,
        categoria: body.categoria
    });

    categoria.save((err, categoriaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado
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