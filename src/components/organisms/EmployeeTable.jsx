import React, { useState } from "react";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const EmployeeTable = ({ employees, onView, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");

  const statusColors = {
    active: "success",
    inactive: "secondary",
    "on-leave": "warning"
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(salary);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ApperIcon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === "asc" ? "text-primary-500" : "text-gray-300"}`}
          />
          <ApperIcon 
            name="ChevronDown" 
            size={12} 
            className={`${sortField === field && sortDirection === "desc" ? "text-primary-500" : "text-gray-300"}`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="firstName">Name</SortableHeader>
              <SortableHeader field="position">Position</SortableHeader>
              <SortableHeader field="department">Department</SortableHeader>
              <SortableHeader field="email">Contact</SortableHeader>
              <SortableHeader field="startDate">Start Date</SortableHeader>
              <SortableHeader field="salary">Salary</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEmployees.map((employee, index) => (
              <motion.tr
                key={employee.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-3">
                      <ApperIcon name="User" className="text-primary-600" size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ApperIcon name="Building" className="text-gray-400 mr-2" size={14} />
                    <span className="text-sm text-gray-900">{employee.department}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.email}</div>
                  <div className="text-sm text-gray-500">{employee.phone}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.startDate ? format(new Date(employee.startDate), "MMM dd, yyyy") : "N/A"}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatSalary(employee.salary)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={statusColors[employee.status]} size="sm">
                    {employee.status === "on-leave" ? "On Leave" : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </Badge>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(employee)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ApperIcon name="Eye" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(employee)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(employee)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;