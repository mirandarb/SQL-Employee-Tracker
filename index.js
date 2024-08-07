const inquirer = require("inquirer");
const { Pool } = require('pg');


const pool = new Pool(
    {
        user: 'postgres',
        password: '2024Mochabear',
        host: 'localhost',
        database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker database.`)
)

pool.connect();

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                "View All departments",
                "View All Employees",
                'View All Roles',
                "Add Department",
                "Add Role",
                "Add an Employee",
                "Update Employee Role"
            ],
            name: 'add',
        }

    ])


        .then((response) => {

            if (response.add === 'Add Department') {
                createDepartment();

            } else if (response.add === 'Add Role') {
                addRole();

            } else if (response.add === 'Add an Employee') {
                addEmployees();

            } else if (response.add === 'Update Employee Role') {


            } else if (response.add === 'View All departments') {
                displayDepartments();

            } else if (response.add === 'View All Employees') {
                displayEmployees();

            } else if (response.add === 'View All Roles') {
                displayRoles();

            }
        },


        )
}

function createDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'department',
        }
    ])
        .then((response) => {
            const sql = `INSERT INTO department (name)
                    VALUES ($1)`
            const params = [response.department]
            pool.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }

                promptUser()
            });

        })
}

function addRole() {
    pool.query('SELECT * FROM department', (err, { rows }) => {


        const departmentArray = rows.map((depart) => {
            return {
                name: depart.name,
                value: depart.id
            }
        })

        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'title',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: departmentArray,
                name: 'department_id',
            }

        ])
            .then((response) => {
                const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES ($1, $2, $3)`;

                const params = [response.title, response.salary, response.department_id];

                pool.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                        return;
                    }



                    promptUser()
                });
            });
    })

}

function addEmployees() {
    pool.query('SELECT * FROM role', (err, { rows }) => {

        const roleArray = rows.map((role) => {
            return {
                name: role.title,
                value: role.id,
            }
        })

        pool.query('SELECT * FROM employee', (err, { rows }) => {

            const managerArray = rows.map((manag) => {
                return {
                    name: `${manag.first_name} ${manag.last_name}`,
                    value: manag.id,
                }
            })

            managerArray.push({
                name: 'No Manager',
                value: null
            })

            inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the employees first name?',
                    name: 'first',
                },
                {
                    type: 'input',
                    message: 'What is the employees last name?',
                    name: 'last',
                },
                {
                    type: 'list',
                    message: 'What is the employees role?',
                    choices: roleArray,
                    name: 'role',
                },
                {
                    type: 'list',
                    message: 'Who is the employees manager?',
                    choices: managerArray,
                    name: 'manager',
                }

            ])
                .then((response) => {
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES ($1, $2, $3, $4)`

                    const params = [response.first, response.last, response.role, response.manager]
                    pool.query(sql, params, (err, result) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        promptUser()
                    });
                });
        })

    })
}




function displayDepartments() {
    const sql = 'SELECT * FROM department';

    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        console.table(result.rows)

        promptUser()
    })
};

function displayRoles() {
    // title, id, department name, salary
    const sql = 'SELECT role.id, role.title, department.name, role.salary FROM role JOIN department ON role.department_id = department.id';


    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        console.table(result.rows)

        promptUser()
    })
}


function displayEmployees() {
    // WHEN I choose to view all employees
    // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id';

    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        console.table(result.rows)

        promptUser()
    })
}


promptUser();