let SL_AWS = require('slappforge-sdk-aws');
let AWS = require('aws-sdk');
const s3 = new AWS.S3();
var json2xls = require('json2xls');
const csv = require('csvtojson');
const uuidv4 = require('uuid/v4');
var mysql = require('mysql');

exports.handler = function (event, context, callback) {
    
    let cliente = {
        //Back
        idOficinaMovil: event.cliente['idCliente'], //Identificador aleatorio para OM (16)
        EVENTOGUID: "f07ea7f6-8bdd-4463-8cb4-c97cb40d6657", // OMTEMP15
        VKORG: "0142", //Dato fijo de organización de ventas 0142
        KDGRP: "", //**Generar con el catalogo de codigo postal (indentificador)
        BZIRK: "", //**Generar con el catalogo de codigo postal (Distrbuidora)
        KUNNR: "CD00000000", //Dato fijo para clientes nuevos (Número de cliente definitivo)
        ID_Solicitud: event.cliente['codigoCliente'], //Generar aleatorio (22),
        ID_Motivo_Solicitud: "ZB18", //Dato fijo para altas de cliente
        ZTEXT: "", //Se solicita en la mascara de clientes
        ZFECHA: "", //Extraer con la información de fechaAlta (Se coloca por .NET)
        ZHORA: "", //Extraer con la información de fechaAlta (Se coloca por .NET)
        fechaSolicitud: event.cliente['fechaAlta'], //Extraer fecha de lambda
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
        ZESTPROV: event.cliente['estado'], //**buscar en catálogo (clave o id del estado)
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
        ZENREJADO: event.cliente['enrejado'], //Capturado en Appian
        VPTYP: "ZPV", //**Catalogo de rutas (plan de visita de ruta de preventa)
        ROUTE: event.cliente['rutaDePreventa'], //Capturado en Appian
        RUTA_REPARTO: event.cliente['rutaDeReparto'],
        //Visita
        diasVisita: event.cliente['diasVisita'],
        SEQULUNES: event.cliente['lunes'],
        SEQUMARTES: event.cliente['martes'],
        SEQUMIERCOLES: event.cliente['miercoles'],
        SEQUJUEVES: event.cliente['jueves'],
        SEQUVIERNES: event.cliente['viernes'],
        SEQUSABADO: event.cliente['sabado'],
        IDMETODO: event.cliente['diaEntrega'], //se genera con catalogo de metodo desde Appian
        ZREQREM: event.cliente['remision'], //Bit para remisión
        ZREQFAC: event.cliente['factura'], // si trae datos de RFC se considera como True
        ZPAPERLESS: event.cliente['noImpresion'],
        ZFISICAMORAL: event.cliente['RFCregimenFiscal'], //M2, M3 y M4 para persona física
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
    let resultado;
    let cat;
    // pedidos.forEach(function (element) {
    //     console.log(element);
    // });

///////////////////////////CUESTIONARIOS/////////////////////////
switch(cuestionarios.ISSCOMcuestionario){
    case '1': //CUESTIONARIO No. 1 - Home Market - COMPRA DE ABARROTES Y PRODUCTOS BÁSICOS.
        if(cuestionarios.ISSCOMp1 == "A"){
            cliente.ISSCOM = 2305; //HOGAR CON VENTA
        }else{
            switch(cuestionarios.ISSCOMp2){
                case 'A':
                    cliente.ISSCOM = 2104; //MISCELANEA
                break;
                case 'B':
                    cliente.ISSCOM = 2101; //ABARROTE
                break;
                case 'C':
                    cliente.ISSCOM = 2304; //FRUTAS Y VERDURAS
                break;
                case 'D':
                    cliente.ISSCOM = 2301; //CARNICERÍA/POLLERÍA/PESCADERÍA
                break;
                case 'E':
                    cliente.ISSCOM = 2202; //VINATERÍA
                break;
                case 'F':
                    cliente.ISSCOM = 2306; //PANADERÍA
                break;
                case 'G':
                    cliente.ISSCOM = 2309; //TIENDA ESPECIALIZADA (NATURISTA, VEGET.)
                break;
                case 'H':
                    cliente.ISSCOM = 2310; //TORTILLERÍA
                break;
                case 'I':
                    cliente.ISSCOM = 2201; //EXPENDIO DE CERVEZA
                break;
            }
        }
    break;
    case '2': //CUESTIONARIO No. 2  Moderno / Home Market - COMPRA DE ABARROTES EN AUTOSERVICIOS Y CUENTAS CLAVE
        if(cuestionarios.ISSCOMp1 == "A"){
            switch(cuestionarios.ISSCOMp2){
                case 'A':
                    cliente.ISSCOM = 1103; //AUTOSERVICIO GRANDE
                break;
                case 'B':
                    cliente.ISSCOM = 1104; //BODEGA AUTOSERVICIO
                break;
                case 'C':
                    cliente.ISSCOM = 1105; //CLUB DE MEMBRESIA
                break;
                case 'D':
                    cliente.ISSCOM = 1202; //TDC CADENA
                break;
                case 'E':
                    cliente.ISSCOM = 1101; //AUTOSERVICIO CHICO
                break;
                case 'F':
                    cliente.ISSCOM = 1106; //HIPERMERCADO
                break;
                case 'G':
                    cliente.ISSCOM = 1102; //AUTOSERVICIO GOBIERNO
                break;
                case 'H':
                    cliente.ISSCOM = 2102; //MINI SUPER CADENA
                break;
            }
        }else{
            if(cuestionarios.ISSCOMp3 == "A"){
                if(cuestionarios.ISSCOMp4 == "A"){
                    if(cuestionarios.ISSCOMp5 == "A"){
                        cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                    }else{
                        cliente.ISSCOM = 2105; //TDC INDEPENDIENTE
                    }
                }else{
                    if(cuestionarios.ISSCOMp5 == "A"){
                        cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                    }else{
                        cliente.ISSCOM = 2105; //TDC INDEPENDIENTE
                    }
                }
            }else{
                if(cuestionarios.ISSCOMp4 == "A"){
                    if(cuestionarios.ISSCOMp5 == "A"){
                        cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                    }else{
                        cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                    }
                }else{
                    if(cuestionarios.ISSCOMp5 == "A"){
                        cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                    }else{
                        cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                    }
                }
            }
        }
    break;
    case '3': //CUESTIONARIO No. 3 - CANALES DE ENTRETENIMIENTO Y RECREACIÓN
        switch(cuestionarios.ISSCOMp1){
                case 'A':
                    cliente.ISSCOM = 3801; //BILLAR
                break;
                case 'B':
                    cliente.ISSCOM = 3803; //CINE/AUTOCINEMA
                break;
                case 'C':
                    cliente.ISSCOM = 3605; //DISCOTECA
                break;
                case 'D':
                    cliente.ISSCOM = 3701; //GIMNASIO
                break;
                case 'E':
                    cliente.ISSCOM = 3804; //MUSEO
                break;
                case 'F':
                    cliente.ISSCOM = 4003; //EXPOSICIONES
                break;
                case 'G':
                    cliente.ISSCOM = 3806; //TEATRO
                break;
                case 'H':
                    cliente.ISSCOM = 3809; //MÁQUINAS DE VIDEOJUEGOS
                break;
                case 'I':
                    cliente.ISSCOM = 3808; //CASINO
                break;
                case 'J':
                    cliente.ISSCOM = 3703; //ESTADIO
                break;
                case 'K':
                    cliente.ISSCOM = 3805; //PARQUE DE DIVERSIONES
                break;
                case 'L':
                    cliente.ISSCOM = 3704; //LOCALIDADES DEPORTIVAS
                break;
                case 'M':
                    cliente.ISSCOM = ""; //OTROS
                break;
            }
    break;
}


//////////////////////////////////////////////////////////////////

//////////////////////////SQL CONNECTION//////////////////////////

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

    console.log('Conexión a la base de datos');

    var catalogoCP = 'SELECT * FROM catalogoCP WHERE ID_CODIGOP=' + cliente.ZCPOSTAL
    connection.query(catalogoCP, function (err, result) {
    if (err) throw err;
    resultado = result[0];
    cliente.KDGRP = resultado.KDGRP
    cliente.BZIRK = resultado.BZIRK
    // cliente.ZESTPROV = resultado.ID_ESTADO
    console.log("KDGRP", resultado.KDGRP);
    console.log("BZIRK", resultado.BZIRK);
    console.log("ZESTPROV", resultado.ID_ESTADO);
  

    
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
        callback(null, { "mensaje": "Alta correcta" });
    });
  });

    // callback(null, cliente);
}