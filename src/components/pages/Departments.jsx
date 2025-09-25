import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [departmentData, employeeData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      
      setDepartments(departmentData);
      setEmployees(employeeData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load departments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentStats = (deptName) => {
    const deptEmployees = employees.filter(emp => emp.department === deptName);
    return {
      total: deptEmployees.length,
      active: deptEmployees.filter(emp => emp.status === "active").length,
      onLeave: deptEmployees.filter(emp => emp.status === "on-leave").length,
      inactive: deptEmployees.filter(emp => emp.status === "inactive").length
    };
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (departments.length === 0) {
    return (
      <Empty
        title="No departments found"
        description="Departments help organize your employees and manage team structures effectively."
        icon="Building"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage your organizational structure and teams</p>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department, index) => {
          const stats = getDepartmentStats(department.name);
          
          return (
            <motion.div
              key={department.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Building" className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{department.name}</h3>
                      <p className="text-sm text-gray-600">{department.description}</p>
                    </div>
                  </div>
                </div>

                {/* Department Head */}
                {department.headOfDepartment && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ApperIcon name="UserCheck" className="text-gray-400 mr-2" size={16} />
                      <span className="text-sm text-gray-600">Department Head:</span>
                      <span className="text-sm font-medium text-gray-900 ml-1">
                        {department.headOfDepartment}
                      </span>
                    </div>
                  </div>
                )}

                {/* Employee Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    <div className="text-sm text-green-700">Active</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-blue-700">Total</div>
                  </div>
                </div>

                {/* Status Badges */}
                {(stats.onLeave > 0 || stats.inactive > 0) && (
                  <div className="flex space-x-2 mb-4">
                    {stats.onLeave > 0 && (
                      <Badge variant="warning" size="sm">
                        {stats.onLeave} On Leave
                      </Badge>
                    )}
                    {stats.inactive > 0 && (
                      <Badge variant="secondary" size="sm">
                        {stats.inactive} Inactive
                      </Badge>
                    )}
                  </div>
                )}

                {/* Budget */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="DollarSign" size={16} className="mr-1 text-gray-400" />
                    Budget: {formatBudget(department.budget)}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Viewing ${department.name} details`)}
                    className="flex-1"
                  >
                    <ApperIcon name="Eye" size={14} className="mr-1" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.info(`Editing ${department.name}`)}
                  >
                    <ApperIcon name="Edit" size={14} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{departments.length}</div>
              <div className="text-sm text-blue-700 mt-1">Total Departments</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{employees.length}</div>
              <div className="text-sm text-green-700 mt-1">Total Employees</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {formatBudget(departments.reduce((sum, dept) => sum + dept.budget, 0))}
              </div>
              <div className="text-sm text-purple-700 mt-1">Total Budget</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Departments;