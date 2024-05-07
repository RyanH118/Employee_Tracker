const pool = require("./connection");

class DB {
  constructor() {}

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  async findAllEmployees() {
    return this.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
       CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id 
       LEFT JOIN department on role.department_id = department.id 
       LEFT JOIN employee manager on manager.id = employee.manager_id;`
    );
  }

  async findEmployeesExcept(id) {
    const sql = `
      SELECT e.*, r.title AS role_title, d.name AS department_name, m.first_name || ' ' || m.last_name AS manager_name
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id <> $1
    `;
    return this.query(sql, [id]);
  }

  findAllPossibleManagers(employeeId) {
    return this.query(
      'SELECT id, first_name, last_name FROM employee WHERE id != $1',
      [employeeId]
    );
  }

  async createEmployee(employee) {
    const { first_name, last_name, role_id, manager_id } = employee;
    return this.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
  }

  async removeEmployee(employeeId) {
    return this.query('DELETE FROM employee WHERE id = $1', [employeeId]);
  }

  async updateEmployeeRole(employeeId, roleId) {
    return this.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
      roleId,
      employeeId,
    ]);
  }

  async updateEmployeeManager(employeeId, managerId) {
    return this.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [
      managerId,
      employeeId,
    ]);
  }

  async findAllRoles() {
    return this.query(
      `SELECT role.id, role.title, department.name AS department, role.salary FROM role
       LEFT JOIN department on role.department_id = department.id;`
    );
  }

  async createRole(role) {
    const { title, salary, department_id } = role;
    return this.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, department_id]
    );
  }

  async removeRole(roleId) {
    return this.query('DELETE FROM role WHERE id = $1', [roleId]);
  }

  async findAllDepartments() {
    return this.query('SELECT department.id, department.name FROM department;');
  }

  // Find all departments, join with employees and roles and sum up utilized department budget
  viewDepartmentBudgets() {
    return this.query(
      `SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee 
      LEFT JOIN role on employee.role_id = role.id 
      LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;`
    );
  }


  async createDepartment(department) {
    return this.query('INSERT INTO department (name) VALUES ($1)', [
      department.name,
    ]);
  }

  async removeDepartment(departmentId) {
    return this.query('DELETE FROM department WHERE id = $1', [departmentId]);
  }

  async findEmployeesInDepartment(departmentId) {
    const sql = `
      SELECT e.*, r.title AS role_title
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      WHERE e.department_id = $1
    `;
    return this.query(sql, [departmentId]);
  }

  async findAllEmployeesByManager(managerId) {
    return this.query(
      `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title
       FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id
        WHERE manager_id = $1;`,
      [managerId]
    );
  }
}

module.exports = new DB();