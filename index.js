const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

init();

function init() {
  const logoText = logo({ name: "Employee Tracker" }).render();

  console.log(logoText);

  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View",
        "Add",
        "Remove",
        "Update",
        "Quit"
      ]
    }
  ]).then((res) => {
    switch (res.action) {
      case "View":
        viewOptions();
        break;
      case "Add":
        addOptions();
        break;
      case "Remove":
        removeOptions();
        break;
      case "Update":
        updateOptions();
        break;
      case "Quit":
        quit();
        break;
      default:
        console.error("Invalid choice");
    }
  }).catch((error) => {
    console.error("Error loading main prompts:", error);
  });
}

function viewOptions() {
  prompt([
    {
      type: "list",
      name: "viewAction",
      message: "What would you like to view?",
      choices: [
        "View all employees",
        "View all roles",
        "View all departments",
        "View employees by manager",
        "View employees by department",
        "View budget by department"
      ]
    }
  ]).then((res) => {
    switch (res.viewAction) {
      case "View all employees":
        viewEmployees();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all departments":
        viewDepartments();
        break;
      case "View employees by manager":
        viewEmployeesByManager();
        break;
      case "View employees by department":
        viewEmployeesByDepartment();
        break;
      case "View budget by department":
        viewBudgetByDepartment();
        break;
      default:
        console.error("Invalid view choice");
    }
  }).catch((error) => {
    console.error("Error loading view options:", error);
  });
}

function addOptions() {
  prompt([
    {
      type: "list",
      name: "addAction",
      message: "What would you like to add?",
      choices: [
        "Add an employee",
        "Add a role",
        "Add a department"
      ]
    }
  ]).then((res) => {
    switch (res.addAction) {
      case "Add an employee":
        addEmployee();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add a department":
        addDepartment();
        break;
      default:
        console.error("Invalid add choice");
    }
  }).catch((error) => {
    console.error("Error loading add options:", error);
  });
}

function removeOptions() {
  prompt([
    {
      type: "list",
      name: "removeAction",
      message: "What would you like to remove?",
      choices: [
        "Remove an employee",
        "Remove a role",
        "Remove a department"
      ]
    }
  ]).then((res) => {
    switch (res.removeAction) {
      case "Remove an employee":
        removeEmployee();
        break;
      case "Remove a role":
        removeRole();
        break;
      case "Remove a department":
        removeDepartment();
        break;
      default:
        console.error("Invalid remove choice");
    }
  }).catch((error) => {
    console.error("Error loading remove options:", error);
  });
}

function updateOptions() {
  prompt([
    {
      type: "list",
      name: "updateAction",
      message: "What would you like to update?",
      choices: [
        "Update an employee's role",
        "Update an employee's manager"
      ]
    }
  ]).then((res) => {
    switch (res.updateAction) {
      case "Update an employee's role":
        updateEmployeeRole();
        break;
      case "Update an employee's manager":
        updateEmployeeManager();
        break;
      default:
        console.error("Invalid update choice");
    }
  }).catch((error) => {
    console.error("Error loading update options:", error);
  });
}

function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => {
      let employees = rows;
      console.log("Viewing all employees");
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}


function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]).then((res) => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    db.findAllRoles().then(({ rows }) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      }).then((res) => {
        let roleId = res.roleId;

        db.findAllEmployees().then(({ rows }) => {
          let employees = rows;
          const managerChoices = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          managerChoices.unshift({ name: "None", value: null });

          prompt({
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices,
          })
            .then((res) => {
              let employee = {
                manager_id: res.managerId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
              };

              db.createEmployee(employee);
            })
            .then(() =>
              console.log(`Added ${firstName} ${lastName} to the database`)
            )
            .then(() => loadMainPrompts());
        });
      });
    });
  });
}

function removeEmployee() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: employeeChoices,
      },
    ])
      .then((res) => db.removeEmployee(res.employeeId))
      .then(() => console.log("Removed selected employee from the database"))
      .then(() => loadMainPrompts());
  });
}


function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      let roles = rows;
      console.log("Viewing all Roles");
      console.table(roles);
    })
    .then(() => loadMainPrompts());
}

function addRole() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        name: "title",
        message: "What is the name of the role?",
      },
      {
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ]).then((role) => {
      db.createRole(role)
        .then(() => console.log(`Added ${role.title} to the database`))
        .then(() => loadMainPrompts());
    });
  });
}

 async function removeRole() {
  db.findAllRoles().then(({ rows }) => {
    let roles = rows;
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "roleId",
        message:
          "Which role do you want to remove?",
        choices: roleChoices,
      },
    ])
      .then((res) => db.removeRole(res.roleId))
      .then(() => console.log("Removed role from the database."))
      .then(() => loadMainPrompts());
  });
}

function updateEmployeeRole() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllRoles().then(({ rows }) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        prompt([
          {
            type: "list",
            name: "roleId",
            message:
              "Which role do you want to assign to the selected employee?",
            choices: roleChoices,
          },
        ])
          .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
          .then(() => console.log("Updated employee's role."))
          .then(() => loadMainPrompts());
      });
    });
  });
}

function viewDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      let departments = rows;
      console.log("Viewing all Departments");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}

function addDepartment() {
  prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]).then((res) => {
    let name = res;
    db.createDepartment(name)
      .then(() => console.log(`Added ${name.name} to the database`))
      .then(() => loadMainPrompts());
  });
}

async function removeDepartment() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt({
      type: "list",
      name: "departmentId",
      message:
        "Which department would you like to remove?",
      choices: departmentChoices,
    })
      .then((res) => db.removeDepartment(res.departmentId))
      .then(() => console.log(`Removed department from the database`))
      .then(() => loadMainPrompts());
  });
}

function updateEmployeeManager() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's manager do you want to update?",
        choices: employeeChoices,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllPossibleManagers(employeeId).then(({ rows }) => {
        let managers = rows;
        const managerChoices = managers.map(
          ({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          })
        );

        prompt([
          {
            type: "list",
            name: "managerId",
            message:
              "Which employee do you want to set as the manager for the selected employee?",
            choices: managerChoices,
          },
        ])
          .then((res) => db.updateEmployeeManager(employeeId, res.managerId))
          .then(() => console.log("Updated employee's manager."))
          .then(() => loadMainPrompts());
      });
    });
  });
}

function viewEmployeesByManager() {
  db.findAllEmployees().then(({ rows }) => {
    let managers = rows;
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which manager do you want to see direct reports for?",
        choices: managerChoices,
      },
    ])
      .then((res) => db.findAllEmployeesByManager(res.managerId))
      .then(({ rows }) => {
        let employees = rows;
        console.log("Viewing employees under this manager.");
        if (employees.length === 0) {
          console.log("The selected manager has employees reporting to them.");
        } else {
          console.table(employees);
        }
      })
      .then(() => loadMainPrompts());
  });
}

function viewEmployeesByDepartment() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to see employees for?",
        choices: departmentChoices,
      },
    ])
      .then((res) => db.findAllEmployeesByDepartment(res.departmentId))
      .then(({ rows }) => {
        let employees = rows;
        console.log("Viewing employees in this department");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  });
}

function viewBudgetByDepartment() {
  db.viewDepartmentBudgets()
    .then(({ rows }) => {
      let departments = rows;
      console.log("Viewing budget of department");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}

function quit() {
  console.log("See you later!");
  process.exit();
}