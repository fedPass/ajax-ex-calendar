$(document).ready(function(){

    //es. API holiday per Gennaio
    //https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0

    //predispondo le variabili per i template
    var template_html = $('#day-template').html();
    var template_function = Handlebars.compile(template_html);

    //predispondo variabili per dati relativi alla data
    var start_date = '2018-01-01';
    var start_moment = moment(start_date);

    //quanti giorni ha il mese da visualizzare
    var days_of_month = start_moment.daysInMonth();
    var text_month = start_moment.format('MMMM');
    console.log(days_of_month);

    //ciclo for per stampare/appendere i giorni uno ad uno
    for (var i = 1; i <= days_of_month; i++) {
        console.log(i + ' ' + text_month);
        //uso template per appendere giorno corrente in html
        var context = {
            'day': i + ' ' + text_month
        };
        var html_finale = template_function(context);
        $('#calendario').append(html_finale);
    }
});
