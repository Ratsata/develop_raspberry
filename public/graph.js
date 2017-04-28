(function(io) {

    var io = io();
    var hora = [];
    var valores = [];

    iniciarGrafico(valores, hora);

    io.on('hello', function(data){

        console.log(data);
        if(hora.length > 10){
            valores.splice(0,1);
            hora.splice(0,1);
        }
        let fecha = new Date();

        valores.push(parseFloat(data));
        hora.push(fecha.getHours()+":"+fecha.getSeconds());

        actualizarGrafico(valores,hora);
    });
})(io);

function iniciarGrafico(valores, hora){
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Tension en las cargas'
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: hora,
        },
        yAxis: {
            title: {
                text: 'Voltaje'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' Volts'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: 'Potenciometro',
            data: valores
        }]
    });
}


function actualizarGrafico(valores,hora){
    chart.update({
        xAxis: {
            categories: hora,
        },
        series: {
            data: valores
        }
    });
}