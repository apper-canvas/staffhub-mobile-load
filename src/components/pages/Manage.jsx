import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';

const Manage = () => {
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    cache: 'warning'
  });

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalEmployees: 0,
    totalDepartments: 0,
    storageUsed: '0 GB',
    uptime: '0 days'
  });

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      // Simulate loading system data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSystemStats({
        totalUsers: 42,
        totalEmployees: 156,
        totalDepartments: 8,
        storageUsed: '2.4 GB',
        uptime: '15 days'
      });
    } catch (error) {
      toast.error('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemAction = async (action) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (action) {
        case 'backup':
          toast.success('Database backup completed successfully');
          break;
        case 'clearCache':
          setSystemStatus(prev => ({ ...prev, cache: 'healthy' }));
          toast.success('Cache cleared successfully');
          break;
        case 'restart':
          toast.info('System restart scheduled for maintenance window');
          break;
        case 'optimize':
          toast.success('Database optimization completed');
          break;
        default:
          toast.info(`${action} action completed`);
      }
    } catch (error) {
      toast.error(`Failed to execute ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage your application infrastructure</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalDepartments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building" className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.uptime}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => loadSystemData()}
              disabled={loading}
            >
              <ApperIcon name="RefreshCw" size={14} className="mr-1" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon 
                    name={getStatusIcon(status)} 
                    size={16} 
                    className={`mr-3 ${
                      status === 'healthy' ? 'text-green-600' : 
                      status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}
                  />
                  <span className="text-gray-900 font-medium capitalize">{service}</span>
                </div>
                <Badge className={getStatusColor(status)}>
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleSystemAction('backup')}
              disabled={loading}
            >
              <ApperIcon name="Download" size={16} className="mr-3" />
              Create Database Backup
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleSystemAction('clearCache')}
              disabled={loading}
            >
              <ApperIcon name="Trash2" size={16} className="mr-3" />
              Clear System Cache
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleSystemAction('optimize')}
              disabled={loading}
            >
              <ApperIcon name="Zap" size={16} className="mr-3" />
              Optimize Database
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleSystemAction('restart')}
              disabled={loading}
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-3" />
              Schedule System Restart
            </Button>
          </div>
        </Card>

        {/* User Management */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Management</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Active Sessions</p>
                <p className="text-sm text-gray-600">12 users currently online</p>
              </div>
              <Button size="sm" variant="outline">
                <ApperIcon name="Eye" size={14} className="mr-1" />
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">User Roles</p>
                <p className="text-sm text-gray-600">Manage user permissions</p>
              </div>
              <Button size="sm" variant="outline">
                <ApperIcon name="Settings" size={14} className="mr-1" />
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Access Logs</p>
                <p className="text-sm text-gray-600">View system access history</p>
              </div>
              <Button size="sm" variant="outline">
                <ApperIcon name="FileText" size={14} className="mr-1" />
                View Logs
              </Button>
            </div>
          </div>
        </Card>

        {/* Application Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Enable for system updates</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Disabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto Backup</p>
                <p className="text-sm text-gray-600">Daily at 2:00 AM</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Storage Used</p>
                <p className="text-sm text-gray-600">{systemStats.storageUsed} of 10 GB</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">24%</Badge>
            </div>

            <Button className="w-full mt-4" variant="outline">
              <ApperIcon name="Settings" size={16} className="mr-2" />
              Advanced Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Manage;