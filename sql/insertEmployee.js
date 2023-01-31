const insertEmployees = `
INSERT INTO Employee(employee_id,name, email, mobile)
VALUES('abc-123','Jim', 't1@test.com', 123),
('xyx-456','Brown', 't2@test.com', 456);
`;

module.exports = { insertEmployees };