# Delilah_v2
Tercer Proyecto de Acamica
<p>El programa es una API de un restaurant, en el que existen dos roles, <b>cliente y administrador</b> que tienen distintos permisos.
Un cliente puede ver el todos lo platos, realizar y ver su pedido, ver su propia información. En cambio alguien con el rol de administrador puede editar los platos, listar todos los usuario y también sus pedidos.</p>

<b>Requisitos</b>
  <p> Programas que debe instalar para utilizar esta API</p>
  -Node. Se debe instalar desde su página oficial
  
<b>Dependencia de Node utilizadas</b> </br>
 -Express.</br>
 -Jonwebtoken.</br>
 -body-parser.</br>
 -sqlite3.</br>
  -nodemon.</br>

##Implemetación de la API<br>
Para comenzar a utilizar Delilah API, primero debe clonar el repositorio en sus archivos locales, desde la terminal ejecutar:

```
git clone https://github.com/parivgabriela/Delilah_v2.git
```
Una vez clonado el repositorio en tu carpeta, ejecutar el siguiente comando :
```
npm install
```

Ahora si, empecemos a probar! Ejecuta el siguiente comando:
```
nodemon server.js
```
Para probarlo en Postman, la tura debe ser: 
```
http://localhost:3000/
```
Todos los endpoints que existen estan descriptos en la siguiente ruta podes visualizarlo con mayor detalle en https://editor.swagger.io/, en la opción de  File-> Import URL->(acá pegas la siguiente ruta)

```
https://github.com/parivgabriela/Delilah_v2/blob/master/Docs/swagger.json
```

