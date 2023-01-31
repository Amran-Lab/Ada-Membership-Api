const sqlite3 = require('sqlite3').verbose();
let { getAllEmployees } = require('./sql/getAllEmployees');
let { getCardById } = require('./sql/getCardById');
let { getToken } = require('./authenticate');

function getEmployees(db, req, res) {
    db.all(getAllEmployees, (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        if (!rows) {
            res.send({ error: "no employees found" })
        }
        res.send(rows);
    })
}

function getTransactions(db, req, res) {
    db.all('SELECT * FROM Transactions', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        if (!rows) {
            res.send({ error: "no employees found" })
        }
        res.send(rows);
    })
}

async function getEmployeeCard(db, req, res, id) {
    db.get(getCardById, [id], (err, rows) => {
        if (err) {
            console.error(err.message);
        }

        if (!rows) {
            res.status(404).send('Card Not Registered - Please input details')
            return
        }
        res.status(200).send('Please Enter Pin')
        return
    })
}

async function addEmployee(db, req, res, id) {
    const { employee_id, name, email,mobile } = req.body;
    db.run(`INSERT INTO Employee(employee_id,name, email, mobile) VALUES(?, ?, ?, ?)`, [employee_id, name, email,mobile],
        function(err) {
        if (err) {
            console.log('EMP ERROR')
            console.log(err.message)
        }

        addCard(db, req, res)
    })
}

async function addCard(db, req, res) {
    const { card_id, employee_id, pin } = req.body;
    db.run(`INSERT INTO Card(card_id, employee_id, pin) VALUES(?,?,?)`, [card_id, employee_id, pin],
        function(err) {
        if (err) {
            console.log('CARD ERROR')
            console.log(err.message)

            return res.status(404).send('Fail')
        }

        res.status(200).send('Card Added Successfully')
    })
}

async function checkPin(db, req, res) {
    const { card_id, pin } = req.body;
    db.get(getCardById, [card_id], (err, rows) => {
        if (err) {
            console.error(err.message);
        }

        if (!rows) {
            res.status(404).send('Card Not Registered - Please input details')
            return
        }

        if(rows.pin === pin) {
            token = getToken(card_id, rows.employee_id);
            return res.status(200).send({card_id: card_id, token: token})
        }
        return res.status(404).send('Incorrect PIN')
    })
}

async function addTransaction(db, req, res, price, cardId) {
    db.run(`INSERT INTO Transactions(card_id, value) VALUES(?,?)`, [cardId, price],
        function(err) {
        if (err) {
            console.log('CARD ERROR')
            console.log(err.message)

            return res.status(404).send('Fail')
        }

        res.status(200).send('Transaction Added Successfully')
    })
}

async function getBalance(db, req, res, cardId) {
    console.log(cardId)
    db.all(`SELECT value FROM Transactions WHERE card_id = ?`, [cardId], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        if (!rows) {
            res.send({ error: "no employees found" })
        }
        let total = rows.reduce((prev, next) => parseFloat(prev) + parseFloat(next.value), 0)
        res.send({balance: total});
    })
}

// Get Employee By Id Return name to check pin

module.exports = { getEmployees, getEmployeeCard, addEmployee, checkPin, addTransaction, getTransactions, getBalance }