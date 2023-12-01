/**
 * Si inseriscono i codici js per l'inserimento degli hyperlinks associati ai bottoni 
 * della pagina. 
 */


var main = function() {
    "use strinct"; 

    $('#gestione-visite').on('click', function(event){
        window.location.href = "gestione-visite.html"; 
    }); 

    $('#gestione-guide').on('click', function(event){
        window.location.href = "gestione-guide.html"; 
    }); 

}

$(document).ready(main); 