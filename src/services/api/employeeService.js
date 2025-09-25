class EmployeeService {
  constructor() {
    this.tableName = 'employee_c';
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "department_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "department_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Employee with ID ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

async create(employeeData) {
    try {
      // Ensure ApperClient is initialized
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields based on schema - removed created_at_c and updated_at_c as they don't exist in employee_c schema
      const params = {
        records: [{
          Name: `${employeeData.first_name_c || ''} ${employeeData.last_name_c || ''}`.trim(),
          first_name_c: employeeData.first_name_c,
          last_name_c: employeeData.last_name_c,
          email_c: employeeData.email_c,
          phone_c: employeeData.phone_c,
          position_c: employeeData.position_c,
          start_date_c: employeeData.start_date_c,
          status_c: employeeData.status_c || 'active',
          salary_c: parseInt(employeeData.salary_c) || 0,
          manager_c: employeeData.manager_c,
          department_c: employeeData.department_c ? parseInt(employeeData.department_c) : null
        }]
      };
      
      console.log('Creating employee with data:', params);
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('API Error:', response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} employees:`, JSON.stringify(failed));
          // Use the actual error message from the API response
          const errorMessage = failed[0]?.message || failed[0]?.errors?.[0] || 'Failed to create employee';
          throw new Error(errorMessage);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating employee:", error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  async update(id, employeeData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${employeeData.first_name_c || ''} ${employeeData.last_name_c || ''}`.trim(),
          first_name_c: employeeData.first_name_c,
          last_name_c: employeeData.last_name_c,
          email_c: employeeData.email_c,
          phone_c: employeeData.phone_c,
          position_c: employeeData.position_c,
          start_date_c: employeeData.start_date_c,
          status_c: employeeData.status_c,
          salary_c: parseInt(employeeData.salary_c) || 0,
          manager_c: employeeData.manager_c,
          updated_at_c: new Date().toISOString(),
          department_c: parseInt(employeeData.department_c) || null
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
          console.error(`Failed to update ${failed.length} employees:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating employee:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} employees:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting employee:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByDepartment(departmentId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "department_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [parseInt(departmentId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by status:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const employeeService = new EmployeeService();