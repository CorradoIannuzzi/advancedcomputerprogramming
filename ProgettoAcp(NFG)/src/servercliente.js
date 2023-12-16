/**
 * Importazione dei moduli express, http e mongoose per realizzare il server del cliente:
 * 1) express serve per fornire file statici (html, css, javascript) popolare gli header delle richieste http ed interagire con il DB
 * 2) http serve per effettuare le operazioni CRUD come post, get...
 * 3) mongoose serve per interfacciarsi con MongoDB, ci consente di connetterci al DB, di creare schemi di basi di dati...
 * 4) la variabile app rappresenta la nostra applicazione express
 * 5) idPrenotazione indica l'id dell'ultima prenotazione effettuata, così da tenerne traccia...
 **/ 

var express = require("express"), 
    http = require("http"),  
    mongoose = require("mongoose"),
    app = express()
    idPrenotazione = 0

// Impostazione del path relativo che express andrà a considerare per i file statici...
app.use(express.static(__dirname + "/cliente"))

// Parsing dei body urlencoded
app.use(express.urlencoded()); 

/**
 * Connessione a MongoDB tramite
 * Mongoose
 */
mongoose.connect('mongodb://127.0.0.1/ProgettoACP')

// Ora possiamo creare gli schemi per le entità Cliente e Prenotazione: 

var ClienteSchema = mongoose.Schema({
    nome: String, 
    cognome: String, 
    user: String, 
    password: String, 
    indirizzo: String, 
    mail: String, 
    telefono: String
}); 

var PrenotazioneSchema = mongoose.Schema({
    id: String, 
    animatore: String, 
    r_special: {
        type: [String], 
        enum: ['clown', 'prestidigitazione', 'giochi'], 
        default: null
    }, 
    giorno: Date, 
    indirizzo: String
}); 

var AnimatoreSchema = mongoose.Schema({
    id: Number, 
    nome: String, 
    cognome: String, 
    telefono: String, 
    mail: String, 
    foto: String, 
    special: {
        type: [String], 
        enum: ["clown", "prestidigitazione", "giochi"],
        default: 'giochi'
    }
}); 

// Creazione dei modelli appena definiti:
var Cliente = mongoose.model("Cliente", ClienteSchema); 
var Prenotazione = mongoose.model("Prenotazione", PrenotazioneSchema); 
var Animatore = mongoose.model("Animatore", AnimatoreSchema); 

//Creazione del server http su cui eseguire la nostra app Express
//Server in ascolto sul porto (3000)
http.createServer(app).listen(3001); 

/**
 * Operazioni CRUD previste: 
 *  1) Get sui clienti 
 *  2) Accesso/Registrazione di un cliente alla piattaforma (Get/Post)
 *  3) Effettuare una prenotazione sulla piattaforma (Post)
 *  4) Cancellazione di una prenotazione (Delete)
 */

app.get("/clienti", function(req, res) {
    Cliente.find({})
    .then(clienti => {
        console.log(clienti); 
        res.json(clienti); 
    })
    .catch(err => {
        console.log(err); 
        res.send(err); 
    })
}); 

app.get("/prenotazioni", function(req, res) {
    Prenotazione.find({})
    .then(prenotazioni => {
        console.log(prenotazioni); 
        res.json(prenotazioni); 
    })
    .catch(err => {
        console.log(err); 
        res.send(err); 
    })
}); 

app.get("/animatori", function(req, res) {
    Animatore.find({})
    .then(animatori => {
        console.log(animatori); 
        res.json(animatori); 
    })
    .catch(err => {
        console.log(err); 
        res.send(err); 
    })
}); 


// Ora lavoriamo alle post per clienti e prenotazioni
app.post("/clienti", function(req, res) {
    console.log(req.body); 

    var newCliente = new Cliente({
        "nome": req.body.nome, 
        "cognome": req.body.cognome, 
        "user": req.body.user, 
        "password": req.body.password, 
        "indirizzo": req.body.indirizzo,
        "mail": req.body.mail,
        "telefono": req.body.telefono
    }); 

    newCliente.save()
    .then(
        Cliente.find({})
        .then(clienti =>{
            console.log(clienti);
            res.json(clienti); 
        })
        .catch(err => {
            console.log(err); 
            res.send(err); 
        })
    )
    .catch(err =>{
        console.log(err); 
        res.send(err); 
    })
}); 

app.post("/prenotazioni", function(req, res) {
    console.log(req.body); 

    var newPrenotazione = new Prenotazione({
        "id": idPrenotazione+1,
        "animatore": req.body.animatore, 
        "r_special": req.body.r_special, 
        "giorno": req.body.giorno, 
        "indirizzo": req.body.indirizzo
    }); 

    newPrenotazione.save()
    .then(
        Prenotazione.find({})
        .then(prenotazioni =>{
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

// Ora possiamo lavorare alla delete per le prenotazioni: 
app.delete("/prenotazioni", function(req, res) {
    Prenotazione.deleteOne({id: req.body.id})
    .then(
        Prenotazione.find({})
        .then(prenotazioni =>{
            console.log(prenotazioni); 
            res.json(prenotazioni); 
        })
        .catch(err =>{
            console.log(err); 
            res.send(err); 
        })
    )
}); 



