import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({
  className = "",
  variant = "primary",
  size = "sm",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors duration-200";
  
  const variants = {
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;