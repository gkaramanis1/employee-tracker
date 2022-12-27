USE employee_db;

INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Legal");

INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 80, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 60, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 100, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer", 100, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Lawyer", 150, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("George", "Karamanis", 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Eric", "Smith", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Johnny", "Matos", 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Cindy", "Samaan", 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Daniel", "Vilece", 5);