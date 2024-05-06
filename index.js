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
          "View all employees",
          "View all roles",
          "View all departments",
          "Add an employee",
          "Add a role",
          "Add a department",
          "Quit"
        ]
      }
    ]).then((res) => {
      switch (res.action) {
        case "View all employees":
          viewEmployees();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all departments":
          viewDepartments();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add a department":
          addDepartment();
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

function viewEmployees() {
    // View employees
    console.log("Viewing all employees");
  }
  
  function addEmployee() {
    // Add employees
    console.log("Adding new employee");
  }
  
  function viewRoles() {
    // view roles
    console.log("Viewing all roles");
  }
  
  function addRole() {
    // Add role
    console.log("Adding new role");
  }
  
  function viewDepartments() {
    // view departments
    console.log("Viewing all departments");
  }
  
  function addDepartment() {
    // add department
    console.log("Adding a department");
  }
  
  function quit() {
    console.log("See you later!");
    process.exit();
  }