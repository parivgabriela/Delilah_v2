const express = require('express');
const bodyParser=require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const sqlite=require('sqlite3');
const database=require('./DB/db');
const db=new sqlite.Database('./delilah.sqlite',(err)=>console.log(err));
const is_admin=1,not_admin=0;
var id_usuario=6,id_pedido=10,id_carrito=20,id_plato=55;
var usuario_activo =-1;//si esta en este valor -1 significa que no hay uno activo
const api = express();
api.use(bodyParser.json());
//api.use(bodyParser.urlencoded({extended:false}));

function inicializarDB(){
  db.serialize(function() {
     db.run('DROP TABLE usuarios');
      
     db.run("CREATE TABLE usuarios ( id_usuario INT PRIMARY KEY NOT NULL, usuario VARCHAR (60) NOT NULL, nombre_apellido VARCHAR (60) NOT NULL, mail VARCHAR(60) NOT NULL, telefono VARCHAR(20) NOT NULL, domicilio VARCHAR (60) NOT NULL, password VARCHAR(20) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE)");
     db.run('CREATE TABLE pedidos (id_pedido INT PRIMARY KEY NOT NULL,t_pago VARCHAR (60) NOT NULL,estado_pedido VARCHAR(60) NOT NULL,date DATETIME NOT NULL,total VARCHAR(20) NOT NULL,id_user INT NOT NULL,id_carrito INT NOT NULL)');
     db.run('CREATE TABLE platos (id_plato INT PRIMARY KEY ,nombre_plato VARCHAR (60) NOT NULL,precio FLOAT NOT NULL,url_plato VARCHAR(200) NOT NULL)');
     db.run('CREATE TABLE carritos (id_carrito INT PRIMARY KEY,id_pedido INT NOT NULL,id_plato INT NOT NULL,cantidad INT NOT NULL)');

  });
  db.serialize(function() {
          db.all('INSERT INTO usuarios VALUES (1,"admin","admin TA","aa@gmail.com","4343456","ESTADOS UNIDOS 444","1234",TRUE)');
          db.all('INSERT INTO usuarios VALUES (2,"3user","Fulani TE","aa@gmail.com","4343456","La plata 444","1234",FALSE)');
          db.all('INSERT INTO usuarios VALUES (3,"4user","Fulani TI","aa@gmail.com","4343456","Juramento 444","1234",FALSE)');
          db.all('INSERT INTO usuarios VALUES (4,"5user","Fulani TO","aa@gmail.com","4343456","Jujuy 444","1234",FALSE)');

          db.all('INSERT INTO platos VALUES (49,"pizza","300","https://www.delonghi.com/Global/recipes/multifry/pizza_fresca.jpg")');

          db.all('select * from usuarios',(err,resultados)=>{
             console.log(resultados);
         });
         
      
});
}
inicializarDB();
api.listen(3000, (req,res) => {
    console.log('Servidor Delilah resto activo...');
   // res.json(req);
});

api.post('/usuarios', (req, res, next) => {
    const { usuario, nombre_apellido, mail, telefono, domicilio, password } = req.body;
    console.log(usuario,nombre_apellido,mail,telefono,domicilio,password);
    try{
      //rever que onda con los inser cuando se reemplaza, pero viene por aqui la cosa
      db.serialize(function() {
      db.run("INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)",id_usuario,usuario, nombre_apellido, mail, telefono, domicilio, password,not_admin);
      id_usuario++; 
      db.all('select * from usuarios',(err,resultados)=>{
          console.log(resultados);
        });
      });
      res.status(utils.mensajeServer.statusOkCreacionUsuarioMensaje);
        res.status(utils.estadoDeServer.statusOk);
      next();
    }
    catch (error) {
    console.log(error);
    console.log(utils.estadoDeServer.statusErrorCliente);
		next(new Error(error));
	}
   
});
api.get('/login', (req, res,next) => {
  //console.log(req);
  const { usuario, password } = req.body;
  console.log("usuario "+ usuario);
  const usuarioEncontrado = comprobarCuentaIngreso(usuario, password);
  if (!usuarioEncontrado) {
      res.send(utils.mensajeServer.statusErrorClienteMensaje);
      res.status(utils.estadoDeServer.statusErrorCliente);
  }
  res.status(utils.mensajeServer.statusOkMensaje);
  res.status(utils.estadoDeServer.statusOk);
});

api.get('/platos', (req, res,next)=>{
  db.serialize(function(){
    db.run('SELECT * platos',(err,resultados)=>{
          console.log(resultados);
          res.status(utils.mensajeServer.statusOkConsulta);
          res.status(utils.estadoDeServer.statusOk);
    })
  });
});
api.post('/pedido', (req, res,next)=>{
  const { carrito, t_pago, id_usuario, telefono, domicilio, password } = req.body;
  db.serialize(function(){
    db.run('SELECT * platos',(err,resultados)=>{
          console.log(resultados);
          res.status(utils.mensajeServer.statusOkConsulta);
          res.status(utils.estadoDeServer.statusOk);
    })
  });
});
function comprobarCuentaIngreso(usuario_o_mail, password) {
  db.serialize(function(){
    db.run('SELECT * FROM usuarios WHERE mail=?',usuario_o_mail,(err,resultados)=>{
      //if(usuario_o_mail===resultados.usuario || usuario_o_mail===resultados.mail);
      console.log("Los resultados son "+resultados);
      console.log(err);
      return true;
      //console.log(err);
  });
  })

}

