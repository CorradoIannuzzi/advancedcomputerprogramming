var main = function(listaClienti){
    "use strict"; 

    var $loginform = $('#login-form'); 
    var $useraccedi = $('.user-accedi'); 
    var $passwordaccedi = $('.password-accedi'); 
    var $loginButtonAccedi = $('.login-button'); 
    var $registerButtonAccedi = $('#register-button'); 

    var $registerform = $('#register-form'); 
    var $userregistrati = $('.user-registrati'); 
    var $passwordregistrati = $('.password-registrati'); 
    var $nomeUtente = $('.nome-utente-registrati'); 
    var $cognomeUtente = $('.cognome-utente-registrati'); 
    var $emailUtente = $('.email-utente-registrati'); 
    var $indirizzoUtente = $('.indirizzo-utente-registrati'); 
    var $telefonoUtente = $('.telefono-utente-registrati')
    var $registerButtonRegistrati = $('.register-button'); 
    var $loginButtonRegistrati = $('#login-button'); 

    //funzione per passare dalla schermata di accesso a quella di registrazione
    $registerButtonAccedi.on('click', function(event) {
        $loginform.hide();
        $registerform.show();
    });

    //funzione per passare dalla schermata di registrazione a quella di accesso
    $loginButtonRegistrati.on("click", function(event) {
        $registerform.hide(); 
        $loginform.show(); 
    }); 

    /**
     * Ora possiamo lavorare all'event listener che si occupa della fase di accesso di 
     * un utente già esistente. Inserite le credenziali, e controllata la loro 
     * corrispondenza in DB, si viene trasferiti alla pagina per la prenotazione delle 
     * visite. 
     */
    $loginButtonAccedi.on('click', function(event) {
        var accessoEseguito = false; 
        var userAccess = $useraccedi.val(); 
        var passwordAccess = $passwordaccedi.val(); 
        
        listaClienti.forEach(cliente => {
            if(cliente.user === userAccess && cliente.password === passwordAccess) {
                accessoEseguito = true; 
            }
        }); 

        if(accessoEseguito === false) {
            window.alert("User o Password errati"); 
        } else {
            localStorage.setItem('user', userAccess); 
            window.location.href = "prenotazioni.html"; 
        }

    })


    /**
     * Funzione di registrazione, controllati i parametri passati, viene creato 
     * un nuovo documento turista nel db contenente i dati inseriti. 
     */
    $registerButtonRegistrati.on('click', function(event) {
        var utenteEsistente = false; 

        var userRegistrati = $userregistrati.val(); 
        var passwordRegistrati = $passwordregistrati.val(); 
        var nomeCliente = $nomeUtente.val(); 
        var cognomeCliente = $cognomeUtente.val();  
        var emailUtente = $emailUtente.val(); 
        var indirizzoUtente = $indirizzoUtente.val(); 
        var telefonoUtente = $telefonoUtente.val(); 

        listaClienti.forEach(cliente =>{
            if(cliente.user === userRegistrati)
                utenteEsistente = true; 
        }); 

        if (utenteEsistente === true) {
            window.alert("Esiste già un utente con tale user, riprova."); 
        } else if (userRegistrati.length > 30) {
            window.alert("User scelto troppo lungo."); 
        } else if (passwordRegistrati.length < 8 || passwordRegistrati.length > 16) {
            window.alert("La password deve contenere minimo 8 caratteri e massimo 16."); 
        } else if (nomeCliente.length > 30) {
            window.alert("Nome cliente troppo lungo"); 
        } else if (cognomeCliente.length > 30) {
            window.alert("Cognome cliente troppo lungo"); 
        } else if (!emailUtente.includes("@") && !emailUtente.includes(".com")) {
            window.alert("Email utente non valida"); 
        } else {
            registraCliente(userRegistrati, passwordRegistrati, nomeCliente, cognomeCliente, emailUtente, indirizzoUtente, telefonoUtente); 
            window.alert("Registrazione avvenuta!"); 

            localStorage.setItem('user', userRegistrati); 
            window.location.href = 'prenotazioni.html'; 
        }

    })

    /**
     * Effettiva funzione di registrazione. 
     * @param {*} user
     * @param {*} password
     * @param {*} nome 
     * @param {*} cognome 
     * @param {*} email 
     * @param {*} telefono
     * @param {*} indirizzo
     */
    var registraCliente = function(user, password, nome, cognome, email, telefono, indirizzo){
        var newCliente = {
            user: user, 
            password: password, 
            nome: nome, 
            cognome: cognome, 
            email: email, 
            indirizzo: indirizzo, 
            telefono: telefono
        }

        $.post('clienti', newCliente, function(res) {
            console.log(res); 
        })
    }

}


$(document).ready(function() {
    $.getJSON("/clienti", function(listaClienti) {
        main(listaClienti); 
    })
})