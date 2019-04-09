var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Producto = require('../models/producto');
var Tienda = require('../models/tienda');


// default options
app.use(fileUpload());




app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección
    var tiposValidos = ['tiendas', 'productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');

    console.log(nombreCortado);
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg','JPG'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    console.log( 'Error al mover archivo '+ tipo) ;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res);
    })



});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })


        });

    }

    if (tipo === 'productos') {

        Producto.findById(id, (err, producto) => {

            if (!producto) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Producto no existe',
                    errors: { message: 'Producto no existe' }
                });
            }

            var pathViejo = './uploads/productos/' + producto.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            producto.img = nombreArchivo;

            producto.save((err, productoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de producto actualizada',
                    producto: productoActualizado
                });

            })

        });
    }

    if (tipo === 'tiendas') {
   console.log("estoy subiendo archivo de tienda");
        Tienda.findById(id, (err, tienda) => {

            if (!tienda) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Tienda no existe',
                    errors: { message: 'Tienda no existe' }
                });
            }

            var pathViejo = './uploads/tiendas/' + tienda.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            tienda.img = nombreArchivo;

            tienda.save((err, tiendaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de tienda actualizada',
                    tienda: tiendaActualizado
                });

            })

        });
    }


}



module.exports = app;