const express = require('express');
const { auth } = require('./authenticate');
const fs = require('fs');
const filePath = './db/mydb.sqlite';
const dba = require("./initDb.js");
const query = require("./source.js");
require('dotenv').config()

if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}

var app = express();
var adminApp = express();
let db = dba.connect();

app.use(express.json());

app.use(express.static(__dirname + '/public'));

adminApp.use(express.json());

adminApp.use(express.static(__dirname + '/public'));

adminApp.get('/api/employees', function (req, res) {
  query.getEmployees(db, req, res)

});

adminApp.get('/api/cards', function (req, res) {
  query.getCards(db, req, res)
});

adminApp.get('/api/transactions', function (req, res) {
  query.getTransactions(db, req, res)

});

/*
    card_id: string
*/
app.get('/api/swipe/:id', function (req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    res.status(201).send({ message: 'Log Out Account and Delete Token' })
    return
  }

  var cardId = req.params.id
  registered = query.getEmployeeCard(db, req, res, cardId)
});

/*
    card_id: string
    employee_id string
    name: string
    email: string
    mobile: number
    pin: number
*/
app.post('/api/register', function (req, res) {
  const properties = ['card_id', 'employee_id', 'name', 'email', 'mobile', 'pin'];

  const hasAllKeys = properties.every(item => req.body.hasOwnProperty(item));
  if (!hasAllKeys) {
    res.status(404).send('Missing card_id/employee_id/name/email/mobile/pin')
    return
  }

  query.addEmployee(db, req, res)

});

/*
    card_id: string
    pin: number
*/
app.post('/api/sign-in', function (req, res) {
  const properties = ['card_id', 'pin'];

  const hasAllKeys = properties.every(item => req.body.hasOwnProperty(item));
  if (!hasAllKeys) {
    res.status(404).send('Missing card_id/pin')
    return
  }

  query.checkPin(db, req, res)
});

/*
    price: number
*/
app.post('/api/add-funds', auth, function (req, res) {
  price = req.body.price
  cardId = req.user.card_id
  query.addTransaction(db, req, res, price, cardId)
});

app.post('/api/purchase', auth, function (req, res) {
  price = -req.body.price
  cardId = req.user.card_id
  query.addTransaction(db, req, res, price, cardId)
});

app.get('/api/balance', auth, function (req, res) {
  cardId = req.user.card_id
  query.getBalance(db, req, res, cardId)

});

app.listen(3000, function () {
  dba.init(db);
  console.log('Server is listening on port 3000. Ready to accept requests!');
});

if (process.env.ENVIRONMENT === 'dev') {
  adminApp.listen(5000, function () {
    console.log('Server is listening on port 5000. Ready to accept requests!');
  });
}