var AWS = require('aws-sdk');
var mysql = require('mysql');
var moment = require("moment-timezone");
let Client = require('ssh2-sftp-client');

const {
    convertArrayToCSV
} = require('convert-array-to-csv');

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
        hoy = moment(hoy.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD");
        // let diaF = hoy.getDate();
        // let mesF = hoy.getMonth() + 1;
        // let añoF = hoy.getFullYear();
        let ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        ayer = moment(ayer.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD");
        // let diaI = ayer.getDate();
        // let mesI = ayer.getMonth() + 1;
        // let añoI = ayer.getFullYear();

        // let fechaInicio = new Date(añoI,mesI,diaI,17);
        // let fechaInicio = añoI + "-" + mesI + "-" + diaI + " 17:00:00";
        // let fechaFin = new Date(añoF,mesF,diaF,17);
        // let fechaFin = añoF + "-" + mesF + "-" + diaF;
        /////////Query con la fecha de actualización/////////////////////Cambiar de <= a =
        var tablaClientes = "SELECT idOficinaMovil, EVENTOGUID, VKORG, KDGRP, BZIRK, KUNNR, ID_Solicitud, ID_Motivo_Solicitud, Route, ZTEXT, DATE_FORMAT(ZFECHA, '%Y/%m/%d') ZFECHA, ZHORA, DATE_FORMAT(fechaSolicitud, '%Y/%m/%d') fechaSolicitud, ZNAME1, NAME_FIRST, NAME_LAST, ZTELFIJO, ZCELULAR, ZTELFIJO_CEL, ZCORREO, ZZCRM_LAT, ZZCRM_LONG, ZCPOSTAL, estado, ZESTPROV, ZMUNIDELEG, ZCOLONIA, ZCALLE, ZCALLECON, ZENTRECALLE1, ZENTRECALLE2, ZNUMEXT, ZLOTE, ZMANZANA, ZNUMINT, ZENREJADO, VPTYP, ROUTE, RUTA_REPARTO, diasVisita, SEQULUNES, SEQUMARTES, SEQUMIERCOLES, SEQUJUEVES, SEQUVIERNES, SEQUSABADO, IDMETODO, ZREQREM, ZREQFAC, ZPAPERLESS, ZFISICAMORAL, ZNAME4, ZRFCNOMBRE, ZRFCAPELLIDOS, ZRFC, ZRFCCODIGOPOSTAL, ZRFCESTADO, ZRFCMUNDELEG, ZRFCCOLONIA, ZRFCCALLE, ZRFCCALLE_CON, ZRFCNUM_EXT, ZRFCNUM_INT, ZCFDI, ISSCOM, GEC, LOCALIDAD, OCASIONDECONSUMO FROM prueba WHERE fechaSolicitud = '" + hoy + "'";
        connection.query(tablaClientes, function (err, result) {
            if (err) throw err;
            const header = ['idOficinaMovil', 'EVENTOGUID', 'VKORG', 'KDGRP', 'BZIRK', 'KUNNR', 'ID_Solicitud', 'ID_Motivo_Solicitud', 'Route', 'ZTEXT', 'ZFECHA', 'ZHORA', 'fechaSolicitud', 'ZNAME1', 'NAME_FIRST', 'NAME_LAST', 'ZTELFIJO', 'ZCELULAR', 'ZTELFIJO_CEL', 'ZCORREO', 'ZZCRM_LAT', 'ZZCRM_LONG', 'ZCPOSTAL', 'estado', 'ZESTPROV', 'ZMUNIDELEG', 'ZCOLONIA', 'ZCALLE', 'ZCALLECON', 'ZENTRECALLE1', 'ZENTRECALLE2', 'ZNUMEXT', 'ZLOTE', 'ZMANZANA', 'ZNUMINT', 'ZENREJADO', 'VPTYP', 'ROUTE', 'RUTA_REPARTO', 'diasVisita', 'SEQULUNES', 'SEQUMARTES', 'SEQUMIERCOLES', 'SEQUJUEVES', 'SEQUVIERNES', 'SEQUSABADO', 'IDMETODO', 'ZREQREM', 'ZREQFAC', 'ZPAPERLESS', 'ZFISICAMORAL', 'ZNAME4', 'ZRFCNOMBRE', 'ZRFCAPELLIDOS', 'ZRFC', 'ZRFCCODIGOPOSTAL', 'ZRFCESTADO', 'ZRFCMUNDELEG', 'ZRFCCOLONIA', 'ZRFCCALLE', 'ZRFCCALLE_CON', 'ZRFCNUM_EXT', 'ZRFCNUM_INT', 'ZCFDI', 'ISSCOM', 'GEC', 'LOCALIDAD', 'OCASIONDECONSUMO'];
            const csvFromArrayOfArrays = convertArrayToCSV(result, {
                header,
                separator: ','
            });
            //Conexión S3//////////////////////////////
            var filePath = 'your_file_path';
            var s3 = new AWS.S3();
            var uploadParams = {
                Bucket: 'clienteskof',
                Body: csvFromArrayOfArrays,
                Key: "oficina_movil_FEMSA.csv"
            };
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                }
                if (data) {
                    console.log("Upload Success", data.Location);
                }
            });
            ///////////////////////////////////////////////
            //Conexión SFTP////////////////////////////
            // let sftp = new Client();
            // let remote = 'oficina_movil_FEMSA.csv';
            // sftp.connect({
            // host: 's-49b4cf4a1b604a1ea.server.transfer.us-west-2.amazonaws.com',
            // port: '8080',
            // username: 'username',
            // password: '******'
            // }).then(() => {
            //     return sftp.put(csvFromArrayOfArrays, remote);
            //   })
            //   .then(() => {
            //     return sftp.end();
            //   })
            //   .catch(err => {
            //     console.error(err.message);
            //   });
            //////////////////////////////////////////////////////////////
            connection.end();
        });
    });
    const response = {
        statusCode: 200,
        body: JSON.stringify('Datos cargados'),
    };
    return response;
};