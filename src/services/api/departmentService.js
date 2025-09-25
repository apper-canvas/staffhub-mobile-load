class DepartmentService {
  constructor() {
    this.tableName = 'department_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "budget_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "budget_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Department with ID ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(departmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Name: departmentData.name_c,
          name_c: departmentData.name_c,
          description_c: departmentData.description_c,
          head_of_department_c: departmentData.head_of_department_c,
          employee_count_c: parseInt(departmentData.employee_count_c) || 0,
          budget_c: parseInt(departmentData.budget_c) || 0
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.name_c,
          name_c: departmentData.name_c,
          description_c: departmentData.description_c,
          head_of_department_c: departmentData.head_of_department_c,
          employee_count_c: parseInt(departmentData.employee_count_c) || 0,
          budget_c: parseInt(departmentData.budget_c) || 0
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();