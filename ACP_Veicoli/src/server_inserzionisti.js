/**
 * Importazione dei moduli express, http e mongoose per realizzare il server del cliente:
 * 1) express serve per fornire file statici (html, css, javascript) popolare gli header delle richieste http ed interagire con il DB
 * 2) http serve per effettuare le operazioni CRUD come post, get...
 * 3) mongoose serve per interfacciarsi con MongoDB, ci consente di connetterci al DB, di creare schemi di basi di dati...
 * 4) la variabile app rappresenta la nostra applicazione express
 * 5) idVeicolo tiene traccia del codice dell'ultimo veicolo inserito nel DB, così da poter creare nuovi annunci di veicoli
 * incrementando il codice di volta in volta
 **/ 

var express = require("express"), 
    http = require("http"), 
    mongoose = require("mongoose"),
    app = express(), 
    idVeicolo = 0; 

//Impostazione del path relativo che express andrà a considerare per servire i file statici...
app.use(express.static(__dirname + "/inserzionisti")); 

//Parsing dei body urlencoded
app.use(express.urlencoded()); 

/**
 * Connessione a MongoDB tramire mongoose
 * NB. Utilizzeremo MongoDB Community 6.0, ergo: 
 *          Avremo una gestione tramite blocchi then-catch.
 */
mongoose.connect('mongodb://127.0.0.1/Veicoli_ACP'); 

//Ora creiamo gli schemi: 
var InserzionistaSchema = mongoose.Schema({
    identificativo: Number, 
    username: String, 
    password: String, 
    mail: String, 
    telefono: String, 
}); 

var VeicoloSchema = mongoose.Schema({
    inserzionista: Number, 
    id: Number, 
    nome: String, 
    data_inserimento: Date, 
    luogo_veicolo: String, 
    categoria: {
        type: [String], 
        enum: ["Moto", "Auto"], 
        default: 'Auto'
    }, 
    tipologia: {
        type: [String], 
        enum: ["Nuovo", "Usato"], 
        default: 'Usato'
    }, 
    chilometraggio: Number, 
    descrizione: String, 
    prezzo: Number, 
    immagine: String
}); 


//Creazione dei modelli di DB sulla base degli schemi forniti: 
var Inserzionista = mongoose.model("Inserzionista", InserzionistaSchema); 
var Veicolo = mongoose.model("Veicolo", VeicoloSchema); 

//Creazione del server HTTP sul quale eseguire la nostra app Express 
//Il server sarà in ascolto sul port 3000
http.createServer(app).listen(3000); 

//Definizione dei metodi CRUD per le route di interesse

/**
 * Una richiesta di get alla route "/inserzionisti" avrà come effeto la restituizione di un 
 * file JSON contenente tutti gli inserzionisti registrati nel DB:
 */

app.get("/inserzionisti", function(req, res) {
    Inserzionista.find({})
    .then(inserzionisti => {
        res.json(inserzionisti); 
    })
    .catch(err =>{
        console.log(err); 
        res.send(err); 
    })
})

/**
 * Analogamente una richiesta di get alla route "/veicoli" avrà lo stesso effetto:
 */

app.get("/veicoli", function(req, res) {
    Veicolo.find({})
    .then(veicoli => {
        res.json(veicoli); 
    })
    .catch(err => {
        console.log(err); 
        res.send(err); 
    })
})

/**
 * Una richiesta di post alle route "/inserzionisti" e "/veicoli" avrà come effetto 
 * la registrazione di un nuovo inserzionista o la creazione di un nuovo annuncio per veicolo
 * nel database: 
 */

app.post("/inserzionisti", function(req, res) {
    console.log(req.body); 

    var newInserzionista = new Inserzionista({
        "identificativo": req.body.identificativo, 
        "username": req.body.username, 
        "password": req.body.password, 
        "mail": req.body.mail, 
        "telefono": req.body.telefono
    }); 

    newInserzionista.save()
    .then(
        Inserzionista.find({})
        .then(inserzionisti => {
            console.log(inserzionisti); 
            res.json(inserzionisti); 
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

app.post("/veicoli", function(req, res) {
    console.log(req.body); 

    var immagineVeicolo = req.body.nome.toUpperCase().replace(" ", "_"); 
    var imagePath = "/assets/" + immagineVeicolo + ".jpg";
    
    var newVeicolo = new Veicolo({
        "inserzionista": req.body.inserzionista, 
        "id": idVeicolo + 1,
        "nome": req.body.nome, 
        "data_inserimento": req.body.data_inserimento, 
        "luogo_veicolo": req.body.luogo_veicolo, 
        "categoria": req.body.categoria, 
        "tipologia": req.body.tipologia, 
        "chilometraggio": req.body.chilometraggio, 
        "descrizione": req.body.descrizione, 
        "prezzo": req.body.prezzo, 
        "immagine": imagePath
    }); 

    newVeicolo.save()
    .then(
        Veicolo.find({})
        .then(veicoli => {
            console.log(veicoli); 
            res.json(veicoli); 
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
 * Con una richiesta di put alle route "/veicoli/prezzo" e "/veicoli/luogo_veicolo" possiamo aggiornare i campi
 * dell'annuncio circa il prezzo del veicolo in vendita e la città in cui si trova:  
 */

app.put("/veicoli/prezzo", function(req, res) {

    Veicolo.updateOne({id: req.body.id}, {prezzo: req.body.id})
    .then(
        Veicolo.find({})
        .then(veicoli =>{
            console.log(veicoli); 
            res.json(veicoli); 
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

})

app.put("/veicoli/luogo_veicolo", function(req, res) {
    Veicolo.updateOne({id: req.body.id}, {luogo_veicolo: req.body.luogo_veicolo})
    .then(
        Veicolo.find({})
        .then(veicoli =>{
            console.log(veicoli); 
            res.json(veicoli); 
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
})

/**
 * Con una richiesta di delete alla route "/veicoli" è possibile eliminare un annuncio pubblicato per un veicolo:
 */

app.delete("/veicoli", function(req, res) {
    Veicolo.deleteOne({id: req.body.id}) 
    .then(
        Veicolo.find({})
        .then(veicoli =>{
            console.log(veicoli); 
            res.json(veicoli); 
        })
        .catch(err =>{
            console.log(err); 
            res.send(err); 
        })
    )
})

















