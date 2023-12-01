var main = function(proposte) {

    $('#send-proposal').on('click', function(event) {
        var proposta = $('#proposal-text').val(); 

        addProposal(proposta); 
        window.alert("Proposta inviata all'amministratore");  
        location.reload(); 

    }); 

    /**
     * La funzione per la post:
     * @param {*} proposta 
     */
    var addProposal = function(proposta){
        var newProposal = {
            proposta: proposta
        }; 

        $.post("proposta", newProposal, function(res){
            console.log(res); 
        }); 
    }

}

$(document).ready(function() {
    $.getJSON("/proposta", function(proposte) {
        main(proposte); 
    }); 
})