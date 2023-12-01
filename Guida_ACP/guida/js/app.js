/**
 * implementazione del servizio di inserimento dei giorni
 * di disponibilità di una guida.
 * @param {Number} id
 * @param {Date} giorni_disp 
 */

var main = function() {
    
    $('#register-guide').submit(function(event){ 
        event.preventDefault();

        var id = $('#id').val();
        var giorni_disp = $('#data').val();  

        $.ajax({
            url: '/guida/giorni_disp', 
            type: 'PUT', 
            dataType: 'json', 
            data: {
                id: id,
                giorni_disp: giorni_disp
            }, 
            success: function(response){
                console.log("Data salvata con successo! ", response); 
            }, 
            error: function(response){
                console.log(response); 
            }
        });  
    }); 

}

$(document).ready(main); 