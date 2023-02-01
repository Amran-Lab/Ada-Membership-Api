const insertEmployees = `
INSERT INTO Employee(employee_id,name, email, mobile)
VALUES('employee1','Jim', 'employee@test.com', 123)`;

module.exports = { insertEmployees };