// let SL_AWS = require('slappforge-sdk-aws');
// let AWS = require('aws-sdk');
// const s3 = new AWS.S3();
// var json2xls = require('json2xls');
// const csv = require('csvtojson');
// const uuidv4 = require('uuid/v4');
var mysql = require('mysql');
var moment = require("moment-timezone");

exports.handler = function (event, context, callback) {


    //////////////////////////SQL CONNECTION//////////////////////////

    var connection = mysql.createConnection({
        host: "kof.cmk4tzokwqsd.us-west-2.rds.amazonaws.com",
        user: "kofadmin",
        password: "CyEoDDTWfCtPY7h3NKzB",
        port: 3306,
        database: "innodb",
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Database connection failed : ' + err.stack);
            return;
        }

        ////////////////////////////PEDIDOS///////////////////////////////
        let pedidos;
        let cliente;
        let cuestionarios;
        let productos = event['productos']; //Array de productos
        var date = new Date();

        if (productos) {
            cliente = {
                //Back
                idOficinaMovil: event.cliente['idCliente'], //Identificador aleatorio para OM (16)
                EVENTOGUID: "f07ea7f6-8bdd-4463-8cb4-c97cb40d6657", // OMTEMP15
                VKORG: "0142", //Dato fijo de organización de ventas 0142
                KDGRP: "", //**Generar con el catalogo de codigo postal (indentificador)
                BZIRK: "", //**Generar con el catalogo de codigo postal (Distrbuidora)
                KUNNR: "CD00000000", //Dato fijo para clientes nuevos (Número de cliente definitivo)
                ID_Solicitud: event.cliente['codigoCliente'], //Generar aleatorio (22),
                ID_Motivo_Solicitud: "ZB18", //Dato fijo para altas de cliente
                ZTEXT: null, //Se solicita en la mascara de clientes
                ZFECHA: null, //Extraer con la información de fechaAlta (Se coloca por .NET)
                ZHORA: null, //Extraer con la información de fechaAlta (Se coloca por .NET)
                fechaSolicitud: moment(date.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:SS"), //event.cliente['fechaAlta'], //Extraer fecha de lambda
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
                ROUTE: event.cliente['RutaDePreventa'], //Capturado en Appian
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
                OCASIONDECONSUMO: "",
                BXTXT: ""
            };
            if(cliente.SEQULUNES == 1){cliente.SEQUMARTES = 2};
            if(cliente.SEQUMARTES == 1){cliente.SEQUMIERCOLES = 2};
            if(cliente.SEQUMIERCOLES == 1){cliente.SEQUJUEVES = 2};
            if(cliente.SEQUJUEVES == 1){cliente.SEQUVIERNES = 2};
            if(cliente.SEQUVIERNES == 1){cliente.SEQUSABADO = 2};
            if(cliente.SEQUSABADO == 1){cliente.SEQULUNES = 2};
            cuestionarios = {
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
            pedidos = [];
            productos.forEach(element => {
                let pedido = [
                    "ZY28", //pedido
                    event['fechaPedidoBebidas'], //Fecha de entrega = fecha de hoy + 1
                    cliente.KUNNR, //cliente
                    cliente.KUNNR, //responsable de pago
                    cliente.KUNNR, //destinatario de mercancia
                    event['fechaPedidoBebidas'], //fecha de pedido
                    element.idProducto.formatoProducto, //material
                    element.cantidad, //cantidad
                    "CJ", // UM Unidad de medida
                    "MAN", //tipo de operación
                    "ZPV", // VPT
                    cliente.idOficinaMovil
                ];
                pedidos.push(pedido);
            });
        } else {
            cliente = {
                //Back
                idOficinaMovil: event['idCliente'], //Identificador aleatorio para OM (16)
                EVENTOGUID: "f07ea7f6-8bdd-4463-8cb4-c97cb40d6657", // OMTEMP15
                VKORG: "0142", //Dato fijo de organización de ventas 0142
                KDGRP: "", //**Generar con el catalogo de codigo postal (indentificador)
                BZIRK: "", //**Generar con el catalogo de codigo postal (Distrbuidora)
                KUNNR: "CD00000000", //Dato fijo para clientes nuevos (Número de cliente definitivo)
                ID_Solicitud: event['codigoCliente'], //Generar aleatorio (22),
                ID_Motivo_Solicitud: "ZB18", //Dato fijo para altas de cliente
                ZTEXT: null, //Se solicita en la mascara de clientes
                ZFECHA: null, //Extraer con la información de fechaAlta (Se coloca por .NET)
                ZHORA: null, //Extraer con la información de fechaAlta (Se coloca por .NET)
                fechaSolicitud: moment(date.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:SS"), //event['fechaAlta'], //Extraer fecha de lambda
                //Front Appian
                //idCliente: event['idCliente'], //Generado incrementalmente desde Appian, temporal hasta que se tenga el definitivo de SAP
                //codigoCliente: event['codigoCliente'], //Usuario final que genera el transaccional
                //fechaAlta: event['fechaAlta'], //Generada por Appian
                ZNAME1: event['nombreTienda'], //Capturada en Appian (Nombre de la tienda)
                NAME_FIRST: event['nombreContacto'], //Capturado en Appian (Nombre del contacto)
                NAME_LAST: event['apellidoContacto'], //Capturado en Appian (Apellido del contacto)
                ZTELFIJO: event['telefono'], //Capturado en Appian (Telefono fijo)
                ZCELULAR: event['celular'], //Capturado en Appian (telefono celular)
                ZTELFIJO_CEL: event['celular'], //Capturado en Appian (telefono celular)
                ZCORREO: event['correo'], //Capturado en Appian (cooreo electrónico)
                ZZCRM_LAT: event['latitud'], //Capturado en Appian con gps (latitud)
                ZZCRM_LONG: event['longitud'], //Capturado en Appian con gps (longitud)
                ZCPOSTAL: event['codigoPostal'], //Capturado en Appian (codigo postal)
                estado: event['estado'], //Capturado en Appian
                ZESTPROV: event['estado'], //**buscar en catálogo (clave o id del estado)
                ZMUNIDELEG: event['municipio'], //Capturado en Appian (municipio)
                ZCOLONIA: event['colonia'], //Capturado en Appian (colonia)
                ZCALLE: event['calle'], //Capturado en Appian (calle)
                ZCALLECON: "", //dato dummy (callecon)
                ZENTRECALLE1: "", //dato dummy (entrecalle)
                ZENTRECALLE2: "",
                ZNUMEXT: event['numeroExt'], //Capturado en Appian (número exterior)
                ZLOTE: "", //dato dummy
                ZMANZANA: "", //dato dummy
                ZNUMINT: event['numeroInt'], //Capturado en Appian (número interior)
                ZENREJADO: event['enrejado'], //Capturado en Appian
                VPTYP: "ZPV", //**Catalogo de rutas (plan de visita de ruta de preventa)
                ROUTE: event['RutaDePreventa'], //Capturado en Appian
                RUTA_REPARTO: event['rutaDeReparto'],
                //Visita
                diasVisita: event['diasVisita'],
                SEQULUNES: event['lunes'],
                SEQUMARTES: event['martes'],
                SEQUMIERCOLES: event['miercoles'],
                SEQUJUEVES: event['jueves'],
                SEQUVIERNES: event['viernes'],
                SEQUSABADO: event['sabado'],
                IDMETODO: event['diaEntrega'], //se genera con catalogo de metodo desde Appian
                ZREQREM: event['remision'], //Bit para remisión
                ZREQFAC: event['factura'], // si trae datos de RFC se considera como True
                ZPAPERLESS: event['noImpresion'],
                ZFISICAMORAL: event['RFCregimenFiscal'], //M2, M3 y M4 para persona física
                ZNAME4: event['razonSocial'], //Ingresada en caso de que sea persona moral
                ZRFCNOMBRE: event['RFCnombre'],
                ZRFCAPELLIDOS: event['RFCapellidos'],
                ZRFC: event['RFC'],
                ZRFCCODIGOPOSTAL: event['RFCcodigoPostal'],
                ZRFCESTADO: event['RFCestado'],
                ZRFCMUNDELEG: event['RFCmunicipio'],
                ZRFCCOLONIA: event['RFCcolonia'],
                ZRFCCALLE: event['RFCcalle'],
                ZRFCCALLE_CON: "",
                ZRFCNUM_EXT: event['RFCnumeroExt'],
                ZRFCNUM_INT: event['RFCnumeroInt'],
                ZCFDI: event['CFDI'],
                //descripcion: event['descripcion'],
                ISSCOM: "",
                GEC: "",
                LOCALIDAD: "",
                OCASIONDECONSUMO: "",
                BXTXT: ""
            };
            if(cliente.SEQULUNES == 1){cliente.SEQUMARTES = 2};
            if(cliente.SEQUMARTES == 1){cliente.SEQUMIERCOLES = 2};
            if(cliente.SEQUMIERCOLES == 1){cliente.SEQUJUEVES = 2};
            if(cliente.SEQUJUEVES == 1){cliente.SEQUVIERNES = 2};
            if(cliente.SEQUVIERNES == 1){cliente.SEQUSABADO = 2};
            if(cliente.SEQUSABADO == 1){cliente.SEQULUNES = 2};
            cuestionarios = {
                ISSCOMcuestionario: event.ISSCOM['cuestionario'],
                ISSCOMp1: event.ISSCOM['p1'],
                ISSCOMp2: event.ISSCOM['p2'],
                ISSCOMp3: event.ISSCOM['p3'],
                ISSCOMp4: event.ISSCOM['p4'],
                ISSCOMp5: event.ISSCOM['p5'],
                GECp1: event.GEC['p1'],
                GECp2: event.GEC['p2'],
                GECp3: event.GEC['p3'],
            };
        }

        //////////////////////////////////////////////////////////////////



        let resultado;
        let dato;
        // pedidos.forEach(function (element) {
        //     console.log(element);
        // });

        ///////////////////////////CUESTIONARIOS//////////////////////////
        switch (cuestionarios.ISSCOMcuestionario) {
            case '1': //CUESTIONARIO No. 1 - Home Market - COMPRA DE ABARROTES Y PRODUCTOS BÁSICOS.
                if (cuestionarios.ISSCOMp1 == "A") {
                    cliente.ISSCOM = 2305; //HOGAR CON VENTA
                } else {
                    switch (cuestionarios.ISSCOMp2) {
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
                if (cuestionarios.ISSCOMp1 == "A") {
                    switch (cuestionarios.ISSCOMp2) {
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
                } else {
                    if (cuestionarios.ISSCOMp3 == "A") {
                        if (cuestionarios.ISSCOMp4 == "A") {
                            if (cuestionarios.ISSCOMp5 == "A") {
                                cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                            } else {
                                cliente.ISSCOM = 2105; //TDC INDEPENDIENTE
                            }
                        } else {
                            if (cuestionarios.ISSCOMp5 == "A") {
                                cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                            } else {
                                cliente.ISSCOM = 2105; //TDC INDEPENDIENTE
                            }
                        }
                    } else {
                        if (cuestionarios.ISSCOMp4 == "A") {
                            if (cuestionarios.ISSCOMp5 == "A") {
                                cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                            } else {
                                cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                            }
                        } else {
                            if (cuestionarios.ISSCOMp5 == "A") {
                                cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                            } else {
                                cliente.ISSCOM = 2103; //MINI SUPER INDEPENDIENTE
                            }
                        }
                    }
                }
                break;
            case '3': //CUESTIONARIO No. 3 - CANALES DE ENTRETENIMIENTO Y RECREACIÓN
                switch (cuestionarios.ISSCOMp1) {
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
            case '4': //CUESTIONARIO No. 4 - ESTABLECIMIENTOS PARA COMER Y BEBER
                switch (cuestionarios.ISSCOMp1) {
                    case 'A':
                        switch (cuestionarios.ISSCOMp3) {
                            case 'A':
                                cliente.ISSCOM = 4601; //RSR HAMBURGUESAS
                                break;
                            case 'B':
                                cliente.ISSCOM = 4602; //RSR PIZZAS
                                break;
                            case 'C':
                                cliente.ISSCOM = 4603; //RSR POLLO
                                break;
                            case 'D':
                                cliente.ISSCOM = 2308; //ROSTICERÍA
                                break;
                            case 'E':
                                cliente.ISSCOM = 4604; //RSR TACOS
                                break;
                            case 'F':
                                cliente.ISSCOM = 3301; //NEVERÍA, FUENTE DE SODAS
                                break;
                            case 'G':
                                cliente.ISSCOM = 4607; //RSR TORTAS/ SANDWICHES
                                break;
                            case 'H':
                                cliente.ISSCOM = 4101; //FONDA/LONCHERÍA/MERENDERO
                                break;
                            case 'I':
                                cliente.ISSCOM = 4502; //RESTAURANTE
                                break;
                            case 'J':
                                cliente.ISSCOM = 2302; //DULCERÍA
                                break;
                            case 'K':
                                cliente.ISSCOM = 3301; //NEVERÍA, FUENTE DE SODAS
                                break;
                            case 'L':
                                cliente.ISSCOM = 3601; //BAR/TABERNA/CANTINA
                                break;
                            case 'M':
                                cliente.ISSCOM = 3604; //CENTRO NOCTURNO
                                break;
                            case 'N':
                                cliente.ISSCOM = 3603; //PULQUERÍA/MEZCALERÍA
                                break;
                            case 'O':
                                cliente.ISSCOM = 4606; //RSR MARISCOS
                                break;
                            case 'P':
                                cliente.ISSCOM = 4605; //RSR FRITANGAS/ ANTOJITOS
                                break;
                            case 'Q':
                                cliente.ISSCOM = 4501; //CAFETERÍA
                                break;
                        }
                        break;
                    case 'B':
                        cliente.ISSCOM = 3106; //COMEDOR INDUSTRIAL
                        break;
                    case 'C':
                        cliente.ISSCOM = 3105; //COMEDOR DE OFICINA
                        break;
                }
                break;
            case '5': //CUESTIONARIO No. 5 - ACTIVIDADES LABORALES
                switch (cuestionarios.ISSCOMp1) {
                    case 'A':
                        cliente.ISSCOM = 4701; //ASILO/ CASA HOGAR
                        break;
                    case 'B':
                        cliente.ISSCOM = 3101; //CARCEL/POLICÍA/BOMBEROS
                        break;
                    case 'C':
                        cliente.ISSCOM = 3109; //INSTALACIÓN MILITAR
                        break;
                    case 'D':
                        cliente.ISSCOM = 3102; //HOSPITAL DE GOBIERNO
                        break;
                    case 'E':
                        cliente.ISSCOM = 3103; //HOSPITAL PARTICULAR
                        break;
                    case 'F':
                        cliente.ISSCOM = 3104; //CLINICAS Y CONSULTORIOS MEDICOS
                        break;
                    case 'G':
                        cliente.ISSCOM = 3107; //INDUSTRIA/FÁBRICA
                        break;
                    case 'H':
                        cliente.ISSCOM = 3108; //INSTALACIÓN DE GOBIERNO
                        break;
                    case 'I':
                        cliente.ISSCOM = 3110; //OFICINA
                        break;
                    case 'J':
                        cliente.ISSCOM = 4708; //OFICINA POSTAL/CASETAS TELEFÓNICAS
                        break;
                    case 'K':
                        cliente.ISSCOM = 4712; //SERVICIOS PÚBLICOS
                        break;
                    case 'L':
                        cliente.ISSCOM = 4713; //SISTEMA DE TRANSPORTE PÚBLICO
                        break;
                    case 'M':
                        cliente.ISSCOM = 4710; //PARADEROS/SITIOS DE TAXI
                        break;
                }
                break;
            case '6': //CUESTIONARIO No. 6 - OTRAS COMPRAS DE PRODUCTOS Y SERVICIOS EN GENERAL
                switch (cuestionarios.ISSCOMp1) {
                    case 'A':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - ELECTRODOMESTICOS
                        break;
                    case 'B':
                        if (cuestionarios.ISSCOMp2 == "A") {
                            cliente.ISSCOM = 2303; //FARMACIA INDEPENDIENTE
                        } else {
                            cliente.ISSCOM = 1201; //FARMACIA CADENA    
                        }
                        break;
                    case 'C':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - JOYERIA
                        break;
                    case 'D':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - LOTERIA Y PRONOSTICOS
                        break;
                    case 'E':
                        cliente.ISSCOM = 4402; //PUESTO DE REVISTAS/PERIÓDICOS
                        break;
                    case 'F':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - MATERIAS PRIMAS
                        break;
                    case 'G':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - MEERCERÍ Y JUGUETES
                        break;
                    case 'H':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - MUEBLERÍA
                        break;
                    case 'I':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - TIENDA DE REGALOS
                        break;
                    case 'J':
                        cliente.ISSCOM = 2307; //PAPELERÍA                               
                        break;
                    case 'K':
                        cliente.ISSCOM = 3402; //TIENDA DEPARTAMENTAL
                        break;
                    case 'L':
                        cliente.ISSCOM = 3807; //VIDEO CLUB
                        break;
                    case 'M':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - ZAPATERÍA
                        break;
                    case 'N':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - FLORERIA
                        break;
                    case 'O':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - FERRETERIA/ TLAPALERIA/ PINTURAS
                        break;
                    case 'P':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - EQUIPO DE COMPUTO
                        break;
                    case 'Q':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - GAS
                        break;
                    case 'R':
                        cliente.ISSCOM = 3401; //VENTA PRODUCTOS EN GENERAL - OTROS PRODUCTOS
                        break;
                }
                switch (cuestionarios.ISSCOMp3) {
                    case 'A':
                        cliente.ISSCOM = 4702; //AUTOLAVADO
                        break;
                    case 'B':
                        cliente.ISSCOM = 4703; //BANCO/SERVICIOS FINANCIEROS
                        break;
                    case 'C':
                        cliente.ISSCOM = 4704; //BELLEZA/CUIDADO PERSONAL
                        break;
                    case 'D':
                        cliente.ISSCOM = 4706; //ESTACIONAMIENTO
                        break;
                    case 'E':
                        cliente.ISSCOM = 4709; //SERVICIOS AL DETALLE - BAÑOS PUBLICOS
                        break;
                    case 'F':
                        cliente.ISSCOM = 4709; //SERVICIOS AL DETALLE - ESTUDIOS FOTOGRAFICOS
                        break;
                    case 'G':
                        cliente.ISSCOM = 4707; //GASOLINERA
                        break;
                    case 'H':
                        cliente.ISSCOM = 4709; //SERVICIOS AL DETALLE - AGENCIA DE VIAJES
                        break;
                    case 'I':
                        cliente.ISSCOM = 4709; //SERVICIOS AL DETALLE - TINTORERIA/ LAVANDERIA
                        break;
                    case 'J':
                        cliente.ISSCOM = 4201; //HOTEL/MOTEL
                        break;
                    case 'K':
                        cliente.ISSCOM = 4709; //SERVICIOS AL DETALLE - AA/ NEUROTICOS ANÓNIMOS
                        break;
                    case 'L':
                        cliente.ISSCOM = 4704; //BELLEZA/CUIDADO PERSONAL
                        break;
                    case 'M':
                        cliente.ISSCOM = 4705; //CAFÉ INTERNET
                        break;
                    case 'N':
                        cliente.ISSCOM = 4709; //SERVICIOS AL DETALLE - PANTEON, FUNERALES, ETC
                        break;
                    case 'O':
                        cliente.ISSCOM = 4801; //AEROLÍNEA
                        break;
                    case 'P':
                        cliente.ISSCOM = 4802; //LÍNEA DE AUTOBUSES
                        break;
                    case 'Q':
                        cliente.ISSCOM = 4709; //SERVICIOS AL DETALLE - OTROS SERVICIOS…
                        break;
                }
                break;
            case '7': //CUESTIONARIO No. 7 - NEGOCIOS CON VENTA AL MAYOREO
                switch (cuestionarios.ISSCOMp1) {
                    case 'A':
                        cliente.ISSCOM = 6102; //CENTRAL DE ABASTOS
                        break;
                    case 'B':
                        cliente.ISSCOM = 7101; //VENTA VENDEDOR
                        break;
                    case 'C':
                        cliente.ISSCOM = 4001; //BANQUETES
                        break;
                    case 'D':
                        cliente.ISSCOM = 6201; //DISTRIBUIDOR
                        break;
                    case 'E':
                        cliente.ISSCOM = 3501; //HOGAR CONSUMO
                        break;
                    case 'F':
                        cliente.ISSCOM = 6101; //BODEGA EMBOTELLADOR CON VENTA AL PÚBLICO
                        break;
                    case 'G':
                        cliente.ISSCOM = 4002; //EVENTOS ESPECIALES
                        break;
                    case 'H':
                        cliente.ISSCOM = 6105; //MAYORISTA
                        break;
                    case 'I':
                        cliente.ISSCOM = 6104; //DEPÓSITO DE REFRESCOS
                        break;
                    case 'J':
                        cliente.ISSCOM = 7102; //RUTAS EXPERIENCIA
                        break;
                }
                break;
            case '8': //CUESTIONARIO No. 8 - SOLO PARA ESCUELAS
                switch (cuestionarios.ISSCOMp1) {
                    case 'A':
                        cliente.ISSCOM = 3903; //PREESCOLAR/JARDÍN DE NIÑOS
                        break;
                    case 'B':
                        cliente.ISSCOM = 3905; //PRIMARIA PÚBLICA
                        break;
                    case 'C':
                        cliente.ISSCOM = 3904; //PRIMARIA PRIVADA
                        break;
                    case 'D':
                        cliente.ISSCOM = 3911; //SECUNDARIA PÚBLICA
                        break;
                    case 'E':
                        cliente.ISSCOM = 3910; //SECUNDARIA PRIVADA
                        break;
                    case 'F':
                        cliente.ISSCOM = 3907; //PREPA / BACHI / PÚBLICO
                        break;
                    case 'G':
                        cliente.ISSCOM = 3906; //PREPA / BACHI / PRIVADO
                        break;
                    case 'H':
                        cliente.ISSCOM = 3909; //UNIVERSIDAD PÚBLICA
                        break;
                    case 'I':
                        cliente.ISSCOM = 3908; //UNIVERSIDAD PRIVADA
                        break;
                    case 'J':
                        cliente.ISSCOM = 3901; //ESCUELA ESP. (ARTES/LENGUAS)
                        break;
                    case 'K':
                        cliente.ISSCOM = 3902; //ESCUELA TÉCNICA/COMERCIAL
                        break;
                }
                break;
        }
        //////////////////////////////////////////////////////////////////
        ////////////GEC/////////////////
        if (cuestionarios.GECp1 == "A") {
            if (cuestionarios.GECp2 == "A") {
                if (cuestionarios.GECp3 == "A") {
                    cliente.GEC = "52" //PLATA
                } else {
                    cliente.GEC = "53" //BRONCE
                }
            } else {
                if (cuestionarios.GECp3 == "A") {
                    cliente.GEC = "52" //PLATA
                } else {
                    cliente.GEC = "52" //PLATA
                }
            }
        } else {
            cliente.GEC = "53" //BRONCE
        }
        //////////////////////////////////

        //////////////////////////////////////////////////////////////////
        if (cliente.ZNAME4 == "") {
            cliente.ZNAME4 = cliente.ZNAME1;
        }
        //////////////////////////////////////////////////////////////////

        console.log('Conexión a la base de datos');

        var catalogoRutas = "SELECT * FROM catalogoRutas WHERE ROUTE = '" + cliente.ROUTE + "' AND ZROUTE = '" + cliente.RUTA_REPARTO + "'";
        // connection.query(catalogoRutas, function (err, resultRoute){
        //     if (err) throw err;
        //     let dato = resultRoute[0];

        // var catalogoCP = "SELECT * FROM catalogoCP WHERE ID_CODIGOP = '" + cliente.ZCPOSTAL + "' AND BZIRK = '" + cliente.BZIRK + "'";



        if (pedidos) {
            console.log("Insertar pedidos");
            var sqlPedidos = 'INSERT INTO pedidos(PEDIDO,`FECHA ENTREGA`,CLIENTE,`RESPONSABLE DE PAGO`,`DESTINATARIO DE MERCANCIA`,`FECHA DEL PEDIDO`,MATERIAL,CANTIDAD,UM,`TIPO OPERACIÓN`,VPT,idOficinaMovil) VALUES ?'
            var datos = pedidos;
            connection.query(sqlPedidos, [datos], function (err, result) {

                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
                connection.end();
            });
            callback(null, {
                "mensaje": "Pedido generado"
            });
        } else {
            console.log("No hay pedidos, insertar cliente")
            connection.query(catalogoRutas, function (err, result) {
                if (err) throw err;
                resultado = result[0];
                cliente.KDGRP = resultado.KDGRP;
                cliente.BZIRK = resultado.BZIRK;
                cliente.BZTXT = resultado.BZTXT;
                // cliente.BZIRK = resultado.BZIRK
                // cliente.ZESTPROV = resultado.ID_ESTADO
                console.log("KDGRP", resultado.KDGRP);
                console.log("BZIRK", resultado.BZIRK);
                console.log("ZESTPROV", resultado.ID_ESTADO);
                // var sql = 'INSERT INTO prueba(EVENTOGUID) VALUES ?';
                var sql = 'INSERT INTO prueba(idOficinaMovil,EVENTOGUID,VKORG,KDGRP,BZIRK,KUNNR,ID_Solicitud,ID_Motivo_Solicitud,ZTEXT,ZFECHA,ZHORA,fechaSolicitud,ZNAME1,NAME_FIRST,NAME_LAST,ZTELFIJO,ZCELULAR,ZTELFIJO_CEL,ZCORREO,ZZCRM_LAT,ZZCRM_LONG,ZCPOSTAL,estado,ZESTPROV,ZMUNIDELEG,ZCOLONIA,ZCALLE,ZCALLECON,ZENTRECALLE1,ZENTRECALLE2,ZNUMEXT,ZLOTE,ZMANZANA,ZNUMINT,ZENREJADO,VPTYP,ROUTE,RUTA_REPARTO,diasVisita,SEQULUNES,SEQUMARTES,SEQUMIERCOLES,SEQUJUEVES,SEQUVIERNES,SEQUSABADO,IDMETODO,ZREQREM,ZREQFAC,ZPAPERLESS,ZFISICAMORAL,ZNAME4,ZRFCNOMBRE,ZRFCAPELLIDOS,ZRFC,ZRFCCODIGOPOSTAL,ZRFCESTADO,ZRFCMUNDELEG,ZRFCCOLONIA,ZRFCCALLE,ZRFCCALLE_CON,ZRFCNUM_EXT,ZRFCNUM_INT,ZCFDI,ISSCOM,GEC,LOCALIDAD,OCASIONDECONSUMO,BZTXT) VALUES ?';
                var values = [
                    [
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
                        cliente.OCASIONDECONSUMO,
                        cliente.BZTXT
                    ]
                ];

                connection.query(sql, [values], function (err, result) {

                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                    connection.end();
                });
                // callback(null, { "mensaje": "Alta correcta" });
                callback(null, cliente);
            });
        }

    });

    // callback(null, cliente);
}