//API
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
var Request = require("request");

exports.handler = function(event, context, callback) {
    
    let numero = event['numero'];
    let calle = event['calle'];
    let colonia = event['colonia'];
    let municipio = event['municipio'];
    let estado = event['estado'];
    let coordenadas = {
        lat: "",
        lon: ""
    }
    
    Request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + numero + "+" + calle + "," + colonia + "," + municipio + "," + estado + "&key=AIzaSyB_H0OkKqjnld_RXVKXClJbENg4xO4eVxQ", (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        let api = JSON.parse(body);
        let direccion = api.results[0];
        let geo = direccion.geometry;

        coordenadas.lat = geo.location.lat;
        coordenadas.lon = geo.location.lng;

        console.log(direccion);
        callback(null, coordenadas);
    });
}