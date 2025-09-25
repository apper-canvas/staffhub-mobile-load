import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = "",
  showFilter = false,
  onFilterClick
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <form onSubmit={handleSearch} className={`flex items-center space-x-3 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          icon="Search"
          className="shadow-sm"
        />
      </div>
      
      {showFilter && (
        <Button
          type="button"
          variant="outline"
          onClick={onFilterClick}
          className="px-4 py-2.5 border-gray-300 hover:border-gray-400"
        >
          <ApperIcon name="Filter" size={18} className="mr-2" />
          Filters
        </Button>
      )}
    </form>
  );
};

export default SearchBar;