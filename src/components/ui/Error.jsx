import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  type = "default"
}) => {
  if (type === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <ApperIcon name="AlertCircle" className="text-red-500" size={20} />
        <div className="flex-1">
          <p className="text-sm text-red-700 font-medium">{message}</p>
        </div>
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <ApperIcon name="RefreshCw" size={14} className="mr-1" />
            Retry
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="text-red-600" size={32} />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <ApperIcon name="X" className="text-white" size={14} />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{message}</p>
      
      {showRetry && onRetry && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Refresh Page
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Error;