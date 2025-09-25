import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Employees from "@/components/pages/Employees";

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  useEffect(() => {
    loadData();
  }, []);

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
      setError("Failed to load reports data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate metrics
  const totalEmployees = employees.length;
const activeEmployees = employees.filter(emp => emp.status_c === "active").length;
  const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary_c || 0), 0);
  const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

  // Department analytics
  const departmentAnalytics = departments.map(dept => {
const deptEmployees = employees.filter(emp => emp.department_c?.Name === (dept.name_c || dept.Name));
    const deptSalary = deptEmployees.reduce((sum, emp) => sum + (emp.salary_c || 0), 0);
    
    return {
      name: dept.name,
      employeeCount: deptEmployees.length,
      totalSalary: deptSalary,
      avgSalary: deptEmployees.length > 0 ? deptSalary / deptEmployees.length : 0,
      budget: dept.budget,
      utilization: dept.budget > 0 ? (deptSalary / dept.budget) * 100 : 0
    };
  });

// Status distribution
  const statusDistribution = {
    active: employees.filter(emp => emp.status_c === "active").length,
    inactive: employees.filter(emp => emp.status_c === "inactive").length,
    onLeave: employees.filter(emp => emp.status_c === "on-leave").length
  };
  const periodOptions = [
    { value: "current", label: "Current Period" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annual", label: "Annual" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Insights into your workforce and organizational metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={periodOptions}
            className="w-40"
          />
          <Button variant="outline">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Users" className="text-white" size={24} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="UserCheck" className="text-white" size={24} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalSalary)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="DollarSign" className="text-white" size={24} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(avgSalary)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="text-white" size={24} />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Department Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Employees</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Total Salary</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Avg. Salary</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Budget</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {departmentAnalytics.map((dept, index) => (
                  <motion.tr
                    key={dept.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                          <ApperIcon name="Building" className="text-blue-600" size={16} />
                        </div>
<span className="font-medium text-gray-900">{dept.name_c || dept.Name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-900">{dept.employeeCount}</td>
                    <td className="py-4 px-4 text-right text-gray-900">{formatCurrency(dept.totalSalary)}</td>
                    <td className="py-4 px-4 text-right text-gray-900">{formatCurrency(dept.avgSalary)}</td>
                    <td className="py-4 px-4 text-right text-gray-900">{formatCurrency(dept.budget)}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end">
                        <span className={`text-sm font-medium ${
                          dept.utilization > 100 ? "text-red-600" : 
                          dept.utilization > 80 ? "text-yellow-600" : "text-green-600"
                        }`}>
                          {dept.utilization.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Employee Status Distribution</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="UserCheck" className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{statusDistribution.active}</div>
              <div className="text-sm text-green-700">Active Employees</div>
              <div className="text-xs text-green-600 mt-1">
                {totalEmployees > 0 ? Math.round((statusDistribution.active / totalEmployees) * 100) : 0}% of total
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Calendar" className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{statusDistribution.onLeave}</div>
              <div className="text-sm text-yellow-700">On Leave</div>
              <div className="text-xs text-yellow-600 mt-1">
                {totalEmployees > 0 ? Math.round((statusDistribution.onLeave / totalEmployees) * 100) : 0}% of total
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="UserX" className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-600 mb-2">{statusDistribution.inactive}</div>
              <div className="text-sm text-gray-700">Inactive</div>
              <div className="text-xs text-gray-600 mt-1">
                {totalEmployees > 0 ? Math.round((statusDistribution.inactive / totalEmployees) * 100) : 0}% of total
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;