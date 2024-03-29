let { getToken } = require('./authenticate');
const bcrypt = require("bcrypt")

const saltRounds = 10

function getEmployees(db, req, res) {
  db.all(`SELECT * FROM Employee`, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    if (!rows) {
      return res.send({ error: "no employees found" });
    }
    return res.send(rows);
  })
}

function getCards(db, req, res) {
  db.all('SELECT * FROM Card', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    if (!rows) {
      return res.send({ error: "no employees found" })
    }
    return res.send(rows);
  })
}

function getTransactions(db, req, res) {
  db.all('SELECT * FROM Transactions', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    if (!rows) {
      return res.send({ error: "no employees found" });
    }
    return res.send(rows);
  })
}

async function getEmployeeCard(db, req, res, id) {
  db.get(`Select * From Card WHERE card_id = ?`, [id], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }

    if (!rows) {
      return res.status(404).send({ message: 'Card Not Registered - Please input details' });
    }
    return res.status(200).send({ message: 'Please Enter Pin' });
  })
}

async function addEmployee(db, req, res) {
  const { employee_id, name, email, mobile } = req.body;
  db.run(`INSERT INTO Employee(employee_id,name, email, mobile) VALUES(?, ?, ?, ?)`, [employee_id, name, email, mobile],
    function (err) {
      if (err) {
        console.log(err.message);
      }

      addCard(db, req, res);
    })
}

async function addCard(db, req, res) {
  const { card_id, employee_id, pin } = req.body;
  salt = await bcrypt.genSalt(saltRounds);
  hashed = await bcrypt.hash(pin.toString(), salt);
  db.run(`INSERT INTO Card(card_id, employee_id, pin) VALUES(?,?,?)`, [card_id, employee_id, hashed],
    function (err) {
      if (err) {
        console.log(err.message);
        return res.status(404).send({ message: 'Card Already Exists' });
      }

      return res.status(200).send({ message: 'Card Added Successfully' });
    })
}

async function checkPin(db, req, res) {
  const { card_id, pin } = req.body;
  db.get(`Select * From Card WHERE card_id = ?`, [card_id], async (err, rows) => {
    if (err) {
      console.error(err.message);
    }

    if (!rows) {
      return res.status(404).send({ message: 'Card Not Registered - Please register with details' });
    }

    comparison = await bcrypt.compare(pin.toString(), rows.pin);
    if (comparison) {
      return welcomeEmployee(db, res, card_id, rows.employee_id);
    }

    return res.status(404).send({ message: 'Incorrect PIN' });
  })
}

async function welcomeEmployee(db, res, cardId, employeeId) {
  db.get(`SELECT name FROM Employee WHERE employee_id = ?`, [employeeId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }

    if (!rows) {
      return res.status(404).send({ message: 'Employee Not Found' });
    }

    token = getToken(cardId, employeeId);
    return res.status(200).send({
      card_id: cardId,
      employee_id: employeeId,
      token: token,
      name: rows.name,
      message: 'Welcome ' + rows.name
    });
  })
}

async function addTransaction(db, req, res, price, cardId) {
  db.run(`INSERT INTO Transactions(card_id, value) VALUES(?,?)`, [cardId, price],
    function (err) {
      if (err) {
        console.log(err.message);
        return res.status(404).send({ message: 'Failed to add Transaction' });
      }

      return res.status(200).send({ message: 'Transaction Added Successfully' });
    })
}

async function getBalance(db, req, res, cardId) {
  db.all(`SELECT value FROM Transactions WHERE card_id = ?`, [cardId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(404).send({ message: 'Error' });
    }

    if (!rows) {
      return res.status(200).send({ balance: 0 });
    }

    const total = rows.reduce((prev, next) => parseFloat(prev) + parseFloat(next.value), 0);
    return res.send({ balance: total });
  })
}

module.exports = { getEmployees, getEmployeeCard, getCards, addEmployee, checkPin, addTransaction, getTransactions, getBalance }