$(document).ready(function(){
    //predispondo le variabili per i template
    var template_html = $('#day-template').html();
    var template_function = Handlebars.compile(template_html);

    //predispondo variabili per dati relativi alla data
    var start_date = '2018-01-01';
    var start_moment = moment(start_date);

    display_month(start_moment);

    //intercetto il click sul button next_month
    $('#next_month').click(function(){
        //devo aggiungere 1 al mese corrente per passare al mese successivo
        start_moment.add(1, 'months');
        //devo visualizzare il calendario aggiornato
        display_month(start_moment);
    });

    //intercetto il click sul button prev_month
    $('#prev_month').click(function(){
        //devo sottrarre 1 al mese corrente per passare al mese precedente
        start_moment.subtract(1, 'months');
        //devo visualizzare il calendario aggiornato
        display_month(start_moment);
    });

    //funzione per stampare i giorni del mese da visualizzare
    function display_month(data_moment){
        //svuoto il calendario
        $('#calendario').empty();
        //quanti giorni ha il mese da visualizzare
        var days_of_month = data_moment.daysInMonth();
        var text_month = data_moment.format('MMMM');
        var month = data_moment.month();
        var year = data_moment.year();
        text_month = text_month.charAt(0).toUpperCase() + text_month.slice(1);

        //popolo dinaminamente il mese che appare come titolo
        $('#current_month').text(text_month);

        //ciclo for per stampare i giorni del mese
        for (var i = 1; i <= days_of_month; i++) {
            console.log(i + ' ' + text_month + ' ' + year);
            //uso template per appendere giorno corrente in html
            var context = {
                'day': i + ' ' + text_month
            };
            var html_finale = template_function(context);
            $('#calendario').append(html_finale);
        }

        //chiamata ajax per recuperare le festività
        //https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0
        $.ajax({
            'url': 'https://flynn.boolean.careers/exercises/api/holidays',
            'method': 'GET',
            'data': {
                'year': year,
                'month': month
            },
            'success': function(data){
                console.log(data);
            },
            'error': function(data){
                alert('error');
            }
        });
    };
});
