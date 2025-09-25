import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  delay = 0 
}) => {
  const colorStyles = {
    primary: "from-primary-500 to-primary-600 text-white",
    success: "from-emerald-500 to-emerald-600 text-white",
    warning: "from-amber-500 to-amber-600 text-white",
    danger: "from-red-500 to-red-600 text-white",
    info: "from-sky-500 to-sky-600 text-white"
  };

  const trendColors = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-6 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline space-x-3">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && trendValue && (
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
                  <ApperIcon 
                    name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                    size={12} 
                    className="mr-1" 
                  />
                  {trendValue}
                </div>
              )}
            </div>
          </div>
          
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center shadow-lg`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;