var express = require('express');

var app = express();

var Producto = require('../models/producto');
var Usuario = require('../models/usuario');
var Tienda = require('../models/tienda');


// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'productos':
            promesa = buscarProductos(busqueda, regex);
            break;

            
        case 'tiendas':
        promesa = buscarTiendas(busqueda, regex);
        break;

        
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'No registrado',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarUsuarios(busqueda, regex),
            buscarProductos(busqueda, regex),
            buscarTiendas(busqueda, regex),

        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                tiendas: respuestas[2],
                productos: respuestas[1],
                usuarios: respuestas[0]
            });
        })


});



function buscarTiendas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Tienda.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, tiendas) => {

                if (err) {
                    reject('Error al cargar tiendas', err);
                } else {
                    resolve(tiendas)
                }
            });
    });
}
function buscarProductos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Producto.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('tienda')
            .exec((err, productos) => {

                if (err) {
                    reject('Error al cargar productos', err);
                } else {
                    resolve(productos)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;