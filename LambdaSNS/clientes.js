exports.handler = function(event, context, callback) {
    
    let cliente = {
    idCliente: event['idCliente'],
    codigoCliente: event['codigoCliente'],
    fechaAlta: event['fechaAlta'],
    nombreTienda: event['nombreTienda'],
    nombreContacto: event['nombreContacto'],
    apellidoContacto: event['apellidoContacto'],
    telefono: event['telefono'],
    celular: event['celular'],
    correo: event['correo'],
    latitud: event['latitud'],
    longitud: event['longitud'],
    codigoPostal: event['codigoPostal'],
    estado: event['estado'],
    municipio: event['municipio'],
    colonia: event['colonia'],
    calle: event['calle'],
    numero: event['numero'],
    rutaDeReparto: event['rutaDeReparto'],
    remision: event['remision'],
    regimenFiscal: event['regimenFiscal'],
    RFCnombre: event['RFCnombre'],
    RFCapellidos: event['RFCapellidos'],
    RFC: event['RFC'],
    RFCcodigoPostal: event['RFCcodigoPostal'],
    RFCestado: event['RFCestado'],
    RFCmunicipio: event['RFCmunicipio'],
    RFCcolonia: event['RFCcolonia'],
    RFCcalle: event['RFCcalle'],
    RFCnumeroExt: event['RFCnumeroExt'],
    RFCnumeroInt: event['RFCnumeroInt'],
    CFDI: event['CFDI'],
    descripcion: event['descripcion'],
    ISSCOM: {
        cuestionario: event['ISSCOM.cuestionario'],
        p1: event['ISSCOM.p1'],
        p2: event['ISSCOM.p2'],
        p3: event['ISSCOM.p3'],
        p4: event['ISSCOM.p4'],
        p5: event['ISSCOM.p5'] 
        },
    GEC: {
        p1: event['GEC.p1'],
        p2: event['GEC.p2'],
        p3: event['GEC.p3']
        }
    };

    callback(null, {"message": "Successfully executed"});
}