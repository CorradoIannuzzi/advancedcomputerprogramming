var main = function(listaTuristi){
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
        
        listaTuristi.forEach(turista => {
            if(turista.user === userAccess && turista.password === passwordAccess) {
                accessoEseguito = true; 
            }
        }); 

        if(accessoEseguito === false) {
            window.alert("User o Password errati"); 
        } else {
            localStorage.setItem('user', userAccess); 
            window.location.href = "visite.html"; 
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
        var nomeTurista = $nomeUtente.val(); 
        var cognomeTurista = $cognomeUtente.val();  
        var emailUtente = $emailUtente.val(); 

        listaTuristi.forEach(turista =>{
            if(turista.user === userRegistrati)
                utenteEsistente = true; 
        }); 

        if (utenteEsistente === true) {
            window.alert("Esiste già un utente con tale user, riprova."); 
        } else if (userRegistrati.length > 30) {
            window.alert("User scelto troppo lungo."); 
        } else if (passwordRegistrati.length < 8 || passwordRegistrati.length > 16) {
            window.alert("La password deve contenere minimo 8 caratteri e massimo 16."); 
        } else if (nomeTurista.length > 30) {
            window.alert("Nome cliente troppo lungo"); 
        } else if (cognomeTurista.length > 30) {
            window.alert("Cognome cliente troppo lungo"); 
        } else if (!emailUtente.includes("@") && !emailUtente.includes(".com")) {
            window.alert("Email utente non valida"); 
        } else {
            registraTurista(userRegistrati, passwordRegistrati, nomeTurista, cognomeTurista, emailUtente); 
            window.alert("Registrazione avvenuta!"); 

            localStorage.setItem('user', userRegistrati); 
            window.location.href = 'visite.html'; 
        }

    })

    /**
     * Effettiva funzione di registrazione. 
     * @param {string} user
     * @param {string} password
     * @param {string} nome 
     * @param {string} cognome 
     * @param {string} email 
     */
    var registraTurista = function(user, password, nome, cognome, email){
        var newTurista = {
            user: user, 
            password: password, 
            nome: nome, 
            cognome: cognome, 
            email: email
        }

        $.post('turisti', newTurista, function(res) {
            console.log(res); 
        })
    }

}


$(document).ready(function() {
    $.getJSON("/turisti", function(listaTuristi) {
        main(listaTuristi); 
    })
})