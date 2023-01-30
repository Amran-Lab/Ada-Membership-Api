const employeeTable = `
CREATE TABLE Employee (
  employee_id VARCHAR(16)  PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL
);
`;

module.exports = { employeeTable };