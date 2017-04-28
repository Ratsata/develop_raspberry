'use strict';

const express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),//Socket IO trabaja sobre el servidor
    port = process.env.PORT || 3000,
    publicDir = express.static(`${__dirname}/public`),
    mqtt = require('mqtt'),
    client  = mqtt.connect('mqtt://192.168.1.36');

let conexions = 0,
    mensaje = false;

var ESPmensaje=0;

app
    .use(publicDir)
    .get('/', (req, res) => res.sendFile(`${publicDir}/index.html`));


/*function server(req, res) {
    fs.readFile('./public/index.html', (err, data) => { //data son los datos que entrega el archivo HTML
        if (err) {
            res.writeHead(500,{'Content-Type' : 'text/html'});//Error 500
            return res.end('<h1>Error Interno del Servidor</h1>');
        } else {
            res.writeHead(200,{'Content-Type' : 'text/html'});
            return res.end(data, 'utf-8');
        }
    });
}*/

http.listen( port, () => console.log('Iniciando Express y Socket.IO en localhost:&d, port') );

client.on('connect', function () {
    client.subscribe('GPIO');
    client.publish('GPIO', 'GPIO Escuchando');
});

client.on('message', (topic, message) => { //Recibe el 'mensaje' del broker
    ESPmensaje = message.toString(); // Se coloca el metodo toString ya que message es un buffer
    console.log(`${ESPmensaje} MQTT`);
    //console.log(`${ESPmensaje} MQTT`); //Imprime el mensaje en la consola para diferenciar entre el mensaje del front
    // y el mensaje del backend MQTT: Backend
    mensaje = true;
});

io.on('connection', (socket) => {

    conexions++;

    console.log(`Conexiones activas: ${conexions}`);

    socket.emit('connect users', { numbers : conexions });
    socket.broadcast.emit('connect users', { numbers : conexions });

    client.on('message', (topic, message) => {
        if(mensaje) { //Se realiza condicion ya que si no se hace se ejecuta todas las veces que haya una nueva conexion (actualizar pagina)
            socket.emit('hello', ESPmensaje); // Emito un GPIOo para que lo reciba el frontend y logre imprimier en document el estado
            socket.broadcast.emit('hello', ESPmensaje);
            mensaje = false;
        }
    });

    socket.on('cliente', (data) => {    //'cliente' recibe el dato del frontend del estado del checkbox
        console.log(`${data.estado} Frontend`); //Para observar el dato que llega del frontend
        if(data.estado == '1'){
            socket.emit('hello', ESPmensaje); // Emito un GPIOo para que lo reciba el frontend y logre imprimier en document el estado
            socket.broadcast.emit('hello', ESPmensaje);
            client.publish('GPIO', '100');//Realizo una publicacion en el topic 'GPIO'
        }
        else if(data.estado == '0'){
            socket.emit('hello', ESPmensaje);
            socket.broadcast.emit('hello', ESPmensaje);
            client.publish('GPIO', '0');
        }
    });
    socket.on('motorpwm', (data) => {    //'cliente' recibe el dato del frontend del estado del checkbox
        console.log(`${data.estado} Frontend`); //Para observar el dato que llega del frontend
        
            socket.emit('hello', ESPmensaje); // Emito un GPIOo para que lo reciba el frontend y logre imprimier en document el estado
            socket.broadcast.emit('hello', ESPmensaje);
            client.publish('GPIO', data.estado.toString());//Realizo una publicacion en el topic 'GPIO'
        
    });

    socket.on('disconnect', () => {
        conexions--;
        console.log(`Conexiones activas: ${conexions}`);
        socket.broadcast.emit('connect users', { numbers : conexions });
    });

});