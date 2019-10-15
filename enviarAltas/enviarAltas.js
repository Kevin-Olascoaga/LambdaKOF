var AWS = require('aws-sdk');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var moment = require("moment-timezone");
var jsonexport = require('jsonexport');
let Client = require('ssh2-sftp-client');
const uuidv4 = require('uuid/v4');

var ses = new AWS.SES();

exports.handler = function (event, context, callback) {
    // generarArchivoS3();
    //Conexión Base de datos///////////////////
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
        console.log('Conexión a la base de datos');
        let hoy = new Date();
        hoy = moment(hoy.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD 00:00:00");
        let hoy2 = new Date();
        hoy2 = new Date(hoy2 - 2 * 60 * 60 * 1000);
        hoy2 = moment(hoy2.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:SS");
        console.log("Hoy menos 2: ", hoy2);
        // let diaF = hoy.getDate();
        // let mesF = hoy.getMonth() + 1;
        // let añoF = hoy.getFullYear();
        let ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        ayer = moment(ayer.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:SS");
        // let diaI = ayer.getDate();
        // let mesI = ayer.getMonth() + 1;
        // let añoI = ayer.getFullYear();
        let fechaHora = new Date();
        fechaHora = moment(fechaHora.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD_HH:mm");

        // let fechaInicio = new Date(añoI,mesI,diaI,17);
        // let fechaInicio = añoI + "-" + mesI + "-" + diaI + " 17:00:00";
        // let fechaFin = new Date(añoF,mesF,diaF,17);
        // let fechaFin = añoF + "-" + mesF + "-" + diaF;
        let event = uuidv4();
        var updateClientes = "UPDATE `prueba` SET `EVENTOGUID` = '" + event + "' WHERE envio = 'pendiente' AND KUNNR = 'CD00000000'";
        /////////Query con la fecha de actualización/////////////////////Cambiar de <= a =
        connection.query(updateClientes, function (err, result) {
            if (err) throw err;
            var tablaClientes = "SELECT idOficinaMovil, EVENTOGUID, VKORG, KDGRP, BZIRK, KUNNR, ID_Solicitud, ID_Motivo_Solicitud, Route, ZTEXT, DATE_FORMAT(ZFECHA, '%Y/%m/%d') ZFECHA, ZHORA, DATE_FORMAT(fechaSolicitud, '%Y/%m/%d') fechaSolicitud, ZNAME1, NAME_FIRST, NAME_LAST, ZTELFIJO, ZCELULAR, ZTELFIJO_CEL, ZCORREO, ZZCRM_LAT, ZZCRM_LONG, ZCPOSTAL, estado, ZESTPROV, ZMUNIDELEG, ZCOLONIA, ZCALLE, ZCALLECON, ZENTRECALLE1, ZENTRECALLE2, ZNUMEXT, ZLOTE, ZMANZANA, ZNUMINT, ZENREJADO, VPTYP, ROUTE, RUTA_REPARTO, diasVisita, SEQULUNES, SEQUMARTES, SEQUMIERCOLES, SEQUJUEVES, SEQUVIERNES, SEQUSABADO, IDMETODO, ZREQREM, ZREQFAC, ZPAPERLESS, ZFISICAMORAL, ZNAME4, ZRFCNOMBRE, ZRFCAPELLIDOS, ZRFC, ZRFCCODIGOPOSTAL, ZRFCESTADO, ZRFCMUNDELEG, ZRFCCOLONIA, ZRFCCALLE, ZRFCCALLE_CON, ZRFCNUM_EXT, ZRFCNUM_INT, ZCFDI, ISSCOM, GEC, LOCALIDAD, OCASIONDECONSUMO FROM prueba WHERE envio = 'pendiente' AND KUNNR = 'CD00000000'";
            connection.query(tablaClientes, function (err, result) {
                if (err) throw err;

                const header = ['idOficinaMovil', 'EVENTOGUID', 'VKORG', 'KDGRP', 'BZIRK', 'KUNNR', 'ID_Solicitud', 'ID_Motivo_Solicitud', 'Route', 'ZTEXT', 'ZFECHA', 'ZHORA', 'fechaSolicitud', 'ZNAME1', 'NAME_FIRST', 'NAME_LAST', 'ZTELFIJO', 'ZCELULAR', 'ZTELFIJO_CEL', 'ZCORREO', 'ZZCRM_LAT', 'ZZCRM_LONG', 'ZCPOSTAL', 'estado', 'ZESTPROV', 'ZMUNIDELEG', 'ZCOLONIA', 'ZCALLE', 'ZCALLECON', 'ZENTRECALLE1', 'ZENTRECALLE2', 'ZNUMEXT', 'ZLOTE', 'ZMANZANA', 'ZNUMINT', 'ZENREJADO', 'VPTYP', 'ROUTE', 'RUTA_REPARTO', 'diasVisita', 'SEQULUNES', 'SEQUMARTES', 'SEQUMIERCOLES', 'SEQUJUEVES', 'SEQUVIERNES', 'SEQUSABADO', 'IDMETODO', 'ZREQREM', 'ZREQFAC', 'ZPAPERLESS', 'ZFISICAMORAL', 'ZNAME4', 'ZRFCNOMBRE', 'ZRFCAPELLIDOS', 'ZRFC', 'ZRFCCODIGOPOSTAL', 'ZRFCESTADO', 'ZRFCMUNDELEG', 'ZRFCCOLONIA', 'ZRFCCALLE', 'ZRFCCALLE_CON', 'ZRFCNUM_EXT', 'ZRFCNUM_INT', 'ZCFDI', 'ISSCOM', 'GEC', 'LOCALIDAD', 'OCASIONDECONSUMO'];
                // const csvFromArrayOfArrays = convertArrayToCSV(result, {
                //     header,
                //     separator: ','
                // });
                jsonexport(result, function (err, csv) {
                    if (err) return console.log(err);
                    // console.log(csv);

                    console.log("FILE: ", csv);
                    //Conexión S3//////////////////////////////
                    var s3 = new AWS.S3();
                    var uploadParams = {
                        Bucket: 'clienteskof',
                        Body: csv,
                        Key: "backupAltas/oficina_movil_FEMSA_" + fechaHora + ".csv"
                    };
                    s3.upload(uploadParams, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                        }
                        if (data) {
                            console.log("Upload Success", data.Location);
                        }
                    });

                    //////////////CORREO/////////////////////
                    var mailOptions = {
                        from: 'minsait.kof@gmail.com',
                        subject: 'Clientes de Oficina Móvil' + fechaHora,
                        html: `<p>Clientes generados por: <b>Oficina Móvil</b></p>`,
                        to: 'minsait.kof@gmail.com',
                        // bcc: Any BCC address you want here in an array,
                        attachments: [{
                            filename: "oficina_movil_FEMSA_" + fechaHora + ".csv",
                            content: csv
                        }]
                    };
        
                    console.log('Creating SES transporter');
                    // create Nodemailer SES transporter
                    var transporter = nodemailer.createTransport({
                        SES: ses
                    });
        
                    // send email
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                            console.log('Error sending email');
                            callback(err);
                        } else {
                            console.log('Email sent successfully');
                            callback();
                        }
                    });
                    ////////////////////////////////////////////////
                    ///////////////////////////////////////////////
                    //Conexión SFTP////////////////////////////
                    // var s3 = new AWS.S3();
                    // var getParams = {
                    //     Bucket: 'clienteskof',
                    //     // Body: csvFromArrayOfArrays,
                    //     Key: "kof.ppk"
                    // };
                    // const s3file = s3.getObject(getParams).createReadStream();
                    // let sftp = new Client();
                    // let remote = 'oficina_movil_FEMSA_prueba.csv';
                    // sftp.connect({
                    // host: 'localhost',
                    // port: '22',
                    // username: 'kof',
                    // password: '',
                    // privateKey: s3file,
                    // passphrase: ''
                    // }).then(() => {
                    //     console.log("Conectado a SFTP");
                    //     return sftp.put(csv, remote);
                    //   })
                    //   .then(() => {
                    //     console.log("Enviado a SFTP");
                    //     return sftp.end();
                    //   })
                    //   .catch(err => {
                    //     console.error(err.message);
                    //   });
                    //////////////////////////////////////////////////////////////
                });
                let estatusEnvio = "UPDATE `prueba` SET `envio` = 'enviado' WHERE envio = 'pendiente' AND KUNNR = 'CD00000000'";
                connection.query(estatusEnvio, function (err, result) {
                    if (err) throw err;
                    connection.end();
                });
            });
        });
    });
    const response = {
        statusCode: 200,
        body: JSON.stringify('Datos cargados'),
    };
    return response;
};