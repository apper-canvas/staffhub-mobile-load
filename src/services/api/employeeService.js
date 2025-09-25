import employeesData from "@/services/mockData/employees.json";

class EmployeeService {
  constructor() {
    this.employees = [...employeesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.employees];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const employee = this.employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    return { ...employee };
  }

  async create(employeeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const highestId = Math.max(...this.employees.map(emp => emp.Id), 0);
    const newEmployee = {
      Id: highestId + 1,
      ...employeeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.employees.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, employeeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    
    const updatedEmployee = {
      ...this.employees[index],
      ...employeeData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    this.employees[index] = updatedEmployee;
    return { ...updatedEmployee };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    
    const deletedEmployee = this.employees.splice(index, 1)[0];
    return { ...deletedEmployee };
  }

  async getByDepartment(department) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.employees.filter(emp => emp.department === department).map(emp => ({ ...emp }));
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.employees.filter(emp => emp.status === status).map(emp => ({ ...emp }));
  }
}

export const employeeService = new EmployeeService();