var express = require('express');

var app = express();
const dba = require("./rundbbuild.js");
const query = require("./dbqueries.js");
let db = dba.connect();

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    query.getEmployees(db,req,res)

});

app.get('/api/get-all-employees', function(req, res) {
    query.getEmployees(db,req,res)
});

app.listen(3000, function () {

    dba.init(db);
    console.log('Server is listening on port 3000. Ready to accept requests!');
});