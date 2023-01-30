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
        console.log(rows)
        res.send(rows);
    })
}





module.exports = { getEmployees }