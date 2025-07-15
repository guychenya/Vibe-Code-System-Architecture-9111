import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import LlmProviderSidebar from '../sidebar/LlmProviderSidebar';

const {
  FiHome,
  FiFolderPlus,
  FiGitBranch,
  FiMessageCircle,
  FiFileText,
  FiSettings,
  FiTrendingUp
} = FiIcons;

const navItems = [
  { path: '/', label: 'Dashboard', icon: FiHome },
  { path: '/projects', label: 'Projects', icon: FiFolderPlus },
  { path: '/versions', label: 'Code Versions', icon: FiGitBranch },
  { path: '/chat', label: 'AI Chat', icon: FiMessageCircle },
  { path: '/requirements', label: 'Requirements', icon: FiFileText },
  { path: '/settings', label: 'Settings', icon: FiSettings },
];

function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-200 z-40 overflow-y-auto"
    >
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* LLM Providers Section */}
        <div className="mt-8">
          <LlmProviderSidebar />
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <SafeIcon icon={FiTrendingUp} className="text-primary-600" />
            <span className="font-medium text-dark-800">Quick Stats</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Projects</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Code Versions</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Requirements</span>
              <span className="font-medium">8</span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;