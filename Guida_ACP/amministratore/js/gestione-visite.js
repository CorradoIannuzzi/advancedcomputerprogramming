/**
 * Qui verranno implementate le funzioni di:
 *      1) Inserimento visita
 *      2) Eliminazione visita
 *      3) Modifica visita
 */

var main = function(visiteRegistrate) {
    "use strict"; 

    var $visitlist = $('#visit-list'); 
    $visitlist.empty(); 

    visiteRegistrate.forEach(function(visita) {
        var $visititem = $('<li>').addClass('visit-item'); 
        var $visitinfo = $('<div>').addClass('visit-info');  
        var $visitname = $('<h4>').text("Visita " + visita.nome); 
        var $visitcode = $('<p>').text("Codice: " + visita.codice);
        var $visitdescription = $('<p>').text("Descrizione: " + visita.descrizione); 
        var $visitmaxp = $('<p>').text("Max Partecipanti: " + visita.max_partecipanti); 
        var $visitdurate = $('<p>').text("Durata (in ore): " + visita.durata); 
        var $visitprice = $('<p>').text("Prezzo: " + visita.prezzo); 
        var $visitdate = $('<p>').text("In Data: " + visita.data); 
        var $visitencounter = $('<p>').text("Incontro: " + visita.punto_incontro);
        var $guida = $('<p>').text("Identificativo Guida: " + visita.guida); 
        var $deleteButton = $('<button>').addClass('delete-button').text('Elimina');
        var $updateDateButton = $('<button>').addClass('update-date-button').text('Modifica Data'); 
        var $updateEncounterButton = $('<button>').addClass('update-encounter-button').text('Modifica punto di incontro'); 
 
    //Ai diversi bottoni viene associato il codice della visita, così da andare a modificare solo quest'ultimo: 
    $deleteButton.attr('visit-code', visita.codice); 
    $updateDateButton.attr('visit-code', visita.codice); 
    $updateEncounterButton.attr('visit-code', visita.codice); 

    //Ora aggiungiamo gli elementi nel dom: 
    $visitinfo.append($visitname, $visitcode, $visitdescription, $visitmaxp, $visitdurate, $visitprice, $visitdate, $visitencounter, $guida, 
        $deleteButton, $updateDateButton, $updateEncounterButton); 
    $visititem.append($visitinfo); 
    $visitlist.append($visititem, $deleteButton, $updateDateButton, $updateEncounterButton); 
    });

    /**
    * Lavoriamo ora alla select, ossia un menu a tendina dove compariranno tutte le guide disponibili
    * per la data inserita per la visita. 
    */

    const dataVisita = document.getElementById('visit-date');  
    const $selectGuide = $('#guide-dropdown'); 

    function refreshGuide(guideFiltrate) {
        $selectGuide.empty(); 

        $.each(guideFiltrate, function(i, guida) {
            $selectGuide.append($('<option>', {
                value: guida.id, 
                text: "Guida " + guida.nome 
            })); 
        }); 
    }

    function getGuideDisponibiliPerData(dataVisita) {
        var selectedDate = dataVisita.value; 
        var guideFiltrate = []; 

        $.getJSON('/guida', function(guide) {
            guide.forEach(guida => {
                var giorni_disp = new Date(guida.giorni_disp); 
                var dataSelezionata = new Date(selectedDate); 

                if(giorni_disp.toLocaleDateString() === dataSelezionata.toLocaleDateString()) {
                    guideFiltrate.push(guida); 
                }
            }); 

            console.log(guideFiltrate); 

            refreshGuide(guideFiltrate); 

        }); 
    }; 


    dataVisita.addEventListener('input', function() {
        getGuideDisponibiliPerData(dataVisita); 
    });

    /**
    * On click del bottone updateDateButton (oppure updateEncounterButton) si aprirà una finestra 
    * che chiederà di cambiare la data (o il punto di incontro) della visita guidata. 
     */
    $('.update-date-button').on('click', function(event){ 
        var modifica = window.confirm("Sei sicuro?"); 
        if(modifica === true) {
            var newDate = window.prompt("Inserisci una nuova data"); 
            var id = $(this).attr('visit-code');
            updateDateVisita(id, newDate);
        }
    });

    $('.update-encounter-button').on('click', function(event){
        var modifica = window.confirm("Sei sicuro?"); 
        if(modifica === true) {
            var newEncounter = window.prompt("Inserisci nuovo luogo di partenza"); 
            var id = $(this).attr('visit-code'); 
            updateEncounterVisita(id, newEncounter); 
        }
    }); 

    /**
    * On click del bottone deleteButton permette di eliminare la visita guidata 
    * registrata.
    */
    $('.delete-button').on('click', function(event){
        var elimina = window.confirm("Sei sicuro?"); 

        if(elimina === true){
            var visitcode = $(this).attr('visit-code'); 

            $.ajax({
                url: '/visita', 
                type: 'DELETE', 
                dataType: 'json', 
                data: {
                    codice: visitcode
                }, 
                success: function(response){
                    console.log(response); 
                    visiteRegistrate = response; 
                }, 
                error: function(error){
                    console.log(error); 
                }
            }); 
            location.reload(); 
        }
    }); 


    /**
    * Al momento di click del bottone 'Inserisci Visita' viene aggiunta una visita alle 
    * visite registrate, per poi essere mostrata nella lista sottostante. 
    */
    $('#add-visit-form').submit(function(event){
        event.preventDefault(); 

        var codice = $('#visit-code').val(); 
        var nome = $('#visit-name').val(); 
        var descrizione = $('#visit-description').val(); 
        var max_partecipanti = $('#visit-max_p').val(); 
        var durata = $('#visit-duration').val(); 
        var prezzo = $('#visit-price').val(); 
        var data = $('#visit-date').val(); 
        var punto_incontro = $('#visit-encounter').val(); 
        var guida = $('#guide-dropdown').val(); 

        addVisita(codice, nome, descrizione, max_partecipanti, durata, prezzo,
            data, punto_incontro, guida); 
    
        this.reset(); 
        location.reload();  
    }); 


    //Ora possiamo implementare le funzioni di add ed update utilizzate: 

    /**
    * Viene inviata una richiesta ajax popolata con il metodo PUT, 
    * passando al corpo il codice della visita, così da poterla 
    * identificare nel DB
    * @param {*} codice
    * @param {*} data
    */
    var updateDateVisita = function(codice, data) {
        $.ajax({
            url: '/visita/data', 
            type: 'PUT',
            dataType: 'json', 
            data: {
                codice: codice,
                data: data
            }, 
            success: function(response){
                console.log(response);
                visiteRegistrate = response;  
            }, 
            error: function(response){
                console.log(response); 
            }
        }); 
        location.reload(); 
    }

    /**
    * Viene inviata una richiesta ajax popolata con il metodo PUT, 
    * passando al corpo il codice della rivista, così da poterla 
    * identificare nel DB
    * @param {*} codice
    * @param {*} punto_incontro
    */
    var updateEncounterVisita = function(codice, punto_incontro) {
        $.ajax({
            url: '/visita/punto_incontro', 
            type: 'PUT', 
            dataType: 'json', 
            data: {
                codice: codice, 
                punto_incontro: punto_incontro
            }, 
            success: function(response){
                console.log(response); 
                visiteRegistrate = response; 
            }, 
            error: function(response){
                console.log(response); 
            }
        }); 
        location.reload(); 
    }

    /**
    * Post che permette la creazione ed il salvataggio nel DB di una nuova
    * visita.
    * @param {*} codice
    * @param {*} nome
    * @param {*} descrizione 
    * @param {*} max_partecipanti
    * @param {*} durata 
    * @param {*} prezzo 
    * @param {*} data 
    * @param {*} punto_incontro
    * @param {*} guida
    */
    var addVisita = function(codice, nome, descrizione, max_partecipanti, durata, prezzo,
        data, punto_incontro, guida) {
            var newVisita = {
                codice: codice, 
                nome: nome, 
                descrizione: descrizione, 
                max_partecipanti: max_partecipanti, 
                durata: durata, 
                prezzo: prezzo, 
                data: data, 
                punto_incontro: punto_incontro, 
                guida: guida
            }; 

        $.post("visita", newVisita, function(res){
            console.log(res); 
            visiteRegistrate = res; 
        }); 
    }

}



$(document).ready(function(){
    $.getJSON("/visita", function(visiteRegistrate){
        main(visiteRegistrate); 
    }); 
})



