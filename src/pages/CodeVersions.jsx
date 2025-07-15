import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiGitBranch, FiPlus, FiSearch, FiFilter, FiMoreVertical, FiTag, FiUser, FiClock, FiFile, FiDownload, FiEye, FiArrowRight } = FiIcons;

function CodeVersions() {
  const { codeVersions, projects, addCodeVersion } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVersion, setNewVersion] = useState({
    projectId: '',
    version: '',
    description: '',
    status: 'active'
  });

  const filteredVersions = codeVersions.filter(version => {
    const matchesSearch = version.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = filterProject === 'all' || version.projectId === filterProject;
    return matchesSearch && matchesProject;
  });

  const handleCreateVersion = () => {
    if (!newVersion.version.trim() || !newVersion.projectId) {
      toast.error('Version number and project are required');
      return;
    }

    addCodeVersion({
      ...newVersion,
      author: 'John Doe',
      createdAt: new Date(),
      changes: Math.floor(Math.random() * 50) + 1,
      files: ['main.js', 'components.jsx', 'utils.js']
    });

    setNewVersion({
      projectId: '',
      version: '',
      description: '',
      status: 'active'
    });
    setShowCreateModal(false);
    toast.success('Version created successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      case 'deprecated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-dark-800 mb-2">Code Versions</h1>
          <p className="text-gray-600">Manage your code versions with full history and rollback capabilities</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>New Version</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <SafeIcon
              icon={FiSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search versions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-400" />
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Versions List */}
      <div className="space-y-4">
        {filteredVersions.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <SafeIcon icon={FiGitBranch} className="text-primary-600 text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-dark-800">{version.version}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(version.status)}`}>
                      {version.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{version.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiTag} className="text-xs" />
                      <span>{getProjectName(version.projectId)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} className="text-xs" />
                      <span>{version.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="text-xs" />
                      <span>{format(version.createdAt, 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiFile} className="text-xs" />
                      <span>{version.changes} changes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <SafeIcon icon={FiEye} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <SafeIcon icon={FiDownload} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <SafeIcon icon={FiMoreVertical} />
                </button>
              </div>
            </div>

            {/* Files Changed */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Files changed:</span>
                  <div className="flex items-center space-x-2">
                    {version.files.slice(0, 3).map((file, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                        {file}
                      </span>
                    ))}
                    {version.files.length > 3 && (
                      <span className="text-xs text-gray-500">+{version.files.length - 3} more</span>
                    )}
                  </div>
                </div>
                <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm">
                  <span>View details</span>
                  <SafeIcon icon={FiArrowRight} className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Version Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-semibold text-dark-800 mb-4">Create New Version</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={newVersion.projectId}
                  onChange={(e) => setNewVersion({ ...newVersion, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                <input
                  type="text"
                  value={newVersion.version}
                  onChange={(e) => setNewVersion({ ...newVersion, version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., v1.2.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newVersion.description}
                  onChange={(e) => setNewVersion({ ...newVersion, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Describe the changes in this version"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newVersion.status}
                  onChange={(e) => setNewVersion({ ...newVersion, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="stable">Stable</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVersion}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Version
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default CodeVersions;