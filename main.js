$(document).ready(function(){
    //predispondo le variabili per i template
    var template_html = $('#day-template').html();
    var template_function = Handlebars.compile(template_html);

    //predispondo la data da cui iniziare
    var start_date = '2018-01-01';
    var start_moment = moment(start_date);

    display_month(start_moment);

    //------ intercetto il click sul button next_month
    $('#next_month').click(function(){
        //devo aggiungere 1 al mese corrente per passare al mese successivo
        start_moment.add(1, 'months');
        //leggo il mese corrente
        var current_month = $('#current_month').text();
        // console.log('mese corrente: ' + current_month);
        //se clicco e sto su genn
        if (current_month == 'Gennaio') {
            //fai comparire button prev
            $('#prev_month').show();
        }
        //se mi trovo su dicembre
        if (current_month == 'Dicembre') {
            //fai scomparire icona next
            $('#next_month').hide();
            alert('non puoi andare avanti');
        } else {
            //devo visualizzare il calendario aggiornato
            display_month(start_moment);
        }
    });

    //------ intercetto il click sul button prev_month
    $('#prev_month').click(function(){
        //devo sottrarre 1 al mese corrente per passare al mese precedente
        start_moment.subtract(1, 'months');
        var current_month = $('#current_month').text();
        // console.log('mese corrente: ' + current_month);
        if (current_month == 'Dicembre') {
            $('#next_month').show();
        }
        //Controllare se il mese è valido
        //se mi trovo su gennaio
        if (current_month == 'Gennaio') {
            //fai scomparire icona prev
            $('#prev_month').hide();
            alert('non puoi andare indietro');
        } else {
            //devo visualizzare il calendario aggiornato
            display_month(start_moment);
        }
    });

    //funzione per stampare i giorni del mese da visualizzare
    function display_month(data_moment){
        //svuoto il calendario
        $('#calendario').empty();

        //clono l'oggetto moment per usarlo per il data-day
        var date = data_moment.clone();

        //numero giorni del mese da visualizzare
        var days_of_month = date.daysInMonth();
        //mese testuale
        var text_month = date.format('MMMM');
        text_month = text_month.charAt(0).toUpperCase() + text_month.slice(1);
        //giorno della settimana in numero
        var day_of_week = date.day();
        //mese in numero
        var month = date.month();
        //anno in numero
        var year = date.year();

        //popolo dinaminamente il mese che appare come titolo
        $('#current_month').text(text_month);

        //devo stampare dei li vuoti per i giorni mancanti dall'inizio
        display_empty_block(day_of_week);
        //devo stampare i giorni
        display_days(days_of_month, date);
        //richiamo funzione per stampare le festività
        display_holiday(start_moment);
    };

    //funzione per stampare blocchi vuoti ad inizio mese per giorni mancanti
    function display_empty_block(day_position) {
        //se il primo è domenica appendi 6 vuoti
        if (day_position == 0 ) {
            for (var k = 0; k < 6; k++) {
                $('#calendario').append('<div class="day_box"></div>');
            }
        } else if (2 <= day_position <= 6) {
            for (var j = 0; j < (day_position - 1); j++) {
                $('#calendario').append('<div class="day_box"></div>');
            }
        }
    }

    //funzione per stampare i giorni
    function display_days(days_of_month, date) {
        //ciclo for per stampare i giorni del mese e data-day
        for (var i = 1; i <= days_of_month; i++) {
            // console.log(i + ' ' + text_month + ' ' + year);
            //uso template per appendere giorno corrente in html e data-day ad ogni giorno
            var context = {
                'day': i,
                'date': date.format('YYYY-MM-DD')
            };
            var html_finale = template_function(context);
            $('#calendario').append(html_finale);
            //aggiungo un giorno all'oggetto moment che ho clonato
            date.add(1, 'days');
        }
    }

    //funzione per stampare le festività
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
                //scorro l'array delle festività
                for (var i = 0; i < holidays.length; i++) {
                    //prendi la data della festività
                    var holiday_date = holidays[i].date;
                    //prendi il nome della festività
                    var holiday_name = holidays[i].name;
                    //controllo se la data è uguale a data-id, aggiungo classe vacation e append il nome della festività
                    $('.day_box[data-day="'+ holiday_date +'"]').addClass('vacation').append('<span class="holiday">' + holiday_name + '</span>');
                }
            },
            'error': function(data){
                alert('error');
            }
        });
    }
});
