import departmentsData from "@/services/mockData/departments.json";

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.departments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const department = this.departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error(`Department with ID ${id} not found`);
    }
    return { ...department };
  }

  async create(departmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const highestId = Math.max(...this.departments.map(dept => dept.Id), 0);
    const newDepartment = {
      Id: highestId + 1,
      ...departmentData,
      employeeCount: 0
    };
    
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    
    const updatedDepartment = {
      ...this.departments[index],
      ...departmentData,
      Id: parseInt(id)
    };
    
    this.departments[index] = updatedDepartment;
    return { ...updatedDepartment };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    
    const deletedDepartment = this.departments.splice(index, 1)[0];
    return { ...deletedDepartment };
  }
}

export const departmentService = new DepartmentService();