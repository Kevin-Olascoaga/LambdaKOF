var Request = require("request");

exports.handler = function(event, context, callback) {
    
    let lat = event['lat'];
    let lon = event['lon'];

    var data = geocoder(lat,lon);
    
    callback(null, data);
}

function geocoder(lat,lon){
    Request.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyB_H0OkKqjnld_RXVKXClJbENg4xO4eVxQ", (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        let api = JSON.parse(body);
        let direccion = api.results[0];

        console.log(direccion);

        return direccion;


    });
}