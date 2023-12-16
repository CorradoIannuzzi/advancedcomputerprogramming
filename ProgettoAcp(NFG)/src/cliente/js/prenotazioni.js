
var main = function(prenotazioniRegistrate, animatori) {
    "use strict"; 

    var $reservelist = $('#reserve-list'); 
    $reservelist.empty(); 

    prenotazioniRegistrate.forEach(function(prenotazione) {
        var $reserveitem = $('<li>').addClass('reserve-item'); 
        var $reserveinfo = $('<div>').addClass('reserve-info');  
        var $reserveID = $('h4').text("Prenotazione " + prenotazione.id); 
        var $monitor = $('<h3>').text("Animatore: " + prenotazione.animatore); 
        var $r_special = $('<p>').text("Specialità richiesta: " + prenotazione.r_special); 
        var $reserveDate = $('<p>').text("Data: " + prenotazione.giorno); 
        var $reserveAddress = $('<p>').text("Indirizzo: " + prenotazione.indirizzo); 
        var $deleteButton = $('<button>').addClass('delete-button').text("Elimina");
 
    //Ai diversi bottoni viene associato il codice della prenotazione, così da andare a modificare solo quest'ultimo: 
    $deleteButton.attr('reserveID', prenotazione.id);  
    
    //Ora aggiungiamo gli elementi nel dom: 
    $reserveinfo.append($reserveID, $monitor, $r_special, $reserveDate, $reserveAddress, $deleteButton); 
    $reserveitem.append($reserveinfo); 
    $reservelist.append($reserveitem, $deleteButton); 
    });


    const $selectAnimatori = $('#monitor-dropdown');
    function refreshAnimatori() {
        $selectAnimatori.empty();
    
        $.ajax({
            url: '/animatori', 
            method: 'GET',
            dataType: 'json',
            success: function (animatori) {
                animatori.forEach(animatore => {
                    $selectAnimatori.append($('<option>', {
                        value: animatore.nome, 
                        text: "Animatore " + animatore.nome
                    }));
                });
            },
            error: function (error) {
                console.error('Errore durante il recupero degli animatori:', error);
            }
        });
    }
    refreshAnimatori(); 

    const specialities = ["clown", "prestidigitazione", "giochi"]; 
    const selectspecial = $('#special-dropdown'); 
    for(var i = 0; i < specialities.length; i++) {
        var option = document.createElement("option"); 
        option.text = specialities[i]; 
        selectspecial.append(option); 
    }

    /**
    * On click del bottone deleteButton permette di eliminare la prenotazione registrata.
    */
    $('.delete-button').on('click', function(event){
        var elimina = window.confirm("Sei sicuro?"); 

        if(elimina === true){
            var reservecode = $(this).attr('reserveID'); 

            $.ajax({
                url: '/prenotazioni', 
                type: 'DELETE', 
                dataType: 'json', 
                data: {
                    id: reservecode
                }, 
                success: function(response){
                    console.log(response); 
                    prenotazioniRegistrate = response; 
                }, 
                error: function(error){
                    console.log(error); 
                }
            }); 
            location.reload(); 
        }
    }); 


    /**
    * Al momento di click del bottone 'Aggiungi Prenotazione' viene aggiunta una prenotazione alle 
    * prenotazioni registrate, per poi essere mostrata nella lista sottostante. 
    */
    $('#add-reservation-form').submit(function(event){
        event.preventDefault(); 
 
        var monitor = $('#monitor-dropdown').val(); 
        var r_special = $('#special-dropdown').val(); 
        var reservedate = $('#reserve-date').val(); 
        var reserveaddress = $('#reserve-address').val(); 

        addPrenotazione(monitor, r_special, reservedate, reserveaddress); 

        this.reset(); 
        location.reload();  
    }); 


    //Ora possiamo implementare le funzioni di add ed update utilizzate: 

    /**
    * Post che permette la creazione ed il salvataggio nel DB di una nuova
    * prenotazione.
    * @param {*} animatore
    * @param {*} r_special 
    * @param {*} giorno
    * @param {*} indirizzo 
    */
    var addPrenotazione = function(animatore, r_special, giorno, indirizzo) {
            var newPrenotazione = {
                animatore: animatore, 
                r_special: r_special, 
                giorno: giorno, 
                indirizzo: indirizzo
            }; 

        $.post("prenotazioni", newPrenotazione, function(res){
            console.log(res); 
            prenotazioniRegistrate = res; 
        }); 
    }

}



$(document).ready(function(){
    $.getJSON("/prenotazioni", function(prenotazioniRegistrate){
        $.getJSON("/animatori", function(animatori) {
            main(prenotazioniRegistrate, animatori)
        }); 
    }); 
})


