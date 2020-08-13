const express = require('express');
const bodyParser=require('body-parser');
const jwt = require("jsonwebtoken");
const utils = require("./utils");
const api = express();

api.use(bodyParser.json());

api.listen(3000, (req,res) => {
    console.log('Servidor Delilah resto activo...');
   // res.json(req);
});
api.post('/usuarios', (req, res, next) => {
    const { usuario, nombre_ape, mail, telefono, domicilio, psw } = req.query;
    //res.send(usuario);
});
