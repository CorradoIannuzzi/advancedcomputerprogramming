var main = function(guideRegistrate){
    "use strict"

    var $guidelist = $('#guide-list'); 
    $guidelist.empty(); 

    guideRegistrate.forEach(function(guida){
        var $guideitem = $('<li>').addClass('guide-item'); 
        var $guideinfo = $('<div>').addClass('guide-info');  
        var $guidename = $('<h4>').text(guida.nome); 
        var $guidesurname = $('<h4>').text(guida.cognome); 
        var $guideid = $('<p>').text("ID: " + guida.id);
        var $guidebirth = $('<p>').text("Nato il: " + guida.birthdate); 
        var $guideemail = $('<p>').text("email: " + guida.email); 
        var $guidephone = $('<p>').text("telefono: " + guida.telefono); 
        var $guideplace = $('<p>').text("Specializzata in escursioni presso: " + guida.visita); 
        var $guidelen = $('<p>').text("lingua: " + guida.lingua); 
        var $deleteButton = $('<button type="button">').addClass('delete-button').text('Elimina');

        //Ora possiamo aggiungere gli elementi nel dom: 
        $guideinfo.append($guidename, $guidesurname, $guideid, $guidebirth, $guideemail, $guidephone, 
            $guideplace, $guidelen, $deleteButton); 
        $guideitem.append($guideinfo); 
        $guidelist.append($guideitem); 

        //Al bottone per l'eliminazione della guida viene associato come attributo il suo cognome e nome. 
        $deleteButton.attr('guide-id', guida.id);  
    }); 
 

    //Ora possiamo lavorare sulla select per le lingue: 
    const lingue = ["inglese", "spagnolo", "francese", "tedesco", "russo", "giapponese", "cinese"];    
    const selectLingue = document.getElementById('guide-drop'); 

    for(var i = 0; i < lingue.length; i++){
        var option = document.createElement("option"); 
        option.text = lingue[i]; 
        selectLingue.appendChild(option); 
    }


    /**
    * On click del bottone deleteButton permette di eliminare la visita guidata 
    * registrata.
    */
    $('.delete-button').on('click', function(event){
        var elimina = window.confirm("Sei sicuro?"); 

        if(elimina === true){
            var guideid = $(this).attr('guide-id');  

            $.ajax({
                url: '/guida', 
                type: 'DELETE', 
                dataType: 'json', 
                data: {
                    id: guideid
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


    $('#add-guide-form').submit(function(event){
        event.preventDefault(); 
        var guidaEsistente = false; 

        var id = $('#guide-id').val(); 
        var nome = $('#guide-name').val(); 
        var cognome = $('#guide-surname').val();  
        var birthdate = $('#guide-birth').val(); 
        var email = $('#guide-email').val(); 
        var telefono = $('#guide-phone').val(); 
        var visita = $('#guide-places').val(); 
        var lingua = $('#guide-len').val(); 

        guideRegistrate.forEach(guida =>{
            if (guida.id === id) 
                guidaEsistente = true; 
        }); 

        if(guidaEsistente === true) {
            window.alert("Cambiare codice ID!"); 
        } else if (email.indexOf("@") === -1) {
            window.alert("Mail non valida"); 
        } else if (email.indexOf(".com") === -1) {
            window.alert("Mail non valida"); 
        } else if (telefono.length != '10') {
            window.alert("Numero telefonico non valido"); 
        } else {
            addGuida(id, nome, cognome, birthdate, email, telefono, visita, lingua); 
            window.alert("Registrazione guida avvenuta"); 
            localStorage.setItem('id', id);

            this.reset(); 
            location.reload();
        } 
    }); 

    //Lavoriamo ora alla funzione di add, per l'inoltro di una post al database 
    /**
    * @param {*} id
    * @param {*} nome 
    * @param {*} cognome 
    * @param {*} birthdate 
    * @param {*} email 
    * @param {*} telefono 
    * @param {*} visita 
    * @param {*} lingua
    */
    var addGuida = function(id, nome, cognome, birthdate, email, telefono, visita, lingua){
        var newGuida = {
            id: id, 
            nome: nome, 
            cognome: cognome, 
            birthdate: birthdate, 
            email: email, 
            telefono: telefono, 
            visita: visita, 
            lingua: lingua
        }; 

        $.post("guida", newGuida, function(res){
            console.log(res);  
        }); 
    }
}

$(document).ready(function(){
    $.getJSON("/guida", function(guideRegistrate){
        main(guideRegistrate); 
    }); 
})