var main = function(prenotazioni, visiteRegistrate) {
    "use strict"; 

    var nomeUtente = localStorage.getItem('user'); 

    var totaleCarrello = 0; 

    var $visitlist = $('#visit-list'); 

    var $main = $('<main>'); 
    var $welcome = $('<h3>').text('Benvenuto ' + nomeUtente); 
    $main.prepend($welcome); 

    //Ora definiamo un array che conterrà le visite in prenotazione 
    var visiteCarrello = []; 

    //Un array che conterrà le informazioni sul carrello, quali costo delle visite, per il calcolo del totale. 
    var infoCarrello = []; 

    /**
     * Ora lavoreremo ad una funzione che permetterà ad un turista che ha effettuato
     * l'accesso di creare un nuovo carrello con le prenotazioni o di recuperare uno 
     * già in corso
     * @param {*} nomeUtente
     * @param {*} prenotazioni
     * @returns
     */
    var inizializzaPrenotazione = function(nomeUtente, prenotazioni){

        var prenotazioneInCorso = prenotazioni.find(p => p.user_turista === nomeUtente && p.stato[0] === 'IN_CORSO'); 

        if (prenotazioneInCorso === undefined) {
            var newPrenotazione = {
                stato: ['IN_CORSO'], 
                user_turista: nomeUtente
            }

            $.post('prenotazione', newPrenotazione, function(res) {
                console.log(res); 
            }); 

        }

        return prenotazioneInCorso; 

    }

    /**
     * Funzione per il calcolo del costo totale del carrello
     * in base alle prenotazioni aggiunte/tolte
     */
    var calcoloNuovoTotale = function() {
        var temp = 0; 

        infoCarrello.forEach(v => {
            temp += v.prezzo; 

        }); 

        totaleCarrello = temp; 

        $('#costo-totale').text('Costo Carrello: ' + totaleCarrello + '€'); 
    }


    var prenotazioneInCorso = inizializzaPrenotazione(nomeUtente, prenotazioni); 

    /**
     * Ora lavoriamo al recupero delle informazioni delle prenotazioni in corso, da parte di utenti che hanno 
     * inserito delle visite nel carrello, ma non hanno effettuato il checkout
     */
    if (prenotazioneInCorso !== undefined) {

        prenotazioneInCorso.visite.forEach(visita => {
            var elementoCarrello = visiteRegistrate.find(v => v.codice === visita.codice); 

            visiteCarrello.push(elementoCarrello); 

            console.log(visiteCarrello); 

            var infoVisita = {
                codice: elementoCarrello.codice, 
                prezzo: elementoCarrello.prezzo
            }

            infoCarrello.push(infoVisita); 

            console.log(infoCarrello); 

            //Aggiungiamo ora le visite al carrello: 
            var $itemName = $('<h5>').addClass('item-name').text(visita.nome); 
            var $item = $('<li>').attr('item-list-id', visita.codice); 
            var $cartItems = $('#cart-items'); 
            $item.append($itemName); 
            $cartItems.append($item); 

        })

        calcoloNuovoTotale(); 

    }

    
    /**
     * Ora lavoriamo alla visualizzazione di tutte le visite registrate
     * nel database. 
     */
    visiteRegistrate.forEach(visita => {
        var $visit = $('<div>').addClass('visit'); 
        
        var $visitdetails = $('<div>').addClass('visit-details'); 
        var $visitname = $('<h3>').addClass('visit-name').text(visita.nome); 
        var $visitdescription = $('<p>').text("Descrizione: " + visita.descrizione); 
        var $visitdurate = $('<p>').text("Durata oraria: " + visita.durata); 
        var $visitprice = $('<p>').text("Prezzo: " + visita.prezzo + "€"); 
        var $visitdate = $('<p>').text("Data: " + visita.data); 
        var $visitencounter = $('<p>').text("Punto di incontro: " + visita.punto_incontro); 
        var $visitguide = $('<p>').text("Identificativo Guida: " + visita.guida); 
        var $addbutton = $('<button>').addClass('add-button').text('Aggiungi al carrello'); 
        var $removebutton = $('<button>').addClass('remove-button').text('Rimuovi'); 

        /**
         * Ad ogni bottone viene assegnato l'id della visita come attributo:
         */
        $addbutton.attr('visit', visita); 
        $removebutton.attr('visit', visita); 

        $visitdetails.append($visitname, $visitdescription, $visitdurate, $visitprice, $visitdate, 
            $visitencounter, $visitguide, $addbutton, $removebutton); 
        $visit.append($visitdetails); 

        $visitlist.append($visit); 
    }); 

    /**
     * Quando avviene un click sul buttone addbutton, la visita selezionata viene aggiunta 
     * al carrello del turista: 
     */
    $('.add-button').on('click', function(event) {
        var visita = $(this).data();

        if(visiteCarrello.includes(visita) === false) {
            var $itemName = $('<h4>').addClass('item-name').text(visita.nome); 
            var $item = $('<li>').attr('item-list-id', visita.codice); 
            var $cartItems = $('#cart-items'); 
            $item.append($itemName); 
            $cartItems.append($item); 

            insertInfoCarrello(visita); 

            calcoloNuovoTotale(); 

            visiteCarrello.push(visita); 
        } else {
            window.alert("Visita già presente nel carrello!"); 
        }
    });

    /**
     * Eliminazione di una visita dal carrello mediante il suo codice:
     */
    $('.remove-button').on('click', function(event) {
        var visita = $(this).data(); 

        if(visiteCarrello.includes(visita) === true) {
            var $item = $("[item-list-id|= " + visita.codice + "]"); 
            $item.remove();
            
            removeInfoCarrello(visita); 

            var index = visiteCarrello.indexOf(visita); 

            visiteCarrello.splice(index, 1); 
        }

    }); 


    /**
     * Inserisce le informazioni di una nuova visita nel carrello: 
     * @param {*} visita
     */
    var insertInfoCarrello = function(visita) {
        var newVisita = {
            codice: visita.codice, 
            nome: visita.nome, 
            descrizione: visita.descrizione
        }

        infoCarrello.push(newVisita); 

        console.log(infoCarrello); 
    }

    /**
     * Permette la rimozione di una visita dal carrello:
     * @param {*} visita
     */
    var removeInfoCarrello = function(visita) {
        var oldVisita = infoCarrello.find(v => v.codice === visita.codice); 

        var index = infoCarrello.indexOf(oldVisita); 

        infoCarrello.splice(index, 1); 
    }


    /**
     * Funzione di checkout, server per aggiungere una nuova prenotazione nel database
     * contenente chi ha effettuato la prenotazione e le visite prenotate:
     */
    $('#checkout-button').on('click', function(event) {
        if(infoCarrello.length > 0) {
            var ans = window.confirm("Confermi il carrello?"); 
            var i = 0; 

            if (ans === true) {
                i++; 
                var NewPrenotazione = {
                    id_prenotazione: Math.floor(Math.random() * 100) + 1,
                    user_turista: nomeUtente, 
                    visite: [], 
                    stato: ['IN_CORSO'], 
                    costoTotale: totaleCarrello 
                }

                visiteCarrello.forEach(visita => {
                    var visitInfo = infoCarrello.find(v => v.codice === visita.codice); 

                    var acquisto = {
                        codice: visita.codice, 
                        nome: visita.nome, 
                        descrizione: visita.descrizione
                    }

                    NewPrenotazione.visite.push(acquisto); 

                }); 

                $.post('prenotazione/in_corso', NewPrenotazione, function(res) {
                    console.log(res); 
                })


                window.alert("Prenotazione effettuata!"); 
            }
        } else {
            window.alert("Il carrello è vuoto"); 
        }
    })

}


$(document).ready(function() {
    $.getJSON("/prenotazione", function(prenotazioni) {
        $.getJSON("/visita", function(visiteRegistrate) {
            main(prenotazioni, visiteRegistrate); 
        }); 
    }); 
})