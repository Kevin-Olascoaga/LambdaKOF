var aws = require('aws-sdk');
var mysql = require('mysql');
var moment = require("moment-timezone");
var jsonexport = require('jsonexport');
var nodemailer = require('nodemailer');

var ses = new aws.SES();

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
        // let hoy = new Date();
        // hoy = moment(hoy.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD 00:00:00");
        // let hoy2 = new Date(hoy - 2 * 60 * 60 * 1000);
        // hoy2 = moment(hoy2.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:SS");
        // console.log("Hoy menos 2: ", hoy2);
        // // let diaF = hoy.getDate();
        // // let mesF = hoy.getMonth() + 1;
        // // let añoF = hoy.getFullYear();
        // let ayer = new Date();
        // ayer.setDate(ayer.getDate() - 1);
        // ayer = moment(ayer.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:SS");
        // // let diaI = ayer.getDate();
        // // let mesI = ayer.getMonth() + 1;
        // // let añoI = ayer.getFullYear();
        // let fechaHora = new Date();
        // fechaHora = moment(fechaHora.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD_HH:mm");

        // let fechaInicio = new Date(añoI,mesI,diaI,17);
        // let fechaInicio = añoI + "-" + mesI + "-" + diaI + " 17:00:00";
        // let fechaFin = new Date(añoF,mesF,diaF,17);
        // let fechaFin = añoF + "-" + mesF + "-" + diaF;
        let consulta;
        let clientes = [];
        var tablaClientes = "SELECT BZIRK, KUNNR, ZFECHA, ZNAME1, ZZCRM_LAT, ZZCRM_LONG, ROUTE, RUTA_REPARTO, BZTXT FROM prueba WHERE KUNNR <> 'CD00000000' AND distribucion <> 'enviado'";
        /////////Query con la fecha de actualización/////////////////////Cambiar de <= a =
        connection.query(tablaClientes, function (err, result) {
            if (err) throw err;
            var updateClientes = "UPDATE `prueba` SET `distribucion` = 'enviado' WHERE KUNNR <> 'CD00000000' AND distribucion <> 'enviado'";
            consulta = result;
            connection.query(updateClientes, function (err, result) {
                if (err) throw err;
                consulta.forEach(element => {
                    let cliente = {
                        UO: element.BZTXT,
                        NumCliente: element.KUNNR,
                        Ruta: element.RUTA_REPARTO,
                        Nombre: element.ZNAME1,
                        X: element.ZZCRM_LONG,
                        Y: element.ZZCRM_LAT,
                        Comentario: "CLIENTE NUEVO",
                        Fecha: element.ZFECHA
                    };
                    clientes.push(cliente);
                });
                // const csvFromArrayOfArrays = convertArrayToCSV(result, {
                //     header,
                //     separator: ','
                // });
                jsonexport(clientes, function (err, csv) {
                    if (err) return console.log(err);
                    // console.log(csv);

                    console.log("FILE: ", csv);
                    //Conexión e-mail//////////////////////////////
                    var mailOptions = {
                        from: 'minsait.kof@gmail.com',
                        subject: 'Clientes nuevos de Oficina Móvil',
                        html: `<p>Clientes nuevos generados por: <b>Oficina Móvil</b></p>`,
                        to: 'minsait.kof@gmail.com',
                        // bcc: Any BCC address you want here in an array,
                        attachments: [{
                            filename: "clientes.csv",
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
                    //////////////////////////////////////////////////
                });
                connection.end();
            });
        });
    });
    const response = {
        statusCode: 200,
        body: JSON.stringify('Clientes enviados'),
    };
    return response;
};