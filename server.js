const express = require('express');
const bodyParser=require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const db=require('./DB/db');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:3306/delilah');
const api = express();

api.use(bodyParser.json());

api.listen(3000, (req,res) => {
    console.log('Servidor Delilah resto activo...');
   // res.json(req);
});
api.get('/',(req,res)=>{
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
})
api.post('/usuarios', (req, res, next) => {
    const { usuario, nombre_apellido, mail, telefono, domicilio, password } = req.query;
    
    try{
        sequelize.query(
            "INSERT INTO usuarios VALUES (NULL,?,?,?,?,?,?,false)", {replacements: [ usuario, nombre_apellido, mail, telefono, domicilio, password ],   type:sequelize.QueryTypes.INSERT }
        ).then(function(resultado){
res.send("ok");
        });
    }
    catch (error) {
		console.log(error);
		next(new Error(error));
	}
   
});

