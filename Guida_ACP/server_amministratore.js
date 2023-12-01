/**
 * Importazione dei moduli express, http e mongoose per realizzare il server del cliente:
 * 1) express serve per fornire file statici (html, css, javascript) popolare gli header delle richieste http ed interagire con il DB
 * 2) http serve per effettuare le operazioni CRUD come post, get...
 * 3) mongoose serve per interfacciarsi con MongoDB, ci consente di connetterci al DB, di creare schemi di basi di dati...
 * 4) la variabile app rappresenta la nostra applicazione express
 **/ 

var express = require("express"); 
    http = require("http"),
    //Importiamo la libreria mongoose: 
    mongoose = require("mongoose"),
    app = express(); 
    
//Impostazione del path relativo che express andrà a considerare per servire i file statici (html, css, js)
app.use(express.static(__dirname + "/amministratore")); 

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

var ProposteSchema = mongoose.Schema({
    proposta: String
}); 

//Creazione dei modelli sulla base degli schemi appena definiti
var Guida = mongoose.model("Guida", GuidaSchema); 
var Visita = mongoose.model("Visita", VisitaSchema); 
var Proposta = mongoose.model("Proposta", ProposteSchema); 

//Creazione del server HTTP sul quale eseguire la nostra applicazione Express
//Il server si troverà in ascolto sul port 3000 della nostra macchina
http.createServer(app).listen(3000); 

//Definizione delle operazioni CRUD di interesse
/**
 * L'amministratore dovrrà occuparsi di: 
 *      1) Inserire le nuove guide (Post)
 *      2) Modificare le guide esistenti (Put)
 *      3) Inserire le nuove visite guidate (Post)
 *      4) Modificare le visite esistenti (Put)
 *      5) Eliminare in caso guide licenziate / visite annullate (Delete)
 *      6) Visualizzare le visite e le guide disponibili (Get)
 */

/**
 * Una richiesta di get alle route "/guida", "/visita" e "/proposta" avrà come effetto la restituzione di un
 * file JSON contenente tutte le guide iscritte, le visite presenti e tutte le proposte degli utenti 
 * presenti nel DB
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
 * Una richiesta di post alla route "/guida" permetterà la creazione di una nuova visita guidata
 * all'interno del DB sulla base dei dati inseriti; come risposta restituirà un file JSON che contiene 
 * tutte le visite presenti. Ovviamente i giorni di disponibilità della guida sono "null" proprio 
 * poiché dovrà essere la guida ad inserirli. 
 */

app.post("/guida", function(req, res){
    console.log(req.body); 

    var newGuida = new Guida({
        "id": req.body.id, 
        "nome": req.body.nome, 
        "cognome": req.body.cognome, 
        "birthdate": req.body.birthdate, 
        "email": req.body.email, 
        "telefono": req.body.telefono, 
        "visita": req.body.visita, 
        "lingua": req.body.lingua, 
        "giorni_disp": null
    }); 

    newGuida.save()
        .then(
            Guida.find({})
            .then(guide =>{
                console.log(guide); 
                res.json(guide); 
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
 * Una richiesta di post alla route "/visita" permetterà l'aggiunta di una nuova visita guidata nel
 * DB. 
 */
app.post("/visita", function(req, res){
    console.log(req.body); 

    var newVisita = new Visita({
        "codice": req.body.codice, 
        "nome": req.body.nome, 
        "descrizione": req.body.descrizione, 
        "max_partecipanti": req.body.max_partecipanti, 
        "durata": req.body.durata, 
        "prezzo": req.body.prezzo, 
        "data": req.body.data, 
        "punto_incontro": req.body.punto_incontro, 
        "guida": req.body.guida
    });

    newVisita.save()
    .then(
        Visita.find({})
        .then(visite =>{
            console.log(visite); 
            res.json(visite); 
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
 * Una richiesta di put alle route "/visita/data", "/visita/punto_incontro" e "/visita/guida"
 * permette di cambiare data, punto di incontro e guida assegnate alla visita. 
 */

app.put("/visita/data", function(req, res){
    console.log(req.body); 

    Visita.updateOne({codice: req.body.codice}, {data: req.body.data})
    .then(
        Visita.find({})
        .then(visite =>{
            res.json(visite); 
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

app.put("/visita/punto_incontro", function(req, res){
    console.log(req.body); 

    Visita.updateOne({codice: req.body.codice}, {punto_incontro: req.body.punto_incontro})
    .then(
        Visita.find({})
        .then(visite =>{
            res.json(visite); 
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

app.put("/visita/guida", function(req, res){
    console.log(req.body); 

    const nuovoElemento = {id: req.body.id, nome: req.body.nome, cognome: req.body.cognome}; 

    Visita.updateOne({codice: req.body.codice}, { $push: {guida: nuovoElemento} } )
    .then(
        Visita.find({})
        .then(visite =>{
            res.json(visite); 
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
 * Una richiesta di delete alle route "/visita" e "/guida" permette di eliminare una guida 
 * o una visita guidata, individuandole grazie alla coppia (nome, cognome) e, nel caso della 
 * vista, (codice). 
 */

app.delete("/visita", function(req, res){
    console.log(req.body); 

    Visita.deleteOne({codice: req.body.codice})
    .then(
        Visita.find({})
        .then(visite =>{
            res.json(visite); 
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

app.delete("/guida", function(req, res){
    console.log(req.body); 

    Guida.deleteOne({id: req.body.id})
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



