var mysql = require('mysql');
var moment = require("moment-timezone");
var date1 = new Date();
exports.handler = async (event) => {
    // TODO implement
    var fecha = function (){
        return moment(date1.getTime()).tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:SS");
    }
    console.log("Fecha", fecha);

    const response = {
        statusCode: 200,
        body: fecha,
    };
    return response;
};
