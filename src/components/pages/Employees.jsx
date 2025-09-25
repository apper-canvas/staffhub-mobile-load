import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table or cards

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeeData, departmentData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      
      setEmployees(employeeData);
      setDepartments(departmentData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;
// Search filter
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        `${emp.first_name_c || ''} ${emp.last_name_c || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.position_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department_c?.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department_c?.Name === departmentFilter);
    }

// Status filter
    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status_c === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleViewEmployee = (employee) => {
toast.info(`Viewing details for ${employee.first_name_c} ${employee.last_name_c}`);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.first_name_c} ${employee.last_name_c}?`)) {
      try {
await employeeService.delete(employee.Id);
        setEmployees(prev => prev.filter(emp => emp.Id !== employee.Id));
        toast.success("Employee deleted successfully!");
      } catch (error) {
        console.error("Failed to delete employee:", error);
        toast.error("Failed to delete employee. Please try again.");
      }
    }
  };

  const handleSaveEmployee = (savedEmployee) => {
    if (selectedEmployee) {
      // Update existing employee
      setEmployees(prev =>
        prev.map(emp => emp.Id === savedEmployee.Id ? savedEmployee : emp)
      );
    } else {
      // Add new employee
      setEmployees(prev => [...prev, savedEmployee]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

const departmentOptions = departments.map(dept => ({
    value: dept.name_c || dept.Name,
    label: dept.name_c || dept.Name
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on-leave", label: "On Leave" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <Button
              variant={viewMode === "table" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="px-3 py-1"
            >
              <ApperIcon name="List" size={16} />
            </Button>
            <Button
              variant={viewMode === "cards" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="px-3 py-1"
            >
              <ApperIcon name="LayoutGrid" size={16} />
            </Button>
          </div>
          
          <Button onClick={handleAddEmployee}>
            <ApperIcon name="UserPlus" size={18} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search employees by name, email, position, or department..."
              className="w-full"
            />
          </div>
          
          <Select
            label="Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={departmentOptions}
            placeholder="All departments"
          />
          
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            placeholder="All statuses"
          />
        </div>
        
        {(searchTerm || departmentFilter || statusFilter) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <ApperIcon name="X" size={14} className="mr-1" />
              Clear Filters
            </Button>
          </div>
        )}
      </motion.div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        searchTerm || departmentFilter || statusFilter ? (
          <Empty 
            type="search"
            title="No employees found"
            description="Try adjusting your search terms or filters to find what you're looking for."
            action={clearFilters}
            actionText="Clear Filters"
          />
        ) : (
          <Empty
            type="employees"
            title="No employees found"
            description="Start building your team by adding employee profiles. Track their information, roles, and performance all in one place."
            action={handleAddEmployee}
            actionText="Add First Employee"
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {viewMode === "table" ? (
            <EmployeeTable
              employees={filteredEmployees}
              onView={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <div key={employee.Id}>
                  {/* Employee card implementation would go here */}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

export default Employees;