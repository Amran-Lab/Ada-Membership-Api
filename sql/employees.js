const employeeTable = `
CREATE TABLE Employee (
  employee_id VARCHAR(16) PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(300) NOT NULL,
  mobile INT NOT NULL
);
`;

module.exports = { employeeTable };