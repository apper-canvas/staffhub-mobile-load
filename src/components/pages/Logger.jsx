import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { loggerService } from "@/services/api/loggerService";
import { employeeService } from "@/services/api/employeeService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";

const Logger = () => {
  const [logs, setLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedLog, setSelectedLog] = useState(null);
  const [logLevelFilter, setLogLevelFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Tags: "",
    timestamp_c: "",
    log_level_c: "info",
    message_c: "",
    employee_c: ""
  });

  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await loggerService.getAll();
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const employeeData = await employeeService.getAll();
      setEmployees(employeeData);
    } catch (err) {
      console.error("Error loading employees:", err);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLogLevel = !logLevelFilter || log.log_level_c === logLevelFilter;
    const matchesEmployee = !employeeFilter || log.employee_c?.Id?.toString() === employeeFilter;
    return matchesLogLevel && matchesEmployee;
  });

  const handleAddLog = () => {
    setModalMode("create");
    setSelectedLog(null);
    setFormData({
      Name: "",
      Tags: "",
      timestamp_c: new Date().toISOString().slice(0, 16),
      log_level_c: "info",
      message_c: "",
      employee_c: ""
    });
    setIsModalOpen(true);
  };

  const handleEditLog = (log) => {
    setModalMode("edit");
    setSelectedLog(log);
    setFormData({
      Name: log.Name || "",
      Tags: log.Tags || "",
      timestamp_c: log.timestamp_c ? new Date(log.timestamp_c).toISOString().slice(0, 16) : "",
      log_level_c: log.log_level_c || "info",
      message_c: log.message_c || "",
      employee_c: log.employee_c?.Id?.toString() || ""
    });
    setIsModalOpen(true);
  };

  const handleViewLog = (log) => {
    setModalMode("view");
    setSelectedLog(log);
    setFormData({
      Name: log.Name || "",
      Tags: log.Tags || "",
      timestamp_c: log.timestamp_c ? new Date(log.timestamp_c).toISOString().slice(0, 16) : "",
      log_level_c: log.log_level_c || "info",
      message_c: log.message_c || "",
      employee_c: log.employee_c?.Id?.toString() || ""
    });
    setIsModalOpen(true);
  };

  const handleDeleteLog = async (log) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      try {
        await loggerService.delete(log.Id);
        toast.success("Log entry deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete log entry");
        console.error("Error deleting log:", error);
      }
    }
  };

  const handleSaveLog = async () => {
    try {
      if (modalMode === "create") {
        await loggerService.create(formData);
        toast.success("Log entry created successfully");
      } else if (modalMode === "edit") {
        await loggerService.update(selectedLog.Id, formData);
        toast.success("Log entry updated successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(`Failed to ${modalMode} log entry`);
      console.error(`Error ${modalMode} log:`, error);
    }
  };

  const clearFilters = () => {
    setLogLevelFilter("");
    setEmployeeFilter("");
  };

  const getLogLevelBadgeVariant = (level) => {
    switch (level) {
      case "error": return "destructive";
      case "warning": return "warning";
      case "info": return "secondary";
      case "debug": return "outline";
      default: return "secondary";
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
    } catch {
      return timestamp;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logger</h1>
          <p className="text-gray-600 mt-1">
            Monitor and test application activities and events
          </p>
        </div>
        
        <Button onClick={handleAddLog}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Log Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              value={logLevelFilter}
              onChange={(e) => setLogLevelFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Log Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="debug">Debug</option>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Employees</option>
              {employees.map((employee) => (
                <option key={employee.Id} value={employee.Id}>
                  {employee.first_name_c} {employee.last_name_c}
                </option>
              ))}
            </Select>
          </div>
          
          <Button variant="outline" onClick={clearFilters}>
            <ApperIcon name="X" size={16} className="mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Logger Table */}
      {filteredLogs.length === 0 ? (
        <Empty
          title="No log entries found"
          description="No log entries match your current filters"
          action={
            <Button onClick={handleAddLog}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Log Entry
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.timestamp_c)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getLogLevelBadgeVariant(log.log_level_c)}>
                        {log.log_level_c?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.message_c}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.employee_c?.Name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.Tags || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewLog(log)}
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLog(log)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLog(log)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalMode === "create" && "Add Log Entry"}
                  {modalMode === "edit" && "Edit Log Entry"}
                  {modalMode === "view" && "View Log Entry"}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    value={formData.Name}
                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                    placeholder="Log entry name"
                    disabled={modalMode === "view"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timestamp
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.timestamp_c}
                      onChange={(e) => setFormData({ ...formData, timestamp_c: e.target.value })}
                      disabled={modalMode === "view"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Log Level
                    </label>
                    <Select
                      value={formData.log_level_c}
                      onChange={(e) => setFormData({ ...formData, log_level_c: e.target.value })}
                      disabled={modalMode === "view"}
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="debug">Debug</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee
                  </label>
                  <Select
                    value={formData.employee_c}
                    onChange={(e) => setFormData({ ...formData, employee_c: e.target.value })}
                    disabled={modalMode === "view"}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.Id} value={employee.Id}>
                        {employee.first_name_c} {employee.last_name_c}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <Input
                    value={formData.Tags}
                    onChange={(e) => setFormData({ ...formData, Tags: e.target.value })}
                    placeholder="Comma-separated tags"
                    disabled={modalMode === "view"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={formData.message_c}
                    onChange={(e) => setFormData({ ...formData, message_c: e.target.value })}
                    placeholder="Log message"
                    rows="4"
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {modalMode !== "view" && (
                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveLog}>
                    {modalMode === "create" ? "Create" : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Logger;