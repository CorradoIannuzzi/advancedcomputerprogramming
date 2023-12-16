var main = function(animatoriRegistrati) {
    "use strict"; 

    var $monitorlist = $('#monitor-list'); 
    $monitorlist.empty(); 

    animatoriRegistrati.forEach(function(animatore) {
        var $monitoritem = $('<li>').addClass('monitor-item'); 
        var $monitorinfo = $('<div>').addClass('monitor-info'); 
        var $monitorimage = $('<img>').attr('src', animatore.foto).attr('alt', animatore.nome); 

        var $monitorname = $('<h4>').text("Animatore: " + animatore.nome + " " + animatore.cognome); 
        var $monitorid = $('<h4>').text("Identificativo: " + animatore.id); 
        var $monitorphone = $('<p>').text("Telefono: " + animatore.telefono); 
        var $monitormail = $('<p>').text("Email: " + animatore.mail); 
        var $monitorspecial = $('<p>').text("Specialità: " + animatore.special); 

        var $deletebutton = $('<button>').addClass('delete-button').text("Elimina"); 
        var $updateSpecialbutton = $('<button>').addClass('update-special-button').text("Modifica specialità"); 

        //Ai bottoni bisogna associare il codice dell'animatore: 
        $deletebutton.attr('monitor-id', animatore.id); 
        $updateSpecialbutton.attr('monitor-id', animatore.id); 

        //Aggiungiamo gli elementi al DOM: 
        $monitorinfo.append($monitorname, $monitorid, $monitorphone, $monitormail, $monitorspecial, $monitorimage); 
        $monitoritem.append($monitorinfo); 
        $monitorlist.append($monitoritem, $deletebutton, $updateSpecialbutton); 
    }); 

    //Lavoriamo ora alla select, menu a tendina per la scelta della specialità dell'animatore: 
    const specialities = ["clown", "prestidigitazione", "giochi"]; 
    const selectspecial = $('#special-dropdown'); 
    for(var i = 0; i < specialities.length; i++) {
        var option = document.createElement("option"); 
        option.text = specialities[i]; 
        selectspecial.append(option); 
    }

    //Ora lavoriamo al deletebutton per il licenziamento di un animatore dalla lista: 
    $('.delete-button').on('click', function(event) {
        var elimina = window.confirm("Sei sicuro?"); 

        if(elimina === true) {
            var monitorID = $(this).attr('monitor-id'); 

            $.ajax({
                url: '/animatori', 
                type: 'DELETE', 
                dataType: 'json', 
                data: {
                    id: monitorID
                }, 
                success: function(response) {
                    console.log(response); 
                    animatoriRegistrati = response; 
                }, 
                error: function(error) {
                    console.log(error); 
                }
            }); 
            location.reload(); 
        }
    });   
    
    $('.update-special-button').on('click', function(event) {
        var modifica = window.confirm("Sei sicuro?");
        if(modifica === true) {
            var newSpecial = window.prompt("Inserisci una nuova specialità tra 'clown', 'prestidigitazione' o 'giochi'"); 
            var id = $(this).attr('monitor-id');
            updateSpecialmonitor(id, newSpecial);
        }
    });

    $('#add-monitor-form').submit(function(event) {
        event.preventDefault();

        var name = $('#monitor-name').val();
        var surname = $('#monitor-surname').val(); 
        var phone = $('#monitor-phone').val(); 
        var mail = $('#monitor-mail').val(); 
        var special = $('#special-dropdown').val(); 

        addAnimatore(name, surname, phone, mail, special); 
        this.reset(); 
        location.reload(); 
    }); 

    /**
     * Viene inviata una richiesta ajax, popolata con il metodo PUT, passando al corpo
     * il codice dell'animatore
     * @param {*} id
     * @param {*} special
     */
    var updateSpecialmonitor = function(id, special) {
        $.ajax({
            url: '/animatori/special', 
            type: 'PUT', 
            dataType: 'json', 
            data : {
                id: id, 
                special: special
            }, 
            success: function(response) {
                console.log(response); 
                animatoriRegistrati = response; 
            }, 
            error: function(error) {
                console.log(error); 
            }
        }); 
        location.reload(); 
    }

    /**
     * Post che permette l'inserimento di un nuovo animatore nel database
     * @param {*} nome
     * @param {*} cognome
     * @param {*} telefono
     * @param {*} mail
     * @param {*} special
     */
    var addAnimatore = function(nome, cognome, telefono, mail, special) {
        var newAnimatore = {
            nome: nome, 
            cognome: cognome, 
            telefono: telefono, 
            mail: mail, 
            special: special
        }; 

        $.post("animatori", newAnimatore, function(res) {
            console.log(res); 
            animatoriRegistrati = res; 
        }); 
    }
}

$(document).ready(function() {
    $.getJSON("/animatori", function(animatoriRegistrati) {
        main(animatoriRegistrati); 
    });
})