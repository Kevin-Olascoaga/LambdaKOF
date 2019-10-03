var aws = require('aws-sdk');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
const { convertArrayToCSV } = require('convert-array-to-csv');
var moment = require("moment-timezone");

var ses = new aws.SES();

exports.handler = function (event, context, callback) {

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
        // let mesF = hoy.getMonth()+1;
        // let añoF = hoy.getFullYear();
        let ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        ayer = moment(ayer.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD");
        // let diaI = ayer.getDate();
        // let mesI = ayer.getMonth()+1;
        // let añoI = ayer.getFullYear();
        
        // let fechaInicio = new Date(añoI,mesI,diaI,17);
        //let fechaInicio = añoI + "-" + mesI + "-" + diaI + " 17:00:00";
        // let fechaInicio = ayer + " 17:00:00";
        // let fechaFin = new Date(añoF,mesF,diaF,17);
        // let fechaFin = añoF + "-" + mesF + "-" + diaF + " 17:00:00";
        // let fechaFin = hoy + " 17:00:00";
        
        var tablaPedidos = "SELECT `PEDIDO`, DATE_FORMAT(`FECHA ENTREGA`, '%Y.%m.%d'), `CLIENTE`, `RESPONSABLE DE PAGO`, `DESTINATARIO DE MERCANCIA`, DATE_FORMAT(`FECHA DEL PEDIDO`, '%Y.%m.%d'), `MATERIAL`, `CANTIDAD`, `UM`, `TIPO OPERACIÓN`, `VPT` FROM pedidos WHERE CLIENTE <> 'CD00000000' AND estatus <> 'enviado'";
        connection.query(tablaPedidos, function (err, result) {
            if (err) throw err;
            console.log("Res: ", result);
            let actualizarEstatus = "UPDATE `pedidos` SET `estatus` = 'enviado' WHERE CLIENTE <> 'CD00000000' AND estatus <> 'enviado'";
            const header = ['PEDIDO', 'FECHA ENTREGA', 'CLIENTE', 'RESPONSABLE DE PAGO', 'DESTINATARIO DE MERCANCIA', 'FECHA DEL PEDIDO', 'MATERIAL', 'CANTIDAD', 'UM', 'TIPO OPERACIÓN', 'VPT'];
            const csvFromArrayOfArrays = convertArrayToCSV(result, {
                header,
                separator: ','
              });

            var mailOptions = {
                from: 'minsait.kof@gmail.com',
                subject: 'Pedidos de Oficina Móvil',
                html: `<p>Pedidos generados por: <b>Oficina Móvil</b></p>`,
                to: 'minsait.kof@gmail.com',
                // bcc: Any BCC address you want here in an array,
                attachments: [{
                    filename: "pedidos.csv",
                    content: csvFromArrayOfArrays
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
            connection.query(actualizarEstatus, function (err, result) {
                if (err) throw err;
                connection.end();
            });
        });
    });
};