const sqlite3 = require('sqlite3').verbose();
let { employeeTable } = require('./sql/employees');
let { insertEmployees } = require('./sql/insertEmployee');
let { cardsTable } = require('./sql/cards');
let { transactionTable} = require('./sql/transaction');


function connect() {
  let db = new sqlite3.Database('./db/mydb.sqlite', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });
  db.exec('PRAGMA foreign_keys = ON;', function(error)  {
    if (error){
        console.error("Pragma statement didn't work.")
    } else {
        console.log("Foreign Key Enforcement is on.")
    }
  });
  return db;
}

function init(db) {


  db.serialize(() => {
      db.run(employeeTable, (err) => {
        if (err) { console.log(err) } else { console.log("Creating table Employees") }
      });
      db.run(insertEmployees, (err) => {
        if (err) { console.log(err) } else { console.log("insert Employees") }
      });
      db.run(cardsTable, (err) => {
        if (err) { console.log(err) } else { console.log("Creating table Cards") }
      });
      db.run(transactionTable, (err) => {
        if (err) { console.log(err) } else { console.log("Create Transactions") }
      });

  });
}

module.exports = { connect, init }