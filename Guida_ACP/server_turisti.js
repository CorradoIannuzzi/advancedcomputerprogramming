/**
 * Importazione dei moduli express, http e mongoose per realizzare il server del cliente:
 * 1) express serve per fornire file statici (html, css, javascript) popolare gli header delle richieste http ed interagire con il DB
 * 2) http serve per effettuare le operazioni CRUD come post, get...
 * 3) mongoose serve per interfacciarsi con MongoDB, ci consente di connetterci al DB, di creare schemi di basi di dati...
 * 4) la variabile app rappresenta la nostra applicazione express
 **/ 

var express = require("express"); 
    http = require("http"); 
    //Importiamo la libreria mongoose: 
    mongoose = require("mongoose");
    app = express(); 
    
//Impostazione del path relativo che express andrà a considerare per servire i file statici (html, css, js)
app.use(express.static(__dirname + "/turisti")); 

//Express si occupa anche del parsing dei body urlencoded
app.use(express.urlencoded()); 

//Connessione a MongoDB tramite mongoose
//N.B Utiliziamo MongoDB Comunity 6.0, per tal motivo le operazioni richiederanno una gestione tramite
//blocchi then e catch. 
mongoose.connect('mongodb://127.0.0.1/Guida_ACP'); 

//Ora possiamo creare gli schemi delle basi dati: 
var TuristaSchema = mongoose.Schema({
    nome: String, 
    cognome: String, 
    user: String, 
    password: String, 
    email: String
}); 

var VisitaSchema = mongoose.Schema({
    codice: Number, 
    nome: String, 
    descrizione: String, 
    max_partecipanti: Number, 
    durata: Number, 
    prezzo: Number,
    data: Date,  
    punto_incontro: String, 
    guida: Number
}); 

var PrenotazioniSchema = mongoose.Schema({
    id_prenotazione: Number,
    user_turista: String, 
    visite: [{codice: Number, nome: String, descrizione: String}],
    stato: {
        type: [String], 
        enum: ["IN_CORSO", "EFFETTUATA"], 
        default: 'IN_CORSO'
    }, 
    costoTotale: Number
})

var ProposteSchema = mongoose.Schema({
    proposta: String
}); 

//Creazione dei modelli sulla base degli schemi appena definiti
var Turista = mongoose.model("Turista", TuristaSchema); 
var Visita = mongoose.model("Visita", VisitaSchema); 
var Prenotazione = mongoose.model("Prenotazione", PrenotazioniSchema); 
var Proposta = mongoose.model("Proposta", ProposteSchema); 

//Creazione del server HTTP sul quale eseguire la nostra applicazione Express
//Il server si troverà in ascolto sul port 3002 della nostra macchina
http.createServer(app).listen(3002);

//Definizione delle operazioni CRUD di interesse
/**
 * Il turista dovrà occuparsi di: 
 *      1) Poter visualizzare le visite disponibili (Get)
 *      2) Potersi registrare/accedere al sito (Rispettivamente Post e Get)
 *      3) Poter creare delle visite personali da inviare all'amministratore (Post)
 */


/**
 * Una richiesta di get alla route "/visita" permetterà di stampare tutte le visite presenti nel db
 * con annesse date di svolgimento di queste ultime. 
 */
app.get("/visita", function(req, res){
    Visita.find({})
    .then(visite =>{
        res.json(visite); 
    })
    .catch(err =>{
        console.log(err); 
    })
}); 

/**
 * Una richiesta di get alla route "turisti" permetterà di stampare la lista di tutti coloro che 
 * sono registrati alla piattaforma.
 */
app.get("/turisti", function(req, res){
    Turista.find({})
    .then(turisti =>{
        res.json(turisti); 
    })
    .catch(err =>{
        console.log(err); 
    })
}); 

/**
 * Una richiesta di get alla route "proposte" permetterà di stampare la lista di tutte le proposte
 * utente effettuate.
 */
app.get("/proposta", function(req, res){
    Proposta.find({})
    .then(proposte => {
        res.json(proposte); 
    })
    .catch(err => {
        console.log(err); 
    })
}); 

/**
 * Una richiesta di post alla route "turisti" permetterà di salvare i dati di registrazione di un nuovo
 * 'account turista'.
 */
app.post("/turisti", function(req, res){
    console.log(req.body); 

    var newTurista = new Turista({
        "nome": req.body.nome, 
        "cognome": req.body.cognome, 
        "user": req.body.user, 
        "password": req.body.password, 
        "email": req.body.email
    }); 

    newTurista.save()
    .then(
        Turista.find({})
        .then(turisti =>{
            console.log(turisti); 
            res.json(turisti); 
        })
        .catch(err =>{
            console.log(err); 
            res.send(err); 
        })
    )
    .catch(err =>{
        console.log(err); 
        res.send(err); 
    })
}); 

/**
 * Una richiesta di post alla route "proposte" permetterà di inserire una nuova proposta nel DB
 */
app.post("/proposta", function(req, res){
    console.log(req.body); 

    var newProposta = new Proposta({
        "proposta": req.body.proposta
    }); 

    newProposta.save()
    .then(
        Proposta.find({})
        .then(proposte => {
            console.log(proposte); 
            res.json(proposte); 
        })
        .catch(err =>{
            console.log(err); 
            res.send(err); 
        })
    )
    .catch (err =>{
        console.log(err); 
        res.send(err); 
    })
});



/**
 * Ora ci occuperemo delle richieste da fare alla lista di prenotazioni fatte
 * dai diversi turisti.  
 */

/** 
 * Una richiesta di get alla route "prenotazione" permette di osservare tutte le 
 * prenotazioni effettuate da un particolare turista. 
 */

app.get("/prenotazione", function(req, res){
    Prenotazione.find({})
    .then(prenotazioni => {
        res.json(prenotazioni); 
    })
    .catch(err => {
        console.log(err); 
        res.send(err); 
    })
}); 

/**
 * Una richiesta di post alla route "prenotazione" permette di aggiungere una nuova
 * prenotazione effettuata da un cliente. 
 */

app.post("/prenotazione", function(req, res){
    console.log(req.body); 

    var NewPrenotazione = new Prenotazione ({
        "id_prenotazione": req.body.id_prenotazione, 
        "user_turista": req.body.user_turista, 
        "visite": [], 
        "stato": req.body.stato, 
        "costoTotale": req.body.costoTotale
    }); 

    NewPrenotazione.save()
    .then(
        Prenotazione.find({})
        .then(prenotazioni => {
            console.log(prenotazioni);
            res.json(prenotazioni); 
        })
        .catch(err =>{
            console.log(err); 
            res.send(err); 
        })
    )
    .catch(err =>{
        console.log(err); 
        res.send(err); 
    })
});

/**
 * Una richiesta di post alla route "prenotazione/stato" ha il compito di aggiornare 
 * una prenotazione dallo stato IN_CORSO ad EFFETTUATA
 */
app.post("/prenotazione/in_corso", function(req, res) {
    console.log(req.body); 

    Prenotazione.updateOne({user_turista: req.body.user_turista, stato: req.body.stato}, {costoTotale: req.body.costoTotale, visite: req.body.visite})
    .then(
        Prenotazione.find({})
        .then(prenotazioni => {
            res.json(prenotazioni); 
        })
        .catch(err => {
            console.log(err); 
            res.send(err); 
        })
    )
    .catch(err => {
        console.log(err); 
        res.send(err); 
    })
})


/**
 * Una richiesta di delete alla route "prenotazione" permette di eliminare una 
 * prenotazione effettuata dal turista. 
 */

app.delete("/prenotazione", function(req, res){
    console.log(req.body); 

    Prenotazione.deleteOne({id_prenotazione: req.body.id_prenotazione})
    .then(
        Prenotazione.find({})
        .then(prenotazioni => { 
            res.json(prenotazioni); 
        })
        .catch(err => {
            console.log(err); 
            res.send(err); 
        })
    )
    .catch(err => {
        console.log(err); 
        res.send(err); 
    })
}); 