var mysql = require('mysql');
var moment = require("moment-timezone");
let Client = require('ssh2-sftp-client');
var date1 = new Date();
exports.handler = async (event) => {
    // TODO implement
    // var s3 = new AWS.S3();
    // var getParams = {
    //     Bucket: 'clienteskof',
    //     // Body: csvFromArrayOfArrays,
    //     Key: "kof.ppk"
    // };
    // const s3file = s3.getObject(getParams).createReadStream();
    let sftp = new Client();
    let remote = 'oficina_movil_FEMSA_prueba.csv';
    sftp.connect({
            host: '187.216.147.58',
            port: '22',
            username: 'MXAPPOFMOV',
            password: '*APPF0V.2019*'
        }).then(() => {
            console.log("Conectado a SFTP");
            return sftp.put(csv, remote);
        })
        .then(() => {
            console.log("Enviado a SFTP");
            return sftp.end();
        })
        .catch(err => {
            console.error(err.message);
        });
    // console.log("Fecha", fecha);

    const response = {
        statusCode: 200,
        body: null,
    };
    return response;
};