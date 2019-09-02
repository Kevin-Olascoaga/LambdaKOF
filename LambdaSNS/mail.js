exports.handler = function(event, context, callback) {
    
    let to = event['to'];
    let cc = event['cc'];
    let bcc = event['bcc'];
    let subject = event['subject'];
    let body = event['body'];

    callback(null, {"message": "Correo enviado"});

}