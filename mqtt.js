var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.1.8');

client.on('connect', function () {
    client.subscribe('GPIO');
    client.publish('GPIO', 'Hello mqtt')
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    if(message.toString()=='1'){
        console.log('Encendido');
    }
    else if(message.toString()=='0'){
        console.log('Apagado');
    }
});