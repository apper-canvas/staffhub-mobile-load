import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const EmployeeCard = ({ employee, onView, onEdit, onDelete }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 hover:shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="text-primary-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{employee.firstName} {employee.lastName}</h3>
              <p className="text-sm text-gray-600">{employee.position}</p>
            </div>
          </div>
          
          <Badge variant={statusColors[employee.status]} size="sm">
            {employee.status === "on-leave" ? "On Leave" : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Building" size={16} className="mr-2 text-gray-400" />
            {employee.department}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" size={16} className="mr-2 text-gray-400" />
            {employee.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" size={16} className="mr-2 text-gray-400" />
            {employee.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="DollarSign" size={16} className="mr-2 text-gray-400" />
            {formatSalary(employee.salary)}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(employee)}
            className="flex-1"
          >
            <ApperIcon name="Eye" size={14} className="mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(employee)}
          >
            <ApperIcon name="Edit" size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(employee)}
            className="text-red-600 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;