const statusOk = 200,
    statusOkValidacion=201,
    statusOkPedido=203,
    statusErrorCliente = 400,//bad request ingreso datos invalidos
    statusErrorCredenciales=401,//Unauthorized
    statusNotFound=404,
    statusErrorServidor=500;//Internal Server Error
    const statusOkMensaje = 'Ingreso exitoso',
    statusOkValidacionMensaje="Usuario verificado",
    statusOkPedidoMensaje="Pedido ingresado exitosamente",
    statusErrorClienteMensaje ='Datos incorrectos',//bad request
    statusErrorCredencialesMensaje='Credencial inválida, no puede ingresar',//Unauthorized
    statusNotFoundMensaje='status not found',
    statusErrorServidorMensaje='Internal Server Error',//Internal Server Error
    statusCargadoCarritoMensaje="Se cargo en el carrito";
//def estados de los pedidos
const pedidoNuevo=10,pedidoConfirmado=20,pedidoPreparado=30,pedidoEnviado=40,pedidoCancelado=50,
pedidoEntregado=60;

const estadoPedidos={
    pedidoNuevo,pedidoConfirmado,pedidoPreparado,pedidoEnviado,pedidoCancelado,pedidoEntregado
}
const estadoDeServer={ 
    statusOk, statusOkValidacion ,
    statusOkPedido,
     statusErrorCliente, 
     statusErrorCredenciales, statusNotFound, statusErrorServidor}
    const mensajeServer={
        statusOkMensaje,
        statusOkValidacionMensaje,
        statusOkPedidoMensaje,
        statusErrorClienteMensaje,
        statusErrorCredencialesMensaje,
        statusNotFoundMensaje, 
        statusErrorServidorMensaje,
        statusCargadoCarritoMensaje
    };
//prueba para ejecutar la consola
let usuarios = [{
    nombre_ape: "lolo pari",
    usuario: "lolopari",
    domicilio: "estados unidos",
    psw: "lolo",
    mail: "lolo@gmail.com",
    rol: true
},
{
    usuario: "charlotte",
    nombre_ape: "charlotte pari",
    mail: "charlotte@gmail.com",
    telefono:"123441"
    domicilio: "francia",
    psw: "charlotte",
 
    rol: false
}
];
//utils.mensajeServer.
//utils.estadoPedidos.
//utils.estadoDeServer
module.exports = { estadoDeServer,estadoPedidos,mensajeServer};