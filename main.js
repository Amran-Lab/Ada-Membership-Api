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
    // Is Registered
    // Is Signed In
    query.getEmployees(db,req,res)

});

app.get('/', function(req, res) {
    token = jwt.sign({ _id: '555', name: 'Cool Bans' }, 'SecretCode', {
        expiresIn : 120 //seconds
      });

    res.send(token);

});

// Need Sign OUT
/*
    Card ID
*/
app.get('/api/swipe/:id', function(req, res) {
    var cardId = req.params.id
    registered = query.getEmployeeCard(db,req, res, cardId)

});

// DONE
/*
    Card ID
    Employee Id
    name
    email
    mobile
    pin
*/
app.post('/api/register', function(req, res) {
    // Is Registered
    // Is Signed In
    const properties = ['card_id', 'employee_id', 'name', 'email', 'mobile', 'pin'];

    const hasAllKeys = properties.every(item => req.body.hasOwnProperty(item));
    if (!hasAllKeys) {
        res.status(404).send('Missing card_id/employee_id/name/email/mobile/pin')
        return
    }
    query.addEmployee(db,req,res)

});

// DONE
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
    // Return JWT
});

app.get('/api/add-funds', function(req, res) {
    // Check Pin
    // Return JWT
});

app.get('/api/purchase', function(req, res) {
    // Check Pin
    // Return JWT
});


app.listen(3000, function () {

    dba.init(db);
    console.log('Server is listening on port 3000. Ready to accept requests!');
});