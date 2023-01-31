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

async function addCard(db, req, res, id) {
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
        console.log(rows)
        if(rows.pin === pin) {
            token = getToken(card_id);
            return res.status(200).send({card_id: card_id, token: token})
        }
        return res.status(404).send('Incorrect PIN')
    })
}


// Get All Cards

// Get All Transactions

// Get All Transactions by ID

// Get Employee By Id

// Add Employee

// Add Transaction

// Add Card

// Get Balance

// Add Auth Controller




module.exports = { getEmployees, getEmployeeCard, addEmployee, checkPin }