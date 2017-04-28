(function (d,io) {
    'use strict';
    var io = io(),
        check = d.querySelector('#check'), //capto el checkbox
        estado = 0,
        botonEnviar = d.querySelector('#botonEnviar'),
        valueSlider = d.querySelector('#valueSlider');

    io.on('hello', function(data){ //Capto el dato enviado del frontend 'ESPmensaje'
        console.log(data); //Veo lo que esta llegando
        d.querySelector('#hello').innerHTML = data; // Imprimo en el document lo que llega del broker
        if(data == '1'){
            d.querySelector('#estado').innerHTML = 'Encendido';
        }
        else if(data == '0'){
            d.querySelector('#estado').innerHTML = "Apagado";
        }
        else{
            d.querySelector('#estado').innerHTML = "Comando Desconocido";
        }
    });

    io.on('connect users', function (data) {
        console.log('Actualizando desde el Servidor. Hay ' + data.numbers + ' conexiones activas');

        d.querySelector('#conexions').innerHTML = data.numbers;
    });

    //Envio de datos al backend
    check.addEventListener('change', function(e){ //Capto el evento change del checkbox
        e.preventDefault();
        if(e.target.checked){
            io.emit('cliente', { //Envio el estado del checkbox al backend
                estado: '1'
            });
            //alert('apreto');
        }
        else if(!e.target.checked){
            io.emit('cliente', {
                estado: '0'
            });
            //alert('Nones');
        }
    });
    botonEnviar.addEventListener('click', function(e){
        e.preventDefault();
        io.emit('motorpwm', {
                estado: valueSlider.value
            });
    });

})(document,io);