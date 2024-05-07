INSERT INTO department
    (name)
VALUES
    ('Manager'),
    ('Engineering'),
    ('Sales'),
    ('Accounting'),
    ('HR'),
    ('Security');


INSERT INTO role
    (title, salary, department_id)
VALUES
    ('General Manager', 135000, 1),
    ('Director of Engineering', 115000, 2),
    ('Engineer', 85000, 2),
    ('Sales Director', 100000, 3),
    ('Sales Representative', 50000, 3),
    ('Chief accounting officer', 110000, 4),
    ('Accountant', 65000, 4),
    ('Chief human resources officer', 100000, 5),
    ('Human Resources', 65000, 5),
    ('Director of Security', 105000, 6),
    ('Security Guard', 50000, 6);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Mr', 'Boss', 1, NULL),
    ('Hank', 'Hill', 2, 1),
    ('Homer', 'Simpson', 3, 2),
    ('Cleveland', 'Brown', 4, 1),
    ('Philip J.', 'Fry', 5, 4),
    ('Frylock', '', 6, 1),
    ('BoJack', 'Horseman', 7, 6),
    ('Peter', 'Griffin', 8, 1),
    ('Bob', 'Belcher', 9, 8),
    ('Stan', 'Smith', 10, 1),
    ('Early', 'Cuyler', 11, 10);
