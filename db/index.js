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
    const sql = `
      SELECT e.*, r.title AS role_title, d.name AS department_name, m.first_name || ' ' || m.last_name AS manager_name
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
    `;
    return this.query(sql);
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

  async createEmployee(employeeData) {
    const sql = `
      INSERT INTO employees (first_name, last_name, email, role_id, department_id, manager_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    return this.query(sql, [
      employeeData.firstName,
      employeeData.lastName,
      employeeData.email,
      employeeData.roleId,
      employeeData.departmentId,
      employeeData.managerId,
    ]);
  }

  async removeEmployee(id) {
    const sql = `DELETE FROM employees WHERE id = $1`;
    return this.query(sql, [id]);
  }

  async updateEmployeeRole(employeeId, roleId) {
    const sql = `UPDATE employees SET role_id = $2 WHERE id = $1`;
    return this.query(sql, [employeeId, roleId]);
  }

  async updateEmployeeManager(employeeId, managerId) {
    const sql = `UPDATE employees SET manager_id = $2 WHERE id = $1`;
    return this.query(sql, [employeeId, managerId]);
  }

  async findAllRoles() {
    const sql = `
      SELECT r.*, d.name AS department_name
      FROM roles r
      LEFT JOIN departments d ON r.department_id = d.id
    `;
    return this.query(sql);
  }

  async createRole(roleData) {
    const sql = `
      INSERT INTO roles (title, department_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    return this.query(sql, [roleData.title, roleData.departmentId]);
  }

  async removeRole(id) {
    const sql = `DELETE FROM roles WHERE id = $1`;
    return this.query(sql, [id]);
  }

  async findAllDepartments() {
    const sql = `SELECT * FROM departments`;
    return this.query(sql);
  }

  async createDepartment(departmentData) {
    const sql = `
      INSERT INTO departments (name, budget)
      VALUES ($1, $2)
      RETURNING *
    `;
    return this.query(sql, [departmentData.name, departmentData.budget]);
  }

  async removeDepartment(id) {
    const sql = `DELETE FROM departments WHERE id = $1`;
    return this.query(sql, [id]);
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

  async findEmployeesByManager(managerId) {
    const sql = `
      SELECT e.*, r.title AS role_title, d.name AS department_name
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.manager_id = $1
    `;
    return this.query(sql, [managerId]);
  }
}

module.exports = new DB();