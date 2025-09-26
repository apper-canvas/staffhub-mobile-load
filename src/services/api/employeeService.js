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
    // Import logger service for activity tracking
    const { loggerService } = await import('./loggerService.js');
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
        
        // Employee created successfully, now send SMS notification
        const createdEmployee = successful.length > 0 ? successful[0].data : null;
        
        if (createdEmployee && employeeData.phone_c && employeeData.first_name_c) {
          try {
            // Initialize ApperClient for Edge function call
            const { ApperClient } = window.ApperSDK;
            const apperClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            });
            
            // Call SMS Edge function asynchronously
            await apperClient.functions.invoke(import.meta.env.VITE_SEND_EMPLOYEE_SMS, {
              body: JSON.stringify({
                firstName: employeeData.first_name_c,
                phoneNumber: employeeData.phone_c
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log('SMS notification sent successfully to new employee');
          } catch (smsError) {
            // Log SMS error but don't fail the employee creation
            console.error('Failed to send SMS notification:', smsError);
          }
        }
// Log employee creation activity
        try {
          await loggerService.create({
            log_level_c: 'info',
            message_c: `Employee created: ${employeeData.first_name_c} ${employeeData.last_name_c}`,
            employee_c: createdEmployee?.Id,
            Tags: 'employee,create,activity'
          });
        } catch (logError) {
          console.error('Failed to log employee creation:', logError);
        }
        
        return createdEmployee;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating employee:", error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

async update(id, employeeData) {
    // Import logger service for activity tracking
    const { loggerService } = await import('./loggerService.js');
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
        
const updatedEmployee = successful.length > 0 ? successful[0].data : null;
        
        // Log employee update activity
        try {
          await loggerService.create({
            log_level_c: 'info',
            message_c: `Employee updated: ${employeeData.first_name_c} ${employeeData.last_name_c}`,
            employee_c: parseInt(id),
            Tags: 'employee,update,activity'
          });
        } catch (logError) {
          console.error('Failed to log employee update:', logError);
        }
        
        return updatedEmployee;
      }
    } catch (error) {
      console.error("Error updating employee:", error?.response?.data?.message || error);
      throw error;
    }
  }

async delete(id) {
    // Import logger service for activity tracking
    const { loggerService } = await import('./loggerService.js');
    
    // Get employee info before deletion for logging
    let employeeName = 'Unknown Employee';
    try {
      const employee = await this.getById(id);
      employeeName = `${employee.first_name_c || ''} ${employee.last_name_c || ''}`.trim();
    } catch (error) {
      console.error('Could not get employee info for logging:', error);
    }
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
      
// Log employee deletion activity
      try {
        await loggerService.create({
          log_level_c: 'warning',
          message_c: `Employee deleted: ${employeeName}`,
          employee_c: parseInt(id),
          Tags: 'employee,delete,activity'
        });
      } catch (logError) {
        console.error('Failed to log employee deletion:', logError);
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