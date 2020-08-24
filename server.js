const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const sqlite = require('sqlite3');
const database = require('./DB/db');
const util = require('util');
const { json } = require('body-parser');
var info_plato;
const db = new sqlite.Database('./delilah.sqlite', (err) => console.log(err));
var is_admin = 0;
var id_usuario = 5,
    id_pedido = 10,
    id_carrito = 20,
    id_plato = 51;
var usuario_activo = 0; 
const api = express();
api.use(bodyParser.json());

function inicializarDB() {
    db.serialize(function() {
        db.run('DROP TABLE usuarios');
        db.run('DROP TABLE pedidos');
        db.run('DROP TABLE platos');
        db.run('DROP TABLE carritos');
        db.run("CREATE TABLE usuarios ( id_usuario INT PRIMARY KEY NOT NULL, usuario VARCHAR (60) NOT NULL, nombre_apellido VARCHAR (60) NOT NULL, mail VARCHAR(60) NOT NULL, telefono VARCHAR(20) NOT NULL, domicilio VARCHAR (60) NOT NULL, password VARCHAR(20) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE)");
        db.run('CREATE TABLE pedidos (id_pedido INT PRIMARY KEY NOT NULL,t_pago INT NOT NULL,estado_pedido INT NOT NULL,date DATETIME NOT NULL,total VARCHAR(20) NOT NULL,id_user INT NOT NULL,id_carrito INT NOT NULL)');
        db.run('CREATE TABLE platos (id_plato INT PRIMARY KEY ,nombre_plato VARCHAR (60) NOT NULL,precio FLOAT NOT NULL,stock INT NOT NULL,url_plato VARCHAR(200) NOT NULL)');
        db.run('CREATE TABLE carritos (id_carrito INT PRIMARY KEY,id_pedido INT NOT NULL,id_plato INT NOT NULL,cantidad INT NOT NULL)');

    });
    db.serialize(function() {
        db.all('INSERT INTO usuarios VALUES (1,"admin","admin TA","aa@gmail.com","4343456","ESTADOS UNIDOS 444","1234",TRUE)');
        db.all('INSERT INTO usuarios VALUES (2,"3user","Fulani TE","aa@gmail.com","4343456","La plata 444","1234",FALSE)');
        db.all('INSERT INTO usuarios VALUES (3,"4user","Fulani TI","aa@gmail.com","4343456","Juramento 444","1234",FALSE)');
        db.all('INSERT INTO usuarios VALUES (4,"5user","Fulani TO","aa@gmail.com","4343456","Jujuy 444","1234",FALSE)');
        db.all('INSERT INTO platos VALUES (50,"pizza","300",2,"https://www.delonghi.com/Global/recipes/multifry/pizza_fresca.jpg")');

    });
}
inicializarDB();

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }

}

api.listen(3000, (req, res) => {
    let fecha = new Date();
    console.log(fecha + ' : Servidor Delilah resto activo...');
});

api.post('/usuarios', (req, res, next) => {
    const { usuario, nombre_apellido, mail, telefono, domicilio, password } = req.body;
    console.log(usuario, nombre_apellido, mail, telefono, domicilio, password);
    try {
        //rever que onda con los inser cuando se reemplaza, pero viene por aqui la cosa
        db.serialize(function() {
            db.run("INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)", id_usuario, usuario, nombre_apellido, mail, telefono, domicilio, password, not_admin);
            id_usuario++;
            db.all('select * from usuarios', (err, resultados) => {
                console.log(resultados);
            });
        });
        res.status(utils.mensajeServer.statusOkCreacionUsuarioMensaje);
        res.status(utils.estadoDeServer.statusOk);
        next();
    } catch (error) {
        console.log(error);
        console.log(utils.estadoDeServer.statusErrorCliente);
        next(new Error(error));
    }

});

api.get('/usuarios', (req, res) => {
    if (usuario_activo && is_admin) {
        console.log("ingreso de admin");
        db.serialize(function() {
            db.all('SELECT * from usuarios', (err, resultados) => {
                console.log(resultados);
            });
        });
        res.send(utils.mensajeServer.statusOkConsulta);
        res.status(utils.estadoDeServer.statusOk);
    } else {
        if(usuario_activo){
        console.log("ingreso de usuario");

            db.serialize(function() {
                db.all('SELECT * from usuarios where id=?', usuario_activo, (err, resultados) => {
                    console.log(resultados);
                });
            });
            res.send(utils.mensajeServer.statusOkConsulta);
        res.status(utils.estadoDeServer.statusOk);
        }
        else{
        console.log("ingreso de intruso "+utils.mensajeServer.statusNotFoundMensaje);
            res.send(utils.mensajeServer.statusNotFoundMensaje);
        res.status(utils.estadoDeServer.statusOk);
        }
       
    }
});

api.post('/login', (req, res) => {
    //console.log(req);
  const { usuario, mail, password } = req.body;
//console.log("usuario "+ usuario+ " mail "+ mail+ " password "+ password);

    if (typeof mail === 'undefined') {
        db.serialize(function() {   
            db.all('SELECT id_usuario,usuario,password,is_admin from usuarios where usuario=?', usuario, (err, resultados) => {
              
                if(resultados[0].password===password && (!err)){
                console.log("ingreso exitoso");
                usuario_activo=resultados[0].id_usuario;
                if(resultados[0].is_admin)
                {
                    is_admin=1;
                    const token=jwt.sign({usuario_activo},utils.clavesecreta);
                    res.header('auth-token',token).send(token);
                }
              // res.send(utils.mensajeServer.statusOkConsulta);
                res.status(utils.estadoDeServer.statusOk);
               }else{
                res.send(utils.mensajeServer.statusErrorClienteMensaje);
                res.status(utils.estadoDeServer.statusErrorCliente);
               }               
            });
        });
    } else {
        db.serialize(function() {
            db.all('SELECT id_usuario,usuario,password,is_admin FROM usuarios WHERE mail=?', mail, (err, resultados) => {
              
               if(resultados[0].password===password){
                console.log("ingreso exitoso");
                usuario_activo=resultados[0].id_usuario;
                if(resultados[0].is_admin)
                {
                    is_admin=1;
                    const token=jwt.sign({usuario_activo},utils.clavesecreta);
                    res.header('auth-token',token).send(token);
                }
                res.send(utils.mensajeServer.statusOkConsulta);
                res.status(utils.estadoDeServer.statusOk);
                next();
               }else{
                res.send(utils.mensajeServer.statusErrorClienteMensaje);
                res.status(utils.estadoDeServer.statusErrorCliente);
               }
           
            });
        });
    }

});


api.get('/platos', (req, res, next) => {
    db.serialize(function() {
        db.all('SELECT * from platos', (err, resultados) => {
            console.log(resultados);
        });
    });
    res.send(utils.mensajeServer.statusOkConsulta);
    res.status(utils.estadoDeServer.statusOk);
});

//agregar modificacion de admin
api.post('/platos',verifyToken, (req, res, next) => {
    const { nombre_plato, precio, url_plato, stock } = req.body;
    if(is_admin){
        db.serialize(function() {
            db.run("INSERT INTO platos VALUES (?,?,?,?,?)", id_plato, nombre_plato, precio, stock, url_plato);
            id_plato++;
            res.send(utils.mensajeServer.statusOkConsulta);
            res.status(utils.estadoDeServer.statusOk);
        });
    }else{
        res.status(utils.estadoDeServer.statusErrorCredenciales).send(utils.mensajeServer.statusErrorCredencialesMensaje);
    }
});

api.post('/pedidos',verifyToken, (req, res, next) => {
    //verificar que el usuario este activo--> se haya logueado
    const { t_pago, id_usuario, domicilio, total, carrito } = req.body;
    console.log(t_pago, id_usuario, domicilio, total, carrito);
    var fecha = new Date();
    try {
        db.serialize(function() {
            db.all('INSERT INTO pedidos VALUES (?,?,?,?,?,?,?)', id_pedido, t_pago, utils.estadoPedidos.pedidoNuevo, fecha, total, id_usuario, id_carrito);
            db.all('INSERT INTO carritos VALUES (?,?,?,?)', id_carrito, id_pedido, carrito[0].id_plato, carrito[0].cantidad);
            id_carrito++;
        });
        res.send(utils.mensajeServer.statusOkConsulta);
        res.status(utils.estadoDeServer.statusOk);
        next();
    } catch (error) {
        console.log(error);
        console.log(utils.estadoDeServer.statusErrorCliente);
        next(new Error(error));
    }

});

api.get('/platos/:id_plato', verifyToken, (req, res) => {
    let un_id_plato = req.params.id_plato;
    let un_plato;
    if(is_admin){
        db.all('SELECT * FROM platos WHERE id_plato=?',un_id_plato, (err, resultados) => {
            un_plato=JSON.stringify(resultados[0]);
            res.status(utils.estadoDeServer.statusOk).send(JSON.parse(un_plato));
        });
    }else{
        res.status(utils.estadoDeServer.statusErrorCredenciales).send(utils.mensajeServer.statusErrorCredencialesMensaje);
    }
       
});

api.put('/platos/:id_plato', verifyToken, (req, res) => {
    let un_id_plato = req.params.id_plato;
    const {stock}=req.body;
    let un_plato;
    if(is_admin){
        db.all('UPDATE platos SET stock=? WHERE id_plato=?',stock,un_id_plato, (err, resultados) => {
            //un_plato=JSON.stringify(resultados[0]);
            res.status(utils.estadoDeServer.statusOk);
            res.send(utils.mensajeServer.statusOkActualizacion);
        });
    }else{
        res.status(utils.estadoDeServer.statusErrorCredenciales).send(utils.mensajeServer.statusErrorCredencialesMensaje);
    }
       
});
api.delete('/pedidos/:id_pedidos', verifyToken, (req, res) => {
    let un_id_plato = req.params.id_plato;
    if(is_admin){
        db.all('DELETE platos WHERE id_pedido=?',un_id_plato, (err, resultados) => {
            //un_plato=JSON.stringify(resultados[0]);
            res.status(utils.estadoDeServer.statusOk);
            res.send(utils.mensajeServer.statusDeleteOk);
        });
    }else{
        res.status(utils.estadoDeServer.statusErrorCredenciales).send(utils.mensajeServer.statusErrorCredencialesMensaje);
    }
       
});


