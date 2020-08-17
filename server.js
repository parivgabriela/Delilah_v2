const express = require('express');
const bodyParser=require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const sqlite=require('sqlite3');
const database=require('./DB/db');
const db=new sqlite.Database('./delilah.sqlite',(err)=>console.log(err));
const is_admin=1,not_admin=0;
var id_usuario=5;
const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended:false}));

function inicializarDB(){
  db.serialize(function() {
     db.run('DROP TABLE usuarios');
      
     db.run("CREATE TABLE usuarios ( id_usuario INT PRIMARY KEY NOT NULL, usuario VARCHAR (60) NOT NULL, nombre_apellido VARCHAR (60) NOT NULL, mail VARCHAR(60) NOT NULL, telefono VARCHAR(20) NOT NULL, domicilio VARCHAR (60) NOT NULL, password VARCHAR(20) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE)");

  });
  db.serialize(function() {
          db.all('INSERT INTO usuarios VALUES (1,"admin","admin TA","aa@gmail.com","4343456","ESTADOS UNIDOS 444","1234",TRUE)');
          db.all('INSERT INTO usuarios VALUES (2,"3user","Fulani TE","aa@gmail.com","4343456","La plata 444","1234",FALSE)');
          db.all('INSERT INTO usuarios VALUES (3,"4user","Fulani TI","aa@gmail.com","4343456","Juramento 444","1234",FALSE)');
          db.all('INSERT INTO usuarios VALUES (4,"5user","Fulani TO","aa@gmail.com","4343456","Jujuy 444","1234",FALSE)');
          
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
   //  var stmt=db.prepare("INSERT INTO usuarios VALUES ("+id_usuario+","+usuario+","+nombre_apellido+","+mail+","+telefono+","+domicilio+","+password+",FALSE");
   //stmt.run(id_usuario,usuario, nombre_apellido, mail, telefono, domicilio, password,not_admin);
   //stmt.finalize();
   db.all('select * from usuarios',(err,resultados)=>{
    console.log(resultados);
});
      });
next();
    }
    catch (error) {
		console.log(error);
		next(new Error(error));
	}
   
});
api.get('/usuarios', (req, res) => {
  //console.log(req);
  const { usuario_o_mail, password } = req.body;
  const usuarioEncontrado = comprobarCuentaIngreso(usuario_o_mail, password);
  if (!usuarioEncontrado) {
      res.send('Error, no se encontro usuario/mail inexistente en el sistema');
      res.status(utils.estadoDeServer.statusErrorCliente);
  }
  res.send('Ok. Ingreso exitoso');

  res.json(req.body);
});

function comprobarCuentaIngreso(usuario_o_mail, password) {
  db.all('select usuario,mail from usuarios',(err,resultados)=>{
    console.log(resultados);
});
}

