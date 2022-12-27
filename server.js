const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use (express.json());

const db = mysql.createConnection({
    
    host: 'localhost',
    user: 'root',
    database: "employee_db"
});

db.connect(function(err) {
    if(err) throw err;
    start();
});

function start() {
    inquirer.prompt(
        {
            name:"action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]
        })
    .then(function(answer) {
        if (answer.action === 'View All Departments') {
            viewDepartments();
        } else if (answer.action === 'View All Roles') {
            viewRoles();
        } else if (answer.action === 'View All Employees') {
            viewEmployees();
        } else if (answer.action === 'Add Department') {
            addDepartment();
        } else if (answer.action === 'Add Role') {
            addRole();
        } else if (answer.action === 'Add Employee') {
            addEmployee();
        } else if (answer.action === 'Update Employee Role') {
            updateRole();
        }
        else if (answer.action === 'Quit') {
            connection.end();
        }
    })
}

function viewDepartments() {
    var query = "SELECT * FROM department";
      connection.query(query, function(err, res) {
          console.log(`DEPARTMENTS:`)
        res.forEach(department => {
            console.log(`ID: ${department.id} | Name: ${department.name}`)
        })
        start();
        });
    };

function viewRoles() {
    var query = "SELECT * FROM role";
        connection.query(query, function(err, res) {
            console.log(`ROLES:`)
        res.forEach(role => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
        })
        start();
        });
    };

function viewEmployees() {
    var query = "SELECT * FROM employee";
        connection.query(query, function(err, res) {
            console.log(`EMPLOYEES:`)
        res.forEach(employee => {
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        })
        start();
        });
    };

function addDepartment() {
    inquirer.prompt(
        {
            name: "department",
            type: "input",
            message: "What is the name of the department?",
          })
        .then(function(answer) {
        var query = "INSERT INTO department (name) VALUES ( ? )";
        connection.query(query, answer.department, function(err, res) {
            console.log(`You have added this department: ${(answer.department).toUpperCase()}.`)
        })
        viewDepartments();
        })
}

function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw (err);
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the role?",
          }, 
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?",
          },
          {
            name: "departmentName",
            type: "list",
            message: "Which department does the role belong to?",
            choices: function() {
                var choicesArray = [];
                res.forEach(res => {
                    choicesArray.push(
                        res.name
                    );
                })
                return choicesArray;
              }
          }
          ]) 

          .then(function(answer) {
        const department = answer.departmentName;
        connection.query('SELECT * FROM DEPARTMENT', function(err, res) {
        
            if (err) throw (err);
         let filteredDept = res.filter(function(res) {
            return res.name == department;
        }
        )
        let id = filteredDept[0].id;
       let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
       let values = [answer.title, parseInt(answer.salary), id]
       console.log(values);
        connection.query(query, values,
            function(err, res, fields) {
            console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
        })
            viewRoles()
            })
        })
    })
}

async function addEmployee() {
    connection.query('SELECT * FROM role', function(err, result) {
        if (err) throw (err);
    inquirer.prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
          }, 
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "roleName",
            type: "list",
            message: "What is the employee's role?",
            choices: function() {
             rolesArray = [];
                result.forEach(result => {
                    rolesArray.push(
                        result.title
                    );
                })
                return rolesArray;
              }
          }
          ]) 

          .then(function(answer) {
        console.log(answer);
        const role = answer.roleName;
        connection.query('SELECT * FROM role', function(err, res) {
            if (err) throw (err);
            let filteredRole = res.filter(function(res) {
                return res.title == role;
            })
        let roleId = filteredRole[0].id;
        connection.query("SELECT * FROM employee", function(err, res) {
                inquirer
                .prompt ([
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices: function() {
                            managersArray = []
                            res.forEach(res => {
                                managersArray.push(
                                    res.last_name)
                                
                            })
                            return managersArray;
                        }
                    }
                ]).then(function(managerAnswer) {
                    const manager = managerAnswer.manager;
                connection.query('SELECT * FROM employee', function(err, res) {
                if (err) throw (err);
                let filteredManager = res.filter(function(res) {
                return res.last_name == manager;
            })
            let managerId = filteredManager[0].id;
                    console.log(managerAnswer);
                    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    let values = [answer.firstName, answer.lastName, roleId, managerId]
                    console.log(values);
                     connection.query(query, values,
                         function(err, res, fields) {
                         console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                        })
                        viewEmployees();
                        })
                     })
                })
            })
        })
})
}

function updateRole() {
    connection.query('SELECT * FROM employee', function(err, result) {
        if (err) throw (err);
    inquirer.prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: function() {
             employeeArray = [];
                result.forEach(result => {
                    employeeArray.push(
                        result.last_name
                    );
                })
                return employeeArray;
              }
          }
          ]) 
        .then(function(answer) {
        console.log(answer);
        const name = answer.employeeName;
        connection.query("SELECT * FROM role", function(err, res) {
                inquirer.prompt([
                    {
                        name: "role",
                        type: "list",
                        message: "Which role do you want to assign the selected employee?",
                        choices: function() {
                            rolesArray = [];
                            res.forEach(res => {
                                rolesArray.push(
                                    res.title)
                                
                            })
                            return rolesArray;
                        }
                    }
                ]).then(function(rolesAnswer) {
                    const role = rolesAnswer.role;
                    console.log(rolesAnswer.role);
                connection.query('SELECT * FROM role WHERE title = ?', [role], function(err, res) {
                if (err) throw (err);
                    let roleId = res[0].id;
                    let query = "UPDATE employee SET role_id ? WHERE last_name ?";
                    let values = [roleId, name]
                    console.log(values);
                     connection.query(query, values,
                         function(err, res, fields) {
                         console.log(`You have updated ${name}'s role to ${role}.`)
                        })
                        viewEmployees();
                        })
                     })
                })
            
            })
        })

    }
