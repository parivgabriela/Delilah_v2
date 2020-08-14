--Estos comandos eliminan las tablas en caso de que existan
DROP TABLE usuarios;
DROP TABLE pedidos;
DROP TABLE pedidos_platos;
DROP TABLE platos;


-- Table Creation
CREATE TABLE usuario (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  usuario VARCHAR (60) NOT NULL,
  nombre_apellido VARCHAR (60) NOT NULL,
  mail VARCHAR(60) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  domicilio VARCHAR (60) NOT NULL,
  password VARCHAR(20) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE pedidos (
  id_pedido INT PRIMARY KEY AUTO_INCREMENT,
  t_pago VARCHAR (60) NOT NULL,
  estado_pedido VARCHAR(60) NOT NULL,
  date DATETIME NOT NULL,
  total VARCHAR(20) NOT NULL,
  id_user INT NOT NULL,
  id_carrito INT NOT NULL
);
CREATE TABLE platos (
  id_plato INT PRIMARY KEY AUTO_INCREMENT,
  nombre_plato VARCHAR (60) NOT NULL,
  precio FLOAT NOT NULL,
  url_plato VARCHAR(200) NOT NULL,
);

CREATE TABLE carritos (
  id_carrito INT PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT NOT NULL,
  id_plato INT NOT NULL,
  cantidad INT NOT NULL
);

INSERT INTO USUARIO VALUES (NULL,"user1","Fulani TA","aa@gmail.com","4343456","ESTADOS UNIDOS 444","1234",FALSE);
INSERT INTO USUARIO VALUES (NULL,"3user","Fulani TE","aa@gmail.com","4343456","La plata 444","1234",FALSE);
INSERT INTO USUARIO VALUES (NULL,"4user","Fulani TI","aa@gmail.com","4343456","Juramento 444","1234",FALSE);
INSERT INTO USUARIO VALUES (NULL,"5user","Fulani TO","aa@gmail.com","4343456","Jujuy 444","1234",FALSE);