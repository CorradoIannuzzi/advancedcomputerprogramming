var main = function(proposte) {
    "use strict"

    var $proposalList = $('#proposal'); 
    $proposalList.empty(); 

    proposte.forEach(function(proposta) {

        var $propostaitem = $('<li>').addClass('proposal-item'); 
        var $propostainfo = $('<div>').addClass('proposal-info'); 
        var $proposal = $('<p>').text("Proposta: " + proposta.proposta); 


        $propostainfo.append($proposal); 
        $propostaitem.append($propostainfo); 
        $proposalList.append($propostaitem); 
    }); 

}

$(document).ready(function() {
    $.getJSON("/proposta", function(proposte) {
        main(proposte); 
    }); 
})