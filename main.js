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

app.get('/', function(req, res) {
    token = jwt.sign({ _id: '555', name: 'Cool Bans' }, 'SecretCode', {
        expiresIn : 120 //seconds
      });

    res.send(token);

});

app.get('/api', auth, function(req, res) {
    // Is Registered
    // Is Signed In
    res.send(req.user)
});

app.get('/api/register', function(req, res) {
    // Is Registered
    // Is Signed In
    query.getEmployees(db,req,res)

});

app.get('/api/sign-in', function(req, res) {
    // Check Pin
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