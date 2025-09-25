import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  action,
  actionText = "Add New",
  icon = "Inbox",
  type = "default"
}) => {
  if (type === "employees") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="Users" className="text-blue-600" size={40} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="Plus" className="text-white" size={20} />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No employees found</h3>
        <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
          Start building your team by adding employee profiles. Track their information, roles, and performance all in one place.
        </p>
        
        {action && (
          <Button
            onClick={action}
            size="lg"
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ApperIcon name="UserPlus" size={20} className="mr-2" />
            Add First Employee
          </Button>
        )}
      </motion.div>
    );
  }

  if (type === "search") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 px-6 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="Search" className="text-gray-500" size={32} />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
        
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          Clear Filters
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="text-gray-500" size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{description}</p>
      
      {action && (
        <Button
          onClick={action}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;