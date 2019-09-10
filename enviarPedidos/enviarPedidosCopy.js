// var aws = require('aws-sdk');
// var nodemailer = require('nodemailer');
var mysql = require('mysql');
const { convertArrayToCSV } = require('convert-array-to-csv');

// var ses = new aws.SES();

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

        var tablaPedidos = 'SELECT * FROM pedidos';
        connection.query(tablaPedidos, function (err, result) {
            if (err) throw err;
            const header = ['PEDIDO', 'FECHA ENTREGA', 'CLIENTE', 'RESPONSABLE DE PAGO', 'DESTINATARIO DE MERCANCIA', 'FECHA DEL PEDIDO', 'MATERIAL', 'CANTIDAD', 'UM', 'TIPO OPERACIÓN', 'VPT'];
            const csvFromArrayOfArrays = convertArrayToCSV(result, {
                header,
                separator: ';'
              });
            console.log("Pedidos", result);
            console.log("csv", csvFromArrayOfArrays);

            // var mailOptions = {
            //     from: 'minsait.kof@gmail.com',
            //     subject: 'Pedidos de Oficina Móvil',
            //     html: `<p>Pedidos generados por: <b>Oficina Móvil</b></p>`,
            //     to: 'minsait.kof@gmail.com',
            //     // bcc: Any BCC address you want here in an array,
            //     attachments: [{
            //         filename: "pedidos.csv",
            //         content: csvFromArrayOfArrays
            //     }]
            // };

            // console.log('Creating SES transporter');
            // // create Nodemailer SES transporter
            // var transporter = nodemailer.createTransport({
            //     SES: ses
            // });

            // // send email
            // transporter.sendMail(mailOptions, function (err, info) {
            //     if (err) {
            //         console.log(err);
            //         console.log('Error sending email');
            //         callback(err);
            //     } else {
            //         console.log('Email sent successfully');
            //         callback();
            //     }
            // });
        });
    });
};