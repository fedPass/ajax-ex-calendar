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
        //Controllare se il mese è valido (!= da dic 2018)
        //leggo il mese corrente
        var current_month = $('#current_month').text();
        console.log(current_month);
        if (current_month == 'Dicembre') {
            alert('non puoi andare avanti');
            //fai scomparire icona next
            $('#next_month').hide();
        } else {
            //devo aggiungere 1 al mese corrente per passare al mese successivo
            start_moment.add(1, 'months');
            //devo visualizzare il calendario aggiornato
            display_month(start_moment);
        }
    });

    //intercetto il click sul button prev_month
    $('#prev_month').click(function(){
        //Controllare se il mese è valido
        var current_month = $('#current_month').text();
        if (current_month == 'Dicembre') {
            $('#next_month').show();
        }
        //devo sottrarre 1 al mese corrente per passare al mese precedente
        start_moment.subtract(1, 'months');
        //devo visualizzare il calendario aggiornato
        display_month(start_moment);
    });

    //funzione per stampare i giorni del mese da visualizzare
    function display_month(data_moment){
        //svuoto il calendario
        $('#calendario').empty();

        //clono l'oggetto moment per usarlo per il data-day
        var date = data_moment.clone();

        //quanti giorni ha il mese da visualizzare
        var days_of_month = data_moment.daysInMonth();
        var text_month = data_moment.format('MMMM');
        var month = data_moment.month();
        var year = data_moment.year();
        text_month = text_month.charAt(0).toUpperCase() + text_month.slice(1);

        //popolo dinaminamente il mese che appare come titolo
        $('#current_month').text(text_month);

        //ciclo for per stampare i giorni del mese e data-day
        for (var i = 1; i <= days_of_month; i++) {
            console.log(i + ' ' + text_month + ' ' + year);
            //uso template per appendere giorno corrente in html e data-day ad ogni giorno
            var context = {
                'day': i + ' ' + text_month,
                'date': date.format('YYYY-MM-DD')
            };
            var html_finale = template_function(context);
            $('#calendario').append(html_finale);
            date.add(1, 'days');
        }
        display_holiday(start_moment);
    };

    //chiamata ajax per recuperare le festività
    function display_holiday(data_moment) {
        $.ajax({
            'url': 'https://flynn.boolean.careers/exercises/api/holidays',
            'method': 'GET',
            'data': {
                'year': data_moment.year(),
                'month': data_moment.month()
            },
            'success': function(data){
                //mi restituisce un array con le festività mensili
                var holidays = data.response;
                console.log(holidays);
                //scorro l'array delle festività
                for (var i = 0; i < holidays.length; i++) {
                    //prendi la data della festività
                    var holiday_date = holidays[i].date;
                    //prendi il nome della festività
                    var holiday_name = holidays[i].name;
                    console.log(holiday_date);
                    console.log(holiday_name);
                    //controllo se la data è uguale a data-id
                    //aggiungo classe vacation
                    //append il nome della festività
                    $('#calendario li[data-day="'+ holiday_date +'"]').addClass('vacation').append(' - ' + holiday_name);
                }
            },
            'error': function(data){
                alert('error');
            }
        });
    }
});
