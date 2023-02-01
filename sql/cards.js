const cardsTable = `
CREATE TABLE Card (
  card_id VARCHAR(16) PRIMARY KEY NOT NULL,
  employee_id VARCHAR(16) NOT NULL,
  pin VARCHAR(300) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);
`;

module.exports = { cardsTable };