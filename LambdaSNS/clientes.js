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
    nombreTienda: event['nombreTienda'], //Capturada en Appian
    nombreContacto: event['nombreContacto'], //Capturado en Appian
    apellidoContacto: event['apellidoContacto'], //Capturado en Appian
    felfijo: event['telefono'], //Capturado en Appian
    celular: event['celular'], //Capturado en Appian
    telfijo_cel: event['celular'],
    correo: event['correo'], //Capturado en Appian
    latitud: event['latitud'], //Capturado en Appian con gps
    longitud: event['longitud'], //Capturado en Appian con gps
    codigoPostal: event['codigoPostal'], //Capturado en Appian
    estado: event['estado'], //Capturado en Appian
    claveEstado: "", //**buscar en catálogo
    municipio: event['municipio'], //Capturado en Appian
    colonia: event['colonia'], //Capturado en Appian
    calle: event['calle'], //Capturado en Appian
    callecon: ".", //dato dummy
    entrecalle1: ".", //dato dummy
    numeroExt: event['numeroExt'], //Capturado en Appian
    lote: ".", //dato dummy
    manzana: ".", //dato dummy
    numeroInt: event['numeroInt'], //Capturado en Appian
    enrejado: "", //Capturado en Appian
    planVisitaRutaPreventa: "", //**Catalogo de rutas
    rutaDeReparto: event['rutaDeReparto'], //Capturado en Appian
        //Visita
    diasVisita = event['diasVisita'],
    lunes = "",
    martes = "",
    miercoles = "",
    jueves = "",
    viernes = "",
    sabado = "",
    diaEntrega: event['rutaEntrega'], //se genera con catalogo de metodo desde Appian
    remision: event['remision'],
    factura: "", // si trae datos de RFC se considera como True
    noImpresion: "",
    regimenFiscal: event['regimenFiscal'],
    razonSocial: event['razonSocial'], //Ingresada en caso de que sea persona moral
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

    let pedidos = event['productos'];

    pedidos.forEach(function(element) {
        console.log(element);
    });

    callback(null, {"message": "Cliente creado"});
}