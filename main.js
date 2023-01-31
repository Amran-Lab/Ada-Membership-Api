var express = require('express');
let { auth } = require('./authenticate');
const jwt = require('jsonwebtoken')

var fs = require('fs');
var filePath = './db/mydb.sqlite'; 
fs.unlinkSync(filePath);

var app = express();
const dba = require("./rundbbuild.js");
const query = require("./dbqueries.js");
let db = dba.connect();

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.get('/api/employees', function(req, res) {
    query.getEmployees(db,req,res)

});

app.get('/api/transactions', function(req, res) {
    query.getTransactions(db,req,res)

});

// Need Sign OUT
/*
    Card ID
*/
app.get('/api/swipe/:id', function(req, res) {
    var cardId = req.params.id
    registered = query.getEmployeeCard(db,req, res, cardId)
    // TODO SIGN OUT

});

/*
    Card ID
    Employee Id
    name
    email
    mobile
    pin
*/
app.post('/api/register', function(req, res) {
    const properties = ['card_id', 'employee_id', 'name', 'email', 'mobile', 'pin'];

    const hasAllKeys = properties.every(item => req.body.hasOwnProperty(item));
    if (!hasAllKeys) {
        res.status(404).send('Missing card_id/employee_id/name/email/mobile/pin')
        return
    }
    query.addEmployee(db,req,res)

});

/*
    Card ID
    pin
*/
app.post('/api/sign-in', function(req, res) {
    const properties = ['card_id', 'employee_id', 'name', 'email', 'mobile', 'pin'];

    const hasAllKeys = properties.every(item => req.body.hasOwnProperty(item));
    if (!hasAllKeys) {
        res.status(404).send('Missing card_id/pin')
        return
    }

    query.checkPin(db,req,res)
    // TODO RETURN NAME
});

/*
    price
*/
app.post('/api/add-funds', auth, function(req, res) {
    price = req.body.price 
    cardId = req.user.card_id
    query.addTransaction(db,req,res, price, cardId)
});

app.post('/api/purchase', auth, function(req, res) {
    price = -req.body.price 
    cardId = req.user.card_id
    query.addTransaction(db,req,res, price, cardId)
});

//GetEmployeeDetails
//GetBalance

app.listen(3000, function () {

    dba.init(db);
    console.log('Server is listening on port 3000. Ready to accept requests!');
});