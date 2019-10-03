var AWS = require('aws-sdk');
var mysql = require('mysql');
// var moment = require("moment-timezone");
const csv = require('csvtojson');

exports.handler = function (event, context, callback) {
    //Conexión al S3 - posterior al sftp/////////////
    var filePath = 'your_file_path';
    var s3 = new AWS.S3();
    var getParams = {
        Bucket: 'clienteskof',
        // Body: csvFromArrayOfArrays,
        Key: "SAP_oficina_movil_FEMSA.csv"
    };
    var connection = mysql.createConnection({
        host: "kof.cmk4tzokwqsd.us-west-2.rds.amazonaws.com",
        user: "kofadmin",
        password: "CyEoDDTWfCtPY7h3NKzB",
        port: 3306,
        database: "innodb",
    });
    async function csvToJSON() {
        // get csv file and create stream
        const stream = s3.getObject(getParams).createReadStream();
        // convert csv file (stream) to JSON format data
        // let json = {
        //     idOficinaMovil: "",
        //     EVENTOGUID: "",
        // };
        let json = await csv().fromStream(stream);
        console.log(json);
        connection.connect(function (err) {
            if (err) {
                console.error('Database connection failed : ' + err.stack);
                return;
            }
            console.log('Conexión a la base de datos');
            for (let i = 0; i < json.length; i++) {
                let elemento = json[i];
                // console.log(json[i]);
                if (elemento.KUNNR != "CD00000000") { //Se actualiza en base de datos
                    console.log("Elemento se actualiza");
                    let sqlPedidos = "UPDATE pedidos SET CLIENTE = '" + elemento.KUNNR + "', `RESPONSABLE DE PAGO` = '" + elemento.KUNNR + "', `DESTINATARIO DE MERCANCIA` = '" + elemento.KUNNR + "' WHERE idOficinaMovil = '" + elemento.idOficinaMovil + "'";
                    let sqlClientes = "UPDATE prueba SET KUNNR = '" + elemento.KUNNR + "' WHERE idOficinaMovil = '" + elemento.idOficinaMovil + "'";
                    connection.query(sqlClientes, function (err, result) {
                        if (err) throw err;
                        console.log("Cliente actualizado: ");
                        // connection.end();
                    });
                    connection.query(sqlPedidos, function (err, result) {
                        if (err) throw err;
                        console.log("Pedidos actualizados: ");
                    });
                } else { //Elemento no se actualiza
                    console.log("Elemento no se actualiza");
                }
            };
            connection.end();
            // callback(null, { "mensaje": "" });
        });
        
    };
    csvToJSON();
    // s3.getObject(getParams, function (err, data) {
    //     if (err) {
    //         console.log("Error", err);
    //     }
    //     if (data) {


    //         let json = csvToJson.getJsonFromCsv(data.body);
    //         console.log("Objeto: ", json);
    //         for(let i=0; i<json.length;i++){
    //             console.log(json[i]);
    //         }
    //     }
    // });
    const response = {
        statusCode: 200,
        body: JSON.stringify('Datos cargados'),
    };
    return response;
};