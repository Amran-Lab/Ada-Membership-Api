const sqlite3 = require('sqlite3').verbose();
let { getAllEmployees } = require('./sql/getAllEmployees');

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


// Get All Cards

// Get All Transactions

// Get All Transactions by ID

// Get Card By ID

// Get Employee By Id

// Add Employee

// Add Transaction

// Add Card

// Get Balance

// Add Auth Controller




module.exports = { getEmployees }