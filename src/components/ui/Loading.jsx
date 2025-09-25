import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="p-6 space-y-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 animate-pulse"></div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Recent Activity & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-6 animate-pulse"></div>
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
            <div className="flex space-x-3">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-6 bg-gray-50 border-b border-gray-100">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
          
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-6 gap-4 p-6 border-b border-gray-100"
            >
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-primary-500"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-300 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default Loading;