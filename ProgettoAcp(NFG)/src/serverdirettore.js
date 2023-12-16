/**
 * Importazione dei moduli express, http e mongoose per realizzare il server del cliente:
 * 1) express serve per fornire file statici (html, css, javascript) popolare gli header delle richieste http ed interagire con il DB
 * 2) http serve per effettuare le operazioni CRUD come post, get...
 * 3) mongoose serve per interfacciarsi con MongoDB, ci consente di connetterci al DB, di creare schemi di basi di dati...
 * 4) la variabile app rappresenta la nostra applicazione express
 * 5) idAnimatore indica l'id dell'ultimo animatore inserito, così da tenerne traccia...
 **/ 

var express = require("express"), 
    http = require("http"),  
    mongoose = require("mongoose"),
    app = express()
    idAnimatore = 0

// Impostazione del path relativo che express andrà a considerare per i file statici...
app.use(express.static(__dirname + "/direttore"))

// Parsing dei body urlencoded
app.use(express.urlencoded()); 

/**
 * Connessione a MongoDB tramite
 * Mongoose
 */
mongoose.connect('mongodb://127.0.0.1/ProgettoACP')

//Ora possiamo creare gli schemi: 
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

var Animatore = mongoose.model("Animatore", AnimatoreSchema); 

//Creazione del server http su cui eseguire la nostra app Express
//Server in ascolto sul porto (3000)
http.createServer(app).listen(3000)

/**
 * Operazioni CRUD previste: 
 *  1) Get sulla route /animatori
 *  2) Delete di un animatore licenziato
 *  3) Update dei dati di un animatore, quale: specialità
 *  4) Post per inserimento di un nuovo animatore
 */


/**
 * Una richiesta di get alla route "/animatori" permetterà
 * di visualizzare tutti gli animatori registrati nell'applicazione
 */
app.get("/animatori", function(req, res) {
    Animatore.find({})
    .then(animatori => {
        res.json(animatori)
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
})

/**
 * Una richiesta di delete alla route "/animatori" permetterà
 * di eliminare un animatore licenziato, specificando il suo id
 */
app.delete("/animatori", function(req, res) {
    Animatore.deleteOne({id: req.body.id})
    .then(
        Animatore.find({})
        .then(animatori => {
            console.log(animatori)
            res.json(animatori)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    )
})

/**
 * Una richiesta di post alla route "/animatori" permette 
 * l'inserimento di un nuovo animatore nel database
 */
app.post("/animatori", function(req, res) {
    console.log(req.body); 

    var fotoAnimatore = req.body.nome.toUpperCase().replace(" ", "_"); 
    var imagePath = "/assets/" + fotoAnimatore + ".jpg"; 

    var newAnimatore = new Animatore({
        "id": idAnimatore + 1, 
        "nome": req.body.nome, 
        "cognome": req.body.cognome, 
        "telefono": req.body.telefono, 
        "mail": req.body.mail, 
        "foto": imagePath, 
        "special": req.body.special
    }); 

    newAnimatore.save()
    .then(
        Animatore.find({})
        .then(animatori => {
        console.log(animatori); 
        res.json(animatori); 
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

/**
 * Una richiesta di put alla route "/animatore/special" permetterà
 * di modificare la sua specialità tra le 3 possibili
 */
app.put("/animatori/special", function(req, res) {
    
    Animatore.updateOne({id: req.body.id}, {special: req.body.special})
    .then(
        Animatore.find({})
        .then(animatori => {
            console.log(animatori); 
            res.json(animatori); s
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
