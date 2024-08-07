INSERT INTO department (name)
VALUES ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Person', 100000, 1 ),
('Sales Manager', 150000, 1),
('Engineer', 80000, 2),
('Engineer Manager', 180000, 2,)
('Financial', 90000, 3),
('Finance Manager', 180000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('James', 'Jones', 2, NULL),
('Mary', 'James', 1, 1),
('Bruce', 'Walker', 4, NULL),
('Miranda', 'Rose', 6, NULL),
('Tom', 'Smith', 3, 3);