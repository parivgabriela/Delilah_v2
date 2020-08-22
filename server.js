const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const sqlite = require('sqlite3');
const database = require('./DB/db');
const util = require('util');
const db = new sqlite.Database('./delilah.sqlite', (err) => console.log(err));
const is_admin = 0;
var id_usuario = 5,
    id_pedido = 10,
    id_carrito = 20,
    id_plato = 51;
var usuario_activo = 0; //si esta en este valor -1 significa que no hay uno activo
const api = express();
api.use(bodyParser.json());
//api.use(bodyParser.urlencoded({extended:false}));

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

        /* db.all('select * from usuarios',(err,resultados)=>{
            console.log(resultados[0].id_usuario);
        });*/


    });
}
inicializarDB();

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
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

api.get('/usuarios', (req, res, next) => {
    if (usuario_activo && esAdmin(usuario_activo)) {
        db.serialize(function() {
            db.all('SELECT * from usuarios', (err, resultados) => {
                console.log(resultados);
            });
        });
    } else {
        db.serialize(function() {
            db.all('SELECT * from usuarios where id=?', usuario_activo, (err, resultados) => {
                console.log(resultados);
            });
        });
    }
});

api.post('/login',comprobarCuentaIngreso, (req, res) => {
    //console.log(req);

    jwt.sign({ id_usuario }, utils.clavesecreta, { expiresIn: '1h' }, (err, token) => {
        res.json({
            token
        });
    });
    res.status(utils.mensajeServer.statusOkMensaje);
    res.status(utils.estadoDeServer.statusOk);
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
api.post('/platos', (req, res, next) => {
    const { nombre_plato, precio, url_plato, stock } = req.body;
    db.serialize(function() {
        db.run("INSERT INTO platos VALUES (?,?,?,?,?)", id_plato, nombre_plato, precio, stock, url_plato);
        id_plato++;
        res.send(utils.mensajeServer.statusOkConsulta);
        res.status(utils.estadoDeServer.statusOk);
    });

});

api.post('/pedidos', (req, res, next) => {
    //verificar que el usuario este activo--> se haya logueado
    const { t_pago, id_usuario, domicilio, total, carrito } = req.body;
    console.log(t_pago, id_usuario, domicilio, total, carrito);
    var fecha = new Date();
    //fecha.toLocateTimeString();
    // pedidos (id_pedido INT,t_pago VARCHAR,estado_pedido VARCHAR,date ,total ,id_user INT ,id_carrito )'); 
    try {
        db.serialize(function() {
            db.all('INSERT INTO pedidos VALUES (?,?,?,?,?,?,?)', id_pedido, t_pago, utils.estadoPedidos.pedidoNuevo, fecha, total, id_usuario, id_carrito);
            db.all('INSERT INTO carritos VALUES (?,?,?,?)', id_carrito, id_pedido, carrito[0].id_plato, carrito[0].cantidad);
            id_carrito++;
        });
        selectCarritos();
        selectpedidos();
        res.send(utils.mensajeServer.statusOkConsulta);
        res.status(utils.estadoDeServer.statusOk);
        next();
    } catch (error) {
        console.log(error);
        console.log(utils.estadoDeServer.statusErrorCliente);
        next(new Error(error));
    }

});
api.post('/carritos', (req, res, next) => {
    const { id_pedido, carrito } = req.body;
    db.serialize(function() {
        db.all('INSERT INTO carritos VALUES (?,?,?,?)', 11, 11, 11, 1, (err, resultados) => {
            console.log("Los resultados son " + resultados);
            console.log(err);
            id_carrito++;
        });
    });
    selectCarritos();
});
api.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});


function cargarCarrito(unCarrito) {
    for (let i = 0; i < unCarrito.length; i++) {
        db.serialize(function() {
            db.run('INSERT INTO carritos VALUES (?,?,?,?)', id_carrito, id_pedido, carrito[i].id_plato, carrito[i].cantidad, (err, resultados) => {
                //if(usuario_o_mail===resultados.usuario || usuario_o_mail===resultados.mail);
                console.log("Los resultados son " + resultados);
                id_carrito++;
            });
        });
    }
}
//if(typeof mail==='undefined') con esto compruebo cual ingreso
//en caso de que no exista retornar 0 
//middleware
function comprobarCuentaIngreso(req,res,next) {
  /*
  const { usuario, mail, password } = req.query;
  console.log(usuario);
    if (typeof mail === 'undefined') {
        db.serialize(function() {
            db.all('SELECT id_usuario,usuario,password,is_admin from usuarios where usuario=?', usuario, (err, resultados) => {
               if(resultados[0].password===password){
                console.log("ingreso exitoso");
                usuario_activo=resultados[0].id_usuario;
                if(resultados[0].is_admin)
                {
                  is_admin=1;
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
    } else {
        db.serialize(function() {
            db.all('SELECT id_usuario,usuario,password,is_admin FROM usuarios WHERE mail=?', mail, (err, resultados) => {
              
               if(resultados[0].password===password){
                console.log("ingreso exitoso");
                usuario_activo=resultados[0].id_usuario;
                  if(resultados[0].is_admin)
                  {
                    is_admin=1;
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
    */
   console.log("accediste");
   next();
}

function esIgual(unparametro, unaPassword) {
    console.log("el resultado del select where es " + unparametro);
    //var otroparametro = JSON.parse(unparametro);

    /*
    var otroparametro = JSON.parse(unparametro);
    console.log("en password es " + otroparametro[0].password+ " la otra pass "+unaPassword);
    let otravariable=util.inspect(unparametro);
    */
console.log(unparametro['is_usuario']);
    if(unparametro['password'] === unaPassword){
      console.log("comparo las  contraseñas");
    }else{
      console.log("no   comparo las  contraseñas "+unparametro['password']);
    }
    
    return unparametro[0].password === unaPassword;
}

function selectpedidos() {
    db.serialize(function() {
        db.all('select * from pedidos', (err, resultados) => {
            console.log(resultados);
        });
    })
}

function cargarCarrito() {
    db.serialize(function() {
        db.all('INSERT INTO carritos VALUES (4,4,4,4)');
        db.all('INSERT INTO carritos VALUES (5,6,4,1)');
    });
}

function selectCarritos() {
    db.serialize(function() {
        db.all('select * from carritos', (err, resultados) => {
            console.log(resultados);
        });
    })
}
cargarCarrito();
//middleware
function esAdmin(idUsuario,es_admin) {
   if(es_admin)
   {
     is_admin=idUsuario;
     console.log("es admin");
   }
  
}


function usuarioActivo(usuario) {
    usuario_activo = usuario;

}