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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    startDate: "",
    status: "active",
    salary: "",
    manager: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadDepartments();
      if (employee) {
        setFormData({
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          email: employee.email || "",
          phone: employee.phone || "",
          position: employee.position || "",
          department: employee.department || "",
          startDate: employee.startDate ? employee.startDate.split('T')[0] : "",
          status: employee.status || "active",
          salary: employee.salary ? employee.salary.toString() : "",
          manager: employee.manager || ""
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          position: "",
          department: "",
          startDate: "",
          status: "active",
          salary: "",
          manager: ""
        });
      }
      setErrors({});
    }
  }, [isOpen, employee]);

  const loadDepartments = async () => {
    try {
      const departmentData = await departmentService.getAll();
      setDepartments(departmentData.map(dept => ({
        value: dept.name,
        label: dept.name
      })));
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    } else if (isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
      newErrors.salary = "Please enter a valid salary amount";
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
      const employeeData = {
        ...formData,
        salary: parseFloat(formData.salary),
        createdAt: employee ? employee.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

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
      toast.error("Failed to save employee. Please try again.");
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
                      name="firstName"
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      required
                      icon="User"
                    />

                    <Input
                      name="lastName"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      required
                      icon="User"
                    />

                    <Input
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      required
                      icon="Mail"
                    />

                    <Input
                      name="phone"
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                      required
                      icon="Phone"
                    />

                    <Input
                      name="position"
                      label="Position"
                      value={formData.position}
                      onChange={handleInputChange}
                      error={errors.position}
                      required
                      icon="Briefcase"
                    />

                    <Select
                      name="department"
                      label="Department"
                      value={formData.department}
                      onChange={handleInputChange}
                      options={departments}
                      error={errors.department}
                      required
                      placeholder="Select department..."
                    />

                    <Input
                      name="startDate"
                      label="Start Date"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      error={errors.startDate}
                      required
                      icon="Calendar"
                    />

                    <Select
                      name="status"
                      label="Status"
                      value={formData.status}
                      onChange={handleInputChange}
                      options={statusOptions}
                      required
                    />

                    <Input
                      name="salary"
                      label="Annual Salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleInputChange}
                      error={errors.salary}
                      required
                      icon="DollarSign"
                      placeholder="Enter salary amount"
                    />

                    <Input
                      name="manager"
                      label="Manager"
                      value={formData.manager}
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