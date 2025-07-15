import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';

const { FiActivity, FiGitBranch, FiFileText, FiUsers, FiTrendingUp, FiClock, FiArrowRight } = FiIcons;

function Dashboard() {
  const { projects, codeVersions, requirements } = useProjectStore();

  const stats = [
    {
      title: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length,
      icon: FiActivity,
      color: 'bg-primary-500',
      change: '+12%'
    },
    {
      title: 'Code Versions',
      value: codeVersions.length,
      icon: FiGitBranch,
      color: 'bg-secondary-500',
      change: '+8%'
    },
    {
      title: 'Requirements',
      value: requirements.length,
      icon: FiFileText,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      title: 'Team Members',
      value: 12,
      icon: FiUsers,
      color: 'bg-orange-500',
      change: '+2%'
    }
  ];

  const recentActivity = [
    {
      type: 'version',
      message: 'New version v2.1.0 created for E-commerce Platform',
      time: '2 hours ago'
    },
    {
      type: 'requirement',
      message: 'Payment Gateway Integration requirement updated',
      time: '4 hours ago'
    },
    {
      type: 'project',
      message: 'Mobile Banking App moved to review stage',
      time: '6 hours ago'
    },
    {
      type: 'chat',
      message: 'New message in Analytics Dashboard discussion',
      time: '1 day ago'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-dark-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 text-sm">
                <SafeIcon icon={FiTrendingUp} className="text-xs" />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-dark-800 mb-1">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark-800">Recent Projects</h2>
            <Link to="/projects" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1">
              <span>View all</span>
              <SafeIcon icon={FiArrowRight} className="text-sm" />
            </Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-dark-800">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(project.lastUpdated, 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-dark-800">{project.progress}%</div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark-800">Recent Activity</h2>
            <SafeIcon icon={FiClock} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'version' ? 'bg-primary-100' :
                  activity.type === 'requirement' ? 'bg-green-100' :
                  activity.type === 'project' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  <SafeIcon
                    icon={
                      activity.type === 'version' ? FiGitBranch :
                      activity.type === 'requirement' ? FiFileText :
                      activity.type === 'project' ? FiActivity :
                      FiUsers
                    }
                    className={`text-sm ${
                      activity.type === 'version' ? 'text-primary-600' :
                      activity.type === 'requirement' ? 'text-green-600' :
                      activity.type === 'project' ? 'text-yellow-600' :
                      'text-purple-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;