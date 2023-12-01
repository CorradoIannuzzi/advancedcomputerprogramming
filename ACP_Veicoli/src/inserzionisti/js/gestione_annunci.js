var main = function(annunciRegistrati) {
    "use strict"; 

    var $announcelist = $('#announce-list'); 
    $announcelist.empty(); 

    annunciRegistrati.forEach(function(annuncio) {
        var $announceItem = $('<li>').addClass('announce-item'); 
        var $announceInfo = $('<div>').addClass('announce-info');
        var $announceImage = $('<img>').attr('src', annuncio.immagine).attr('alt', annuncio.nome); 

        var $announceName = $('<h4>').text("Veicolo: " + annuncio.nome);  
        var $insertionistID = $('<h5>').text("Inserzionista: " + annuncio.inserzionista); 
        var $announceID = $('<p>').text("Codice: " + annuncio.id); 
        var $announceDate = $('<p>').text("Data di inserimento: " + annuncio.data_inserimento); 
        var $announcePlace = $('<p>').text("Città in cui si trova il veicolo: " + annuncio.luogo_veicolo); 
        var $announceCategory = $('<p>').text("Categoria veicolo: " + annuncio.categoria); 
        var $announceType = $('<p>').text("Tipo veicolo: " + annuncio.tipologia); 
        var $announceKm = $('<p>').text("Chilometraggio: " + annuncio.chilometraggio); 
        var $announceDescription = $('<p>').text("Descrizione: " + annuncio.descrizione); 
        var $announcePrice = $('<p>').text("Prezzo: " + annuncio.prezzo); 
        var $deleteButton = $('<button>').addClass('delete-button').text('Elimina'); 
        var $updatePriceButton = $('<button>').addClass('update-price-button').text('Modifica Prezzo'); 
        var $updatePlaceButton = $('<button>').addClass('update-place-button').text('Modifica sede veicolo');   

        
        //Ai diversi bottoni viene associato il codice dell'annuncio: 
        $deleteButton.attr('announce-id', annuncio.id); 
        $updatePriceButton.attr('announce-id', annuncio.id); 
        $updatePlaceButton.attr('announce-id', annuncio.id); 

        //Ora aggiungiamo gli elementi nel dom: 
        $announceInfo.append($announceName, $insertionistID, $announceID, $announceDate, $announcePlace,
            $announceCategory, $announceType, $announceKm, $announceDescription, $announcePrice, $announceImage,
            $deleteButton, $updatePriceButton, $updatePlaceButton); 
        $announceItem.append($announceInfo); 
        $announcelist.append($announceItem, $deleteButton, $updatePriceButton, $updatePlaceButton); 
    }); 

    /**
     * Lavoriamo ora alle select, avremo due menu a tendina dove compariranno le categorie disponibili
     * di veicolo ed il tipo (automobile o meno)
     */
    const categorie = ["Moto", "Auto"]; 
    const selectCategoria = $('#category-dropdown');
    for(var i = 0; i < categorie.length; i++) {
        var option = document.createElement("option"); 
        option.text = categorie[i]; 
        selectCategoria.append(option); 
    }

    const tipologie = ["Nuovo", "Usato"]; 
    const selectTipologia = $('#type-dropdown'); 
    for(var i = 0; i < tipologie.length; i++) {
        var option = document.createElement("option"); 
        option.text = tipologie[i]; 
        selectTipologia.append(option); 
    }

    //Ora lavoriamo al delete button per l'eliminazione dell'annuncio
    $('.delete-button').on('click', function(event){
        var elimina = window.confirm("Sei sicuro?"); 

        if(elimina === true){
            var announceID = $(this).attr('announce-id'); 

            $.ajax({
                url: '/veicoli', 
                type: 'DELETE', 
                dataType: 'json', 
                data: {
                    id: announceID
                }, 
                success: function(response) {
                    console.log(response); 
                    annunciRegistrati = response; 
                }, 
                error: function(error) {
                    console.log(error); 
                }
            }); 
            location.reload(); 
        }
    }); 

    //Questi sono invece gli event listener associati ai bottoni per la modifica: 
    $('.update-price-button').on('click', function(event) {
        var modifica = window.confirm("Sei sicuro?"); 
        if(modifica === true) {
            var newPrice = window.prompt("Inserisci il nuovo prezzo"); 
            var id = $(this).attr('announce-id'); 
            updatePrezzoAnnuncio(id, newPrice); 
        }
    }); 

    $('.update-place-button').on('click', function(event){
        var modifica = window.confirm("Sei sicuro?"); 
        if(modifica === true) {
            var newPlace = window.prompt("Inserisci il nuovo luogo"); 
            var id = $(this).attr('announce-id'); 
            updatePlaceAnnuncio(id, newPlace); 
        }
    }); 

    /**
     * Al momento del click sul bottone "Inserisci Annuncio" viene aggiunta una visita alle 
     * visite registrate, per poi essere mostrata nella lista sottostante. 
     */ 
    $('#add-announce-form').submit(function(event){
        event.preventDefault(); 

        var inserzionista = $('#inserzionista-id').val(); 
        var nome = $('#announce-name').val(); 
        var data_inserimento = $('#announce-date').val(); 
        var luogo_veicolo = $('#announce-place').val(); 
        var categoria = $('#category-dropdown').val(); 
        var tipologia = $('#type-dropdown').val(); 
        var chilometraggio = $('#announce-km').val(); 
        var descrizione = $('#announce-description').val(); 
        var prezzo = $('#announce-price').val(); 

        addAnnuncio(inserzionista, nome, data_inserimento, luogo_veicolo, categoria, 
            tipologia, chilometraggio, descrizione, prezzo); 
        
        this.reset(); 
        location.reload(); 
    }); 

    //Ora implementiamo le funzioni di add ed update utilizzate, saranno delle semplici ajax

    /**
     * Viene inviata una richiesta ajax, popolata con il meotodo PUT, passando al corpo il 
     * codice dell'annuncio, così da poterlo identificare nel db.
     * @param {*} id
     * @param {*} prezzo 
     */
    var updatePrezzoAnnuncio = function(id, prezzo) {
        $.ajax({
            url: '/veicoli/prezzo', 
            type: 'PUT', 
            dataType: 'json', 
            data: {
                id : id, 
                prezzo: prezzo
            }, 
            success: function(response){
                console.log(response); 
                annunciRegistrati = response; 
            }, 
            error: function(error){
                console.log(error); 
            }
        }); 
        location.reload(); 
    }


    /**
     * Viene inviata una richiesta ajax popolata con il metodo PUT, 
     * passando al corpo il codice dell'annuncio, così da poterlo identificare 
     * nel db.
     * @param {*} id 
     * @param {*} luogo_veicolo 
     */
    var updatePlaceAnnuncio = function(id, luogo_veicolo) {
        $.ajax({
            url: '/veicoli/luogo_veicolo', 
            type: 'PUT', 
            dataType: 'json', 
            data: {
                id: id, 
                luogo_veicolo: luogo_veicolo
            }, 
            success: function(response){
                console.log(response); 
                annunciRegistrati = response; 
            }, 
            error: function(error) {
                console.log(error);
            }
        }); 
        location.reload(); 
    }

    /**
     * Post che permette la creazione ed il salvataggio nel DB di una nuova 
     * visita. 
     * @param {*} inserzionista 
     * @param {*} nome 
     * @param {*} data_inserimento 
     * @param {*} luogo_veicolo
     * @param {*} categoria 
     * @param {*} tipologia 
     * @param {*} chilometraggio 
     * @param {*} descrizione 
     * @param {*} prezzo
     */
    var addAnnuncio = function(inserzionista, nome, data_inserimento, luogo_veicolo, categoria, 
        tipologia, chilometraggio, descrizione, prezzo) {
            var newAnnuncio = {
                inserzionista: inserzionista,
                nome: nome, 
                data_inserimento: data_inserimento, 
                luogo_veicolo: luogo_veicolo, 
                categoria: categoria, 
                tipologia: tipologia, 
                chilometraggio: chilometraggio, 
                descrizione: descrizione, 
                prezzo: prezzo
            }; 

        $.post("veicoli", newAnnuncio, function(res){
            console.log(res); 
            annunciRegistrati = res;         
        }); 
    }

}

$(document).ready(function(){
    $.getJSON("/veicoli", function(annunciRegistrati){
        main(annunciRegistrati); 
    }); 
})