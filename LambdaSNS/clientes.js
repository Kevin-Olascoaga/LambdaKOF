exports.handler = function(event, context, callback) {
    
    let cliente = {
        //Back
    idOficinaMovil: "", //Identificador aleatorio para OM (16)
    orgVentas: "0142", //Dato fijo de organización de ventas 0142
    region: "", //**Generar con el catalogo de codigo postal
    distribuidora: "", //**Generar con el catalogo de codigo postal
    KUNNR: "CD00000000", //Dato fijo para clientes nuevos
    idSolicitud: "", //Generar aleatorio (22),
    solicitudAlta: "ZB18", //Dato fijo para altas de cliente
    rutaPreventa: "", //**Generar con el catalogo de rutas
    nota: ".", //Se solicita en la mascara de clientes
    fechaCreacion: "", //Extraer con la información de fechaAlta
    horaCreacion: "", //Extraer con la información de fechaAlta
        //Front Appian
    idCliente: event['idCliente'], //Generado incrementalmente desde Appian, temporal hasta que se tenga el definitivo de SAP
    codigoCliente: event['codigoCliente'], //Usuario final que genera el transaccional
    fechaAlta: event['fechaAlta'], //Generada por Appian
    nombreTienda: event['nombreTienda'], //
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

    callback(null, {"message": "Cliente creado"});
}