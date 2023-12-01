var main = function(listaInserzionisti){
    "use strict"; 

    var $loginform = $('#login-form'); 
    var $useraccedi = $('.user-accedi'); 
    var $passwordaccedi = $('.password-accedi'); 
    var $loginButtonAccedi = $('.login-button'); 
    var $registerButtonAccedi = $('#register-button'); 

    var $registerform = $('#register-form'); 
    var $idregistrati = $('.id-registrati'); 
    var $userregistrati = $('.user-registrati'); 
    var $passwordregistrati = $('.password-registrati'); 
    var $emailregistrati = $('.email-registrati'); 
    var $telefonoregistrati = $('.telefono-registrati'); 
    var $registerButtonRegistrati = $('.register-button'); 
    var $loginButtonRegistrati = $('#login-button'); 

    //Funzione per il passaggio dalla schermata di accesso a quella di registrazione
    $registerButtonAccedi.on('click', function(event) {
        $loginform.hide(); 
        $registerform.show(); 
    }); 

    //Funzione per passare dalla schermata di registrazione a quella di accesso
    $loginButtonRegistrati.on('click', function(event) {
        $registerform.hide(); 
        $loginform.show(); 
    }); 


    /**
     * Ora possiamo lavorare all'event listener che si occupa della fase di accesso
     * di un utente già esistente. Inserite le credenziali, controlla la corrispondenza
     * nel DB e trasferisce l'utente alla pagina per l'inserimento degli annunci.
     */
    $loginButtonAccedi.on('click', function(event) {
        var accessoEseguito = false; 
        var userAccess = $useraccedi.val(); 
        var passwordAccess = $passwordaccedi.val(); 

        listaInserzionisti.forEach(inserzionista => {
            if(inserzionista.username === userAccess && inserzionista.password == passwordAccess) {
                accessoEseguito = true; 
            }
        }); 

        if(accessoEseguito === false) {
            window.alert("User o Password errati"); 
        } else {
            localStorage.setItem('username', userAccess); 
            window.location.href = "gestione_annunci.html"; 
        }
    })

    /**
     * Funzione di registrazione, controlla i parametri e crea un nuovo documento inserzionista
     * nel DB, conetenente i dati inseriti.
     */
    $registerButtonRegistrati.on('click', function(event) {
        var utenteEsistente = false; 

        var idRegistrati = $idregistrati.val(); 
        var userRegistrati = $userregistrati.val(); 
        var passwordRegistrati = $passwordregistrati.val(); 
        var emailRegistrati = $emailregistrati.val(); 
        var telefonoRegistrati = $telefonoregistrati.val(); 

        listaInserzionisti.forEach(inserzionista => {
            if(inserzionista.username === userRegistrati || inserzionista.identificativo === idRegistrati)
                utenteEsistente = true; 
        }); 

        if(utenteEsistente === true) {
            window.alert("Esiste già un utente con tale user/id!"); 
        } else if (userRegistrati.lenght > 30) {
            window.alert("User troppo lungo"); 
        } else if (passwordRegistrati.lenght < 8 || passwordRegistrati.lenght > 16) {
            window.alert("La password deve contenere tra gli 8 ed i 16 caratteri"); 
        } else if (!emailRegistrati.includes("@") && !emailRegistrati.includes(".com")) {
            window.alert("Email utente non valida"); 
        } else if (telefonoRegistrati.lenght < 10) {
            window.alert("Il numero inserito deve contenere 10 cifre"); 
        } else {
            registraInserzionista(idRegistrati, userRegistrati, passwordRegistrati, emailRegistrati, telefonoRegistrati); 
            window.alert("Registrazione avvenuta!"); 
            window.location.href = "gestione_annunci.html"; 
        }
    })


    /**
     * Effettiva funzione di registrazione
     * @param {*} identificativo 
     * @param {*} username
     * @param {*} password
     * @param {*} mail
     * @param {*} telefono
     */
    var registraInserzionista = function(identificativo, username, password, mail, telefono) {
        var newInserzionista = {
            identificativo: identificativo, 
            username: username, 
            password: password, 
            mail: mail, 
            telefono: telefono
        }

        $.post('inserzionisti', newInserzionista, function(res) {
            console.log(res); 
        })
    }

}


$(document).ready(function() {
    $.getJSON("/inserzionisti", function(listaInserzionisti) {
        main(listaInserzionisti); 
    })
})