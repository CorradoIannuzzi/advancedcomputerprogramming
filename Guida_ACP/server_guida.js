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
app.use(express.static(__dirname + "/guida")); 

//Express si occupa anche del parsing dei body urlencoded
app.use(express.urlencoded()); 

//Connessione a MongoDB tramite mongoose
//N.B Utiliziamo MongoDB Comunity 6.0, per tal motivo le operazioni richiederanno una gestione tramite
//blocchi then e catch. 
mongoose.connect('mongodb://127.0.0.1/Guida_ACP'); 

//Ora possiamo creare gli schemi delle basi dati: 
var GuidaSchema = mongoose.Schema({
    id: Number,
    nome: String, 
    cognome: String, 
    birthdate: Date, 
    email: String, 
    telefono: Number, 
    visita: String, 
    lingua: {
        type: [String], 
        enum: ["inglese", "spagnolo", "francese", "tedesco", "russo", "giapponese", "cinese"], 
        default: 'inglese'
    }, 
    giorni_disp: Date
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

//Creazione dei modelli sulla base degli schemi appena definiti
var Guida = mongoose.model("Guida", GuidaSchema); 
var Visita = mongoose.model("Visita", VisitaSchema); 

//Creazione del server HTTP sul quale eseguire la nostra applicazione Express
//Il server si troverà in ascolto sul port 3001 della nostra macchina
http.createServer(app).listen(3001); 

//Definizione delle operazioni CRUD di interesse
/**
 * La guida dovrà occuparsi di: 
 *      1) Modificare i suoi dati per inserire i suoi giorni di disponibilità (Put)
 *      2) Osservare le visite disponibili per poter osservare i gioni in cui verranno svolte (Get)
 */


/**
 * Una richiesta di get alle route "/guida" e "/visita" avrà come effetto la restituzione di un
 * file JSON contenente tutte le guide iscritte e le visite presenti nel DB
 */

app.get("/guida", function(req, res){
    Guida.find({})
        .then(guide => {
            res.json(guide); 
        })
        .catch(err =>{
            console.log(err); 
        })
}); 

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
 * Una richiesta di put alla route "/guida/giorni_disp" avrà come risultato la modifica nel database del proprio
 * documento, potendo inserire i giorni di disponibilità. 
 */
app.put("/guida/giorni_disp", function(req, res){
    console.log(req.body); 
 
    Guida.updateOne({id: req.body.id}, {giorni_disp: req.body.giorni_disp})
    .then(
        Guida.find({})
        .then(guide =>{
            res.json(guide); 
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
