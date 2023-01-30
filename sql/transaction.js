const transactionTable = `
CREATE TABLE Transactions (
  transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id VARCHAR(50) NOT NULL,
  value INT NOT NULL,
  FOREIGN KEY (card_id) REFERENCES Card(card_id)
);
`;

module.exports = { transactionTable };