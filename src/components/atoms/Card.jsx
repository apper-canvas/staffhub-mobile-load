import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = ({
  className = "",
  hover = true,
  gradient = false,
  children,
  ...props
}) => {
  const baseStyles = "bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200";
  const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1" : "";
  const gradientStyles = gradient ? "bg-gradient-to-br from-white to-gray-50" : "";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        baseStyles,
        hoverStyles,
        gradientStyles,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;