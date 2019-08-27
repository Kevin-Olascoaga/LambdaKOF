var Request = require("request");

exports.handler = function(event, context, callback) {
    
    let lat = event['lat'];
    let lon = event['lon'];
    let geocoder = {
        numero: "",
        calle: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        codigoPostal: ""
    }
    
    Request.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyB_H0OkKqjnld_RXVKXClJbENg4xO4eVxQ", (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        let api = JSON.parse(body);
        let direccion = api.results[0];
        let dir = direccion.address_components
        
        dir.forEach(function(element) {
            if (element.types[0] == "street_number") {
                geocoder.numero = element.long_name;
            }
            if (element.types[0] == "route") {
                geocoder.calle = element.long_name;
            }
            if (element.types[0] == "neighborhood") {
                geocoder.municipio = element.long_name;
            }
            if (element.types[0] == "political") {
                geocoder.colonia = element.long_name;
            }
            if (element.types[0] == "locality") {
                geocoder.estado = element.long_name;
            }
            if (element.types[0] == "country") {
                geocoder.pais = element.long_name;
            }
            if (element.types[0] == "postal_code") {
                geocoder.codigoPostal = element.long_name;
            }
            console.log(element)
            console.log(geocoder)
        })
        console.log(direccion);
        callback(null, geocoder);
    });
}