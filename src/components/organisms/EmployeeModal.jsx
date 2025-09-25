import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";

const EmployeeModal = ({ isOpen, onClose, employee, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    position_c: "",
    department_c: "",
    start_date_c: "",
    status_c: "active",
    salary_c: "",
    manager_c: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadDepartments();
if (employee) {
        setFormData({
          first_name_c: employee.first_name_c || "",
          last_name_c: employee.last_name_c || "",
          email_c: employee.email_c || "",
          phone_c: employee.phone_c || "",
          position_c: employee.position_c || "",
          department_c: employee.department_c?.Id || "",
          start_date_c: employee.start_date_c ? employee.start_date_c.split('T')[0] : "",
          status_c: employee.status_c || "active",
          salary_c: employee.salary_c ? employee.salary_c.toString() : "",
          manager_c: employee.manager_c || ""
        });
} else {
        setFormData({
          first_name_c: "",
          last_name_c: "",
          email_c: "",
          phone_c: "",
          position_c: "",
          department_c: "",
          start_date_c: "",
          status_c: "active",
          salary_c: "",
          manager_c: ""
        });
      }
      setErrors({});
    }
  }, [isOpen, employee]);

  const loadDepartments = async () => {
    try {
      const departmentData = await departmentService.getAll();
setDepartments(departmentData.map(dept => ({
        value: dept.Id,
        label: dept.name_c || dept.Name
      })));
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address";
    }
    if (!formData.phone_c.trim()) newErrors.phone_c = "Phone number is required";
    if (!formData.position_c.trim()) newErrors.position_c = "Position is required";
    if (!formData.department_c) newErrors.department_c = "Department is required";
    if (!formData.start_date_c) newErrors.start_date_c = "Start date is required";
    if (!formData.salary_c) {
      newErrors.salary_c = "Salary is required";
    } else if (isNaN(formData.salary_c) || parseFloat(formData.salary_c) <= 0) {
      newErrors.salary_c = "Please enter a valid salary amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setLoading(true);
    
    try {
      // Prepare employee data - removed created_at_c and updated_at_c as they don't exist in employee_c schema
      const employeeData = {
        ...formData,
        salary_c: parseFloat(formData.salary_c),
        department_c: formData.department_c ? parseInt(formData.department_c) : null
      };

      console.log('Submitting employee data:', employeeData);

      let savedEmployee;
      if (employee) {
        savedEmployee = await employeeService.update(employee.Id, employeeData);
        toast.success("Employee updated successfully!");
      } else {
        savedEmployee = await employeeService.create(employeeData);
        toast.success("Employee added successfully!");
      }
      
      onSave(savedEmployee);
      onClose();
    } catch (error) {
      console.error("Failed to save employee:", error);
      // Show the actual error message from the API
      const errorMessage = error?.message || "Failed to save employee. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on-leave", label: "On Leave" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                      <ApperIcon name={employee ? "Edit" : "UserPlus"} className="text-primary-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {employee ? "Edit Employee" : "Add New Employee"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {employee ? "Update employee information" : "Fill in the employee details below"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
name="first_name_c"
                      label="First Name"
                      value={formData.first_name_c}
                      onChange={handleInputChange}
                      error={errors.first_name_c}
                      required
                      icon="User"
                    />

                    <Input
                      name="last_name_c"
                      label="Last Name"
                      value={formData.last_name_c}
                      onChange={handleInputChange}
                      error={errors.last_name_c}
                      required
                      icon="User"
                    />

                    <Input
                      name="email_c"
                      label="Email Address"
                      type="email"
                      value={formData.email_c}
                      onChange={handleInputChange}
                      error={errors.email_c}
                      required
                      icon="Mail"
                    />

                    <Input
                      name="phone_c"
                      label="Phone Number"
                      value={formData.phone_c}
                      onChange={handleInputChange}
                      error={errors.phone_c}
                      required
                      icon="Phone"
                    />

                    <Input
                      name="position_c"
                      label="Position"
                      value={formData.position_c}
                      onChange={handleInputChange}
                      error={errors.position_c}
                      required
                      icon="Briefcase"
                    />

                    <Select
                      name="department_c"
                      label="Department"
                      value={formData.department_c}
                      onChange={handleInputChange}
                      options={departments}
                      error={errors.department_c}
                      required
                      placeholder="Select department..."
                    />

                    <Input
                      name="start_date_c"
                      label="Start Date"
                      type="date"
                      value={formData.start_date_c}
                      onChange={handleInputChange}
                      error={errors.start_date_c}
                      required
                      icon="Calendar"
                    />

                    <Select
                      name="status_c"
                      label="Status"
                      value={formData.status_c}
                      onChange={handleInputChange}
                      options={statusOptions}
                      required
                    />

                    <Input
                      name="salary_c"
                      label="Annual Salary"
                      type="number"
                      value={formData.salary_c}
                      onChange={handleInputChange}
                      error={errors.salary_c}
                      required
                      icon="DollarSign"
                      placeholder="Enter salary amount"
                    />

                    <Input
                      name="manager_c"
                      label="Manager"
                      value={formData.manager_c}
                      onChange={handleInputChange}
                      icon="UserCheck"
                      placeholder="Enter manager name"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    <ApperIcon name={employee ? "Save" : "Plus"} size={16} className="mr-2" />
                    {employee ? "Save Changes" : "Add Employee"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmployeeModal;