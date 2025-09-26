class LoggerService {
  constructor() {
    this.tableName = 'logger_c';
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
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "log_level_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "employee_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching logger entries:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "log_level_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "employee_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Logger entry with ID ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching logger entry ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(logData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Name: logData.Name || `${logData.log_level_c || 'info'} - ${new Date().toLocaleString()}`,
          Tags: logData.Tags || '',
          timestamp_c: logData.timestamp_c || new Date().toISOString(),
          log_level_c: logData.log_level_c || 'info',
          message_c: logData.message_c || '',
          employee_c: logData.employee_c ? parseInt(logData.employee_c) : null
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('API Error:', response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} logger entries:`, JSON.stringify(failed));
          const errorMessage = failed[0]?.message || failed[0]?.errors?.[0] || 'Failed to create logger entry';
          throw new Error(errorMessage);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating logger entry:", error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  async update(id, logData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: logData.Name || `${logData.log_level_c || 'info'} - ${new Date().toLocaleString()}`,
          Tags: logData.Tags || '',
          timestamp_c: logData.timestamp_c || new Date().toISOString(),
          log_level_c: logData.log_level_c || 'info',
          message_c: logData.message_c || '',
          employee_c: logData.employee_c ? parseInt(logData.employee_c) : null
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
          console.error(`Failed to update ${failed.length} logger entries:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating logger entry:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} logger entries:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting logger entry:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByLogLevel(logLevel) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "log_level_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "employee_c"}}
        ],
        where: [{"FieldName": "log_level_c", "Operator": "EqualTo", "Values": [logLevel]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching logger entries by log level:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByEmployee(employeeId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "log_level_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "employee_c"}}
        ],
        where: [{"FieldName": "employee_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching logger entries by employee:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const loggerService = new LoggerService();