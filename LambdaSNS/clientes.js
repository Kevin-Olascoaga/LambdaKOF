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
        p1: "B",
        p2: "A",
        p3: "",
        p4: "",
        p5: "" 
        },
    GEC: {
        p1: "SI",
        p2: "NO",
        p3: "SI"
        }
    };

    callback(null, {"message": "Successfully executed"});
}