exports.handler = function(event, context, callback) {
    let idCliente = event['idCliente'];
    
    callback(null, {"codigoCliente": idCliente});
}