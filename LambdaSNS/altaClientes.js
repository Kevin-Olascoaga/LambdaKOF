let SL_AWS = require('slappforge-sdk-aws');
let connectionManager = require('./ConnectionManager');
const rds = new SL_AWS.RDS(connectionManager);
let AWS = require('aws-sdk');
const s3 = new AWS.S3();
var json2xls = require('json2xls');
const csv = require('csvtojson');
const uuidv4 = require('uuid/v4');
var mysql = require('mysql');

exports.handler = function (event, context, callback) {
    console.log("evento", event.cliente)
    let cliente = {
        //Back
        idOficinaMovil: event.cliente['idCliente'], //Identificador aleatorio para OM (16)
        EVENTOGUID: uuidv4(), // OMTEMP15
        VKORG: "0142", //Dato fijo de organización de ventas 0142
        KDGRP: "", //**Generar con el catalogo de codigo postal (indentificador)
        BZIRK: "", //**Generar con el catalogo de codigo postal (Distrbuidora)
        KUNNR: "CD00000000", //Dato fijo para clientes nuevos (Número de cliente definitivo)
        ID_Solicitud: "", //Generar aleatorio (22),
        ID_Motivo_Solicitud: "ZB18", //Dato fijo para altas de cliente
        Route: "", //**Generar con el catalogo de rutas (Ruta de preventa)
        ZTEXT: "", //Se solicita en la mascara de clientes
        ZFECHA: "", //Extraer con la información de fechaAlta (Se coloca por .NET)
        ZHORA: "", //Extraer con la información de fechaAlta (Se coloca por .NET)
        fechaSolicitud: "", //Extraer fecha de lambda
        //Front Appian
        //idCliente: event['idCliente'], //Generado incrementalmente desde Appian, temporal hasta que se tenga el definitivo de SAP
        //codigoCliente: event['codigoCliente'], //Usuario final que genera el transaccional
        //fechaAlta: event['fechaAlta'], //Generada por Appian
        ZNAME1: event.cliente['nombreTienda'], //Capturada en Appian (Nombre de la tienda)
        NAME_FIRST: event.cliente['nombreContacto'], //Capturado en Appian (Nombre del contacto)
        NAME_LAST: event.cliente['apellidoContacto'], //Capturado en Appian (Apellido del contacto)
        ZTELFIJO: event.cliente['telefono'], //Capturado en Appian (Telefono fijo)
        ZCELULAR: event.cliente['celular'], //Capturado en Appian (telefono celular)
        ZTELFIJO_CEL: event.cliente['celular'], //Capturado en Appian (telefono celular)
        ZCORREO: event.cliente['correo'], //Capturado en Appian (cooreo electrónico)
        ZZCRM_LAT: event.cliente['latitud'], //Capturado en Appian con gps (latitud)
        ZZCRM_LONG: event.cliente['longitud'], //Capturado en Appian con gps (longitud)
        ZCPOSTAL: event.cliente['codigoPostal'], //Capturado en Appian (codigo postal)
        estado: event.cliente['estado'], //Capturado en Appian
        ZESTPROV: "", //**buscar en catálogo (clave o id del estado)
        ZMUNIDELEG: event.cliente['municipio'], //Capturado en Appian (municipio)
        ZCOLONIA: event.cliente['colonia'], //Capturado en Appian (colonia)
        ZCALLE: event.cliente['calle'], //Capturado en Appian (calle)
        ZCALLECON: "", //dato dummy (callecon)
        ZENTRECALLE1: "", //dato dummy (entrecalle)
        ZENTRECALLE2: "",
        ZNUMEXT: event.cliente['numeroExt'], //Capturado en Appian (número exterior)
        ZLOTE: "", //dato dummy
        ZMANZANA: "", //dato dummy
        ZNUMINT: event.cliente['numeroInt'], //Capturado en Appian (número interior)
        ZENREJADO: "", //Capturado en Appian
        VPTYP: "ZPV", //**Catalogo de rutas (plan de visita de ruta de preventa)
        ROUTE: event.cliente['rutaDeReparto'], //Capturado en Appian
        RUTA_REPARTO: "",
        //Visita
        diasVisita: event.cliente['diasVisita'],
        SEQULUNES: "",
        SEQUMARTES: "",
        SEQUMIERCOLES: "",
        SEQUJUEVES: "",
        SEQUVIERNES: "",
        SEQUSABADO: "",
        IDMETODO: event.cliente['rutaEntrega'], //se genera con catalogo de metodo desde Appian
        ZREQREM: event.cliente['remision'], //Bit para remisión
        ZREQFAC: "", // si trae datos de RFC se considera como True
        ZPAPERLESS: "",
        ZFISICAMORAL: event.cliente['regimenFiscal'], //M2, M3 y M4 para persona física
        ZNAME4: event.cliente['razonSocial'], //Ingresada en caso de que sea persona moral
        ZRFCNOMBRE: event.cliente['RFCnombre'],
        ZRFCAPELLIDOS: event.cliente['RFCapellidos'],
        ZRFC: event.cliente['RFC'],
        ZRFCCODIGOPOSTAL: event.cliente['RFCcodigoPostal'],
        ZRFCESTADO: event.cliente['RFCestado'],
        ZRFCMUNDELEG: event.cliente['RFCmunicipio'],
        ZRFCCOLONIA: event.cliente['RFCcolonia'],
        ZRFCCALLE: event.cliente['RFCcalle'],
        ZRFCCALLE_CON: "",
        ZRFCNUM_EXT: event.cliente['RFCnumeroExt'],
        ZRFCNUM_INT: event.cliente['RFCnumeroInt'],
        ZCFDI: event.cliente['CFDI'],
        //descripcion: event['descripcion'],
        ISSCOM: "",
        GEC: "",
        LOCALIDAD: "",
        OCASIONDECONSUMO: ""
    };

    let cuestionarios = {
        ISSCOMcuestionario: event.cliente.ISSCOM['cuestionario'],
        ISSCOMp1: event.cliente.ISSCOM['p1'],
        ISSCOMp2: event.cliente.ISSCOM['p2'],
        ISSCOMp3: event.cliente.ISSCOM['p3'],
        ISSCOMp4: event.cliente.ISSCOM['p4'],
        ISSCOMp5: event.cliente.ISSCOM['p5'],
        GECp1: event.cliente.GEC['p1'],
        GECp2: event.cliente.GEC['p2'],
        GECp3: event.cliente.GEC['p3'],
    };

    let pedidos = event['productos'];

    // pedidos.forEach(function (element) {
    //     console.log(element);
    // });

    //////////////////////SQL CONNECTION//////////////////////////

    var connection = mysql.createConnection({
        host     : "kof.cmk4tzokwqsd.us-west-2.rds.amazonaws.com",
        user     : "kofadmin",
        password : "CyEoDDTWfCtPY7h3NKzB",
        port     : 3306,
        database : "innodb",
    });

    connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed : ' + err.stack);
        return;
    }

    console.log('Connected to database.');
    
    // var sql = 'INSERT INTO prueba(EVENTOGUID) VALUES ?';
    var sql = 'INSERT INTO prueba(idOficinaMovil,EVENTOGUID,VKORG,KDGRP,BZIRK,KUNNR,ID_Solicitud,ID_Motivo_Solicitud,ZTEXT,ZFECHA,ZHORA,fechaSolicitud,ZNAME1,NAME_FIRST,NAME_LAST,ZTELFIJO,ZCELULAR,ZTELFIJO_CEL,ZCORREO,ZZCRM_LAT,ZZCRM_LONG,ZCPOSTAL,estado,ZESTPROV,ZMUNIDELEG,ZCOLONIA,ZCALLE,ZCALLECON,ZENTRECALLE1,ZENTRECALLE2,ZNUMEXT,ZLOTE,ZMANZANA,ZNUMINT,ZENREJADO,VPTYP,ROUTE,RUTA_REPARTO,diasVisita,SEQULUNES,SEQUMARTES,SEQUMIERCOLES,SEQUJUEVES,SEQUVIERNES,SEQUSABADO,IDMETODO,ZREQREM,ZREQFAC,ZPAPERLESS,ZFISICAMORAL,ZNAME4,ZRFCNOMBRE,ZRFCAPELLIDOS,ZRFC,ZRFCCODIGOPOSTAL,ZRFCESTADO,ZRFCMUNDELEG,ZRFCCOLONIA,ZRFCCALLE,ZRFCCALLE_CON,ZRFCNUM_EXT,ZRFCNUM_INT,ZCFDI,ISSCOM,GEC,LOCALIDAD,OCASIONDECONSUMO) VALUES ?';
    var values = [[
            cliente.idOficinaMovil,
            cliente.EVENTOGUID,
            cliente.VKORG,
            cliente.KDGRP,
            cliente.BZIRK,
            cliente.KUNNR,
            cliente.ID_Solicitud,
            cliente.ID_Motivo_Solicitud,
            cliente.ZTEXT,
            cliente.ZFECHA,
            cliente.ZHORA,
            cliente.fechaSolicitud,
            cliente.ZNAME1,
            cliente.NAME_FIRST,
            cliente.NAME_LAST,
            cliente.ZTELFIJO,
            cliente.ZCELULAR,
            cliente.ZTELFIJO_CEL,
            cliente.ZCORREO,
            cliente.ZZCRM_LAT,
            cliente.ZZCRM_LONG,
            cliente.ZCPOSTAL,
            cliente.estado,
            cliente.ZESTPROV,
            cliente.ZMUNIDELEG,
            cliente.ZCOLONIA,
            cliente.ZCALLE,
            cliente.ZCALLECON,
            cliente.ZENTRECALLE1,
            cliente.ZENTRECALLE2,
            cliente.ZNUMEXT,
            cliente.ZLOTE,
            cliente.ZMANZANA,
            cliente.ZNUMINT,
            cliente.ZENREJADO,
            cliente.VPTYP,
            cliente.ROUTE,
            cliente.RUTA_REPARTO,
            cliente.diasVisita,
            cliente.SEQULUNES,
            cliente.SEQUMARTES,
            cliente.SEQUMIERCOLES,
            cliente.SEQUJUEVES,
            cliente.SEQUVIERNES,
            cliente.SEQUSABADO,
            cliente.IDMETODO,
            cliente.ZREQREM,
            cliente.ZREQFAC,
            cliente.ZPAPERLESS,
            cliente.ZFISICAMORAL,
            cliente.ZNAME4,
            cliente.ZRFCNOMBRE,
            cliente.ZRFCAPELLIDOS,
            cliente.ZRFC,
            cliente.ZRFCCODIGOPOSTAL,
            cliente.ZRFCESTADO,
            cliente.ZRFCMUNDELEG,
            cliente.ZRFCCOLONIA,
            cliente.ZRFCCALLE,
            cliente.ZRFCCALLE_CON,
            cliente.ZRFCNUM_EXT,
            cliente.ZRFCNUM_INT,
            cliente.ZCFDI,
            cliente.ISSCOM,
            cliente.GEC,
            cliente.LOCALIDAD,
            cliente.OCASIONDECONSUMO
            ]];

        connection.query(sql, [values], function (err, result) {
    
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    connection.end();
  });
  });


    // You can pass the existing connection to this function.
    // A new connection will be created if it's not present as the third param 
    // You must always end/destroy the DB connection after it's used
    // connection.query({
    //     // instanceIdentifier: 'kof',
    //     query: 'INSERT INTO clientes(idOficinaMovil,EVENTOGUID,VKORG,KDGRP,KDGRP,BZIRK,KUNNR,ID_Solicitud,ID_Motivo_Solicitud,ZTEXT,ZFECHA,ZHORA,fechaSolicitud,ZNAME1,NAME_FIRST,NAME_LAST,ZTELFIJO,ZCELULAR,ZTELFIJO_CEL,ZCORREO,ZZCRM_LAT,ZZCRM_LONG,ZCPOSTAL,estado,ZESTPROV,ZMUNIDELEG,ZCOLONIA,ZCALLE,ZCALLECON,ZENTRECALLE1,ZENTRECALLE2,ZNUMEXT,ZLOTE,ZMANZANA,ZNUMINT,ZENREJADO,VPTYP,ROUTE,RUTA_REPARTO,diasVisita,SEQULUNES,SEQUMARTES,SEQUMIERCOLES,SEQUJUEVES,SEQUVIERNES,SEQUSABADO,IDMETODO,ZREQREM,ZREQFAC,ZPAPERLESS,ZFISICAMORAL,ZNAME4,ZRFCNOMBRE,ZRFCAPELLIDOS,ZRFC,ZRFCCODIGOPOSTAL,ZRFCESTADO,ZRFCMUNDELEG,ZRFCCOLONIA,ZRFCCALLE,ZRFCCALLE_CON,ZRFCNUM_EXT,ZRFCNUM_INT,ZCFDI,ISSCOM,GEC,LOCALIDAD,OCASIONDECONSUMO) VALUES ?',
    //     values: [
    //         cliente.idOficinaMovil,
    //         cliente.EVENTOGUID,
    //         cliente.VKORG,
    //         cliente.KDGRP,
    //         cliente.BZIRK,
    //         cliente.KUNNR,
    //         cliente.ID_Solicitud,
    //         cliente.ID_Motivo_Solicitud,
    //         cliente.ZTEXT,
    //         cliente.ZFECHA,
    //         cliente.ZHORA,
    //         cliente.fechaSolicitud,
    //         cliente.ZNAME1,
    //         cliente.NAME_FIRST,
    //         cliente.NAME_LAST,
    //         cliente.ZTELFIJO,
    //         cliente.ZCELULAR,
    //         cliente.ZTELFIJO_CEL,
    //         cliente.ZCORREO,
    //         cliente.ZZCRM_LAT,
    //         cliente.ZZCRM_LONG,
    //         cliente.ZCPOSTAL,
    //         cliente.estado,
    //         cliente.ZESTPROV,
    //         cliente.ZMUNIDELEG,
    //         cliente.ZCOLONIA,
    //         cliente.ZCALLE,
    //         cliente.ZCALLECON,
    //         cliente.ZENTRECALLE1,
    //         cliente.ZENTRECALLE2,
    //         cliente.ZNUMEXT,
    //         cliente.ZLOTE,
    //         cliente.ZMANZANA,
    //         cliente.ZNUMINT,
    //         cliente.ZENREJADO,
    //         cliente.VPTYP,
    //         cliente.ROUTE,
    //         cliente.RUTA_REPARTO,
    //         cliente.diasVisita,
    //         cliente.SEQULUNES,
    //         cliente.SEQUMARTES,
    //         cliente.SEQUMIERCOLES,
    //         cliente.SEQUJUEVES,
    //         cliente.SEQUVIERNES,
    //         cliente.SEQUSABADO,
    //         cliente.IDMETODO,
    //         cliente.ZREQREM,
    //         cliente.ZREQFAC,
    //         cliente.ZPAPERLESS,
    //         cliente.ZFISICAMORAL,
    //         cliente.ZNAME4,
    //         cliente.ZRFCNOMBRE,
    //         cliente.ZRFCAPELLIDOS,
    //         cliente.ZRFC,
    //         cliente.ZRFCCODIGOPOSTAL,
    //         cliente.ZRFCESTADO,
    //         cliente.ZRFCMUNDELEG,
    //         cliente.ZRFCCOLONIA,
    //         cliente.ZRFCCALLE,
    //         cliente.ZRFCCALLE_CON,
    //         cliente.ZRFCNUM_EXT,
    //         cliente.ZRFCNUM_INT,
    //         cliente.ZCFDI,
    //         cliente.ISSCOM,
    //         cliente.GEC,
    //         cliente.LOCALIDAD,
    //         cliente.OCASIONDECONSUMO
    //         ]
    // }, function (error, results, connection) {
    //     if (error) {
    //         console.log("Error occurred");
    //         throw error;
    //     } else {
    //         console.log("Success")
    //         console.log(results);
    //     }

    //     connection.end();
    // });


    // You must always end/destroy the DB connection after it's used
    // rds.beginTransaction({
    //     instanceIdentifier: 'kof'
    // }, function (error, connection) {
    //     if (error) {
    //         throw error;
    //     }
    // });


    // rds.query({
    //     instanceIdentifier: 'innodb',
    //     query: 'INSERT INTO clientes(EVENTOGUID)',
    //     inserts: [
    //         cliente.EVENTOGUID,
    //     ]
    // }, function (error, results, connection) {
    //     if (error) {
    //         console.log("Error occurred");
    //         throw error;
    //     } else {
    //         console.log("Success")
    //         console.log(results);
    //     }

    //     connection.end();
    // });


    //////////////////////////////////////////////////////////////


    // let xls = json2xls(cliente);
    // // let csv = json2csv(cliente);
    // var bufferdata = new Buffer(xls, 'binary')
    // console.log("bufferdata", bufferdata);
    // s3.getObject({
    //     'Bucket': "clienteskof",
    //     'Key': "2019-09-28_clientes.csv"
    // }).promise()
    //     .then(data => {
    //         // var buf = Buffer.from(JSON.stringify(data.Body));
    //         // var temp = JSON.parse(buf.toString());
    //         let stream = data.Body
    //         // let archivo = csv().fromStream(stream);
    //         console.log("Archivo en buffer:", stream.toJSON());           // successful response
    //         // console.log("Archivo en buffer:", data.Body);
    //         // console.log("Archivo en json:", temp);
    //         /*
    //         data = {
    //             AcceptRanges: "bytes", 
    //             ContentLength: 3191, 
    //             ContentType: "image/jpeg", 
    //             ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
    //             LastModified: "<Date Representation>", 
    //             Metadata: {}, 
    //             TagCount: 2, 
    //             VersionId: "null"
    //         }
    //         */
    //     })
    //     .catch(err => {
    //         console.log(err, err.stack); // an error occurred
    //     });

    // // let stream = s3.getObject({
    // //     'Bucket': "clienteskof",
    // //     'Key': "2019-09-28_clientes.csv"
    // // }).createReadStream();
    // // const json = csv().fromStream(stream);
    // // console.log("buffer json:", json)


    // s3.putObject({
    //     "Body": bufferdata,
    //     "Bucket": "clienteskof",
    //     "Key": "clientes.xlsx"
    // })
    //     .promise()
    //     .then(data => {
    //         console.log("Escritura correcta:", data);           // successful response
    //         /*
    //         data = {
    //             ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
    //             VersionId: "pSKidl4pHBiNwukdbcPXAIs.sshFFOc0"
    //         }
    //         */
    //     })
    //     .catch(err => {
    //         console.log(err, err.stack); // an error occurred
    //     });


    // callback(null, { "message": "Alta correcta" });
    callback(null, cliente);
}