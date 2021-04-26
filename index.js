const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table')
const connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_trackerDB'

})

connection.connect(() => {

    console.log('We\'re Connected', connection.threadId);
    start()
});

function start() {

    inquirer.prompt({

        type: 'list',
        message: 'What would you like to do?',
        choices: ['ADD Department', 'VIEW Department', 'ADD Employee', 'VIEW Employee', 'ADD Role', 'VIEW Role', 'UPDATE Employee Role'],
        name: 'userChoice'

    }).then(res => {
        switch (res.userChoice) {
            case 'ADD Department':
                addDepartmnt();
                break
            case 'VIEW Department':
                viewDepartment();
                break
            case 'ADD Employee':
                addEmployee();
                break

            case 'VIEW Employee':
                viewEmployee();
                break
               
            case 'ADD Role':
                addRole();
                break
            case 'VIEW Role':
                viewRole();
                break
            case 'UPDATE Employee Role':
                updateRole();
                break

        }


    })

}

function addDepartmnt() {
    inquirer.prompt([{

        type: 'input',
        message: 'What type of Department?',
        name: 'newdepartment',

    }]).then(res => {
        connection.query('INSERT INTO department (name) VALUES (?)', res.newdepartment, (err, data) => {

            console.log('Department has been added');
            start()
        })
    })

}

function viewDepartment() {

    connection.query('SELECT * FROM department', (err, data) => {
        console.table(data)
        start()

    })

}

function viewEmployee() {

    connection.query('SELECT * FROM employee', (err, data) => {
        console.table(data)
        start()

    })
}

function viewRole() {
    connection.query('SELECT * FROM role', (err, data) => {
        console.table(data)
        start()
    })

}

function addRole() {

    inquirer.prompt([{

        type: 'input',
        message: 'What is the name of the Role?',
        name: 'newrole',

    }, {
        type: 'input',
        message: 'What is the Salary?',
        name: 'salary'


    }]).then(res => {
        connection.query('INSERT INTO role (title, salary) VALUES (?,?)', [res.newrole, res.salary], (err, data) => {

            console.log('Role has been added');
            start()
        })
    })

}

function updateRole() {
    connection.query('SELECT last_name, role.title FROM employee JOIN role ON employee.role_id = role.id', (err, empData) => {
            console.log(empData)
            inquirer.prompt([{
                name: 'lastname',
                type: 'rawlist',
                choices: function () {
                    var lastName = [];
                    for (var i = 0; i < empData.length; i++) {
                        lastName.push(empData[i].last_name)
                    }
                    return lastName;
                },
                message: "What is the Employee's last name?",

            }, {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: viewRole()
            }]).then(function (update) {
                    const name = viewRole().indexOf(update.role) + 1
                    connection.query('UPDATE employee SET WHERE ?', {
                            last_name: update.lastname
                        }, {
                            role_id: roleId
                        },
                        console.table(name));
                    start()

                })
            })
    }

    function addEmployee() {
        connection.query('SELECT * FROM role', (err, roleData) => {
            const roles = roleData.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
            connection.query('SELECT * FROM employee', (err, employeeData) => {
                const managers = employeeData.map(manager => {
                    return {
                        name: manager.first_name + ' ' + manager.last_name,
                        value: manager.id
                    }
                })

                inquirer.prompt([{
                        type: 'input',
                        message: 'Enter First Name:',
                        name: 'employeefirst',



                    }, {
                        type: 'input',
                        message: 'Enter Last Name:',
                        name: 'employeelast'

                    }, {
                        type: 'list',
                        message: 'Select Title:',
                        choices: roles,
                        name: 'roleid'
                    },
                    {
                        type: 'list',
                        message: 'Select Manager:',
                        name: 'managerid',
                        choices: managers
                    }

                ]).then(res => {
                    connection.query('INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?,?,?,?)', [res.employeefirst, res.employeelast, res.managerid, res.roleid], (err, data) => {

                        console.log('Employee Has Been Added');
                        start()

                    })
                })
            })


        })


    }