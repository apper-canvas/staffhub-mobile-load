import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === "active").length,
    totalDepartments: departments.length,
    onLeaveEmployees: employees.filter(emp => emp.status === "on-leave").length
  };

  const recentEmployees = employees
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const departmentStats = departments.map(dept => ({
    name: dept.name,
    count: employees.filter(emp => emp.department === dept.name).length,
    budget: dept.budget
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your team.</p>
        </div>
        <Button
          onClick={() => navigate("/employees")}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="UserPlus" size={18} className="mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon="Users"
          color="primary"
          delay={0}
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon="UserCheck"
          color="success"
          delay={0.1}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon="Building"
          color="info"
          delay={0.2}
        />
        <StatCard
          title="On Leave"
          value={stats.onLeaveEmployees}
          icon="Calendar"
          color="warning"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Additions</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/employees")}
              >
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentEmployees.length > 0 ? recentEmployees.map((employee, index) => (
                <motion.div
                  key={employee.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="text-primary-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{employee.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {employee.createdAt ? format(new Date(employee.createdAt), "MMM dd") : "Recent"}
                    </p>
                    <p className="text-xs text-gray-400">{employee.department}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <ApperIcon name="Users" className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-500">No employees added yet</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Department Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/departments")}
              >
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {departmentStats.length > 0 ? departmentStats.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                      <ApperIcon name="Building" className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                      <p className="text-sm text-gray-500">{dept.count} employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(dept.budget)}
                    </div>
                    <p className="text-xs text-gray-500">Budget</p>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <ApperIcon name="Building" className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-500">No departments configured</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/employees")}
              className="flex items-center justify-center p-4 h-auto"
            >
              <ApperIcon name="UserPlus" size={20} className="mr-2" />
              <span>Add Employee</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/departments")}
              className="flex items-center justify-center p-4 h-auto"
            >
              <ApperIcon name="Building" size={20} className="mr-2" />
              <span>Manage Departments</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/reports")}
              className="flex items-center justify-center p-4 h-auto"
            >
              <ApperIcon name="BarChart3" size={20} className="mr-2" />
              <span>View Reports</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/employees")}
              className="flex items-center justify-center p-4 h-auto"
            >
              <ApperIcon name="Search" size={20} className="mr-2" />
              <span>Search Employees</span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;