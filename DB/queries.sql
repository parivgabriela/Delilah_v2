
        --El modo de trabajar con las siguientes queries es enviandolas al endpoint '/db/init', 
        --Es muy importante seguir el orden de los siguientes comandos y crear todas las tablas para realizar las consultas
        /*
        {
          "unaquery":"Ejemplo de cualquier linea de query"
        } 
        */
        "CREATE TABLE IF NOT EXISTS usuarios ( id_usuario INT PRIMARY KEY NOT NULL, usuario VARCHAR (60) NOT NULL, nombre_apellido VARCHAR (60) NOT NULL, mail VARCHAR(60) NOT NULL, telefono VARCHAR(20) NOT NULL, domicilio VARCHAR (60) NOT NULL, password VARCHAR(20) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE)"
        "CREATE TABLE IF NOT EXISTS pedidos (id_pedido INT PRIMARY KEY NOT NULL,t_pago INT NOT NULL,estado_pedido VARCHAR (15) NOT NULL,date DATETIME NOT NULL,total VARCHAR(20) NOT NULL,usuario VARCHAR (60) NOT NULL,id_carrito INT NOT NULL)"
        "CREATE TABLE IF NOT EXISTS platos (id_plato INT PRIMARY KEY ,nombre_plato VARCHAR (60) NOT NULL,precio FLOAT NOT NULL,stock INT NOT NULL,url_plato VARCHAR(200) NOT NULL)"
        "CREATE TABLE IF NOT EXISTS carritos (id_carrito INT PRIMARY KEY,id_pedido INT NOT NULL,id_plato INT NOT NULL,cantidad INT NOT NULL)"
      
      --Creacion de un rol admin, con los siguientes datos el sistema lo reconoce como admin y se los asigna, 
      --ingresar esta linea como query luego de haber creado la tabla usuarios
        "INSERT INTO usuarios VALUES (1,'admin','admin','admin@gmail.com','4343456','ESTADOS UNIDOS 444','1234',TRUE)"
    
        -- este paso es opcional, pues se puede agregar con Postman
        "INSERT INTO platos VALUES (50,'pizza','300',2,'https://www.delonghi.com/Global/recipes/multifry/pizza_fresca.jpg')"
  