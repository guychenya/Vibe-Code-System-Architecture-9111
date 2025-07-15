import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiFileText, FiPlus, FiSearch, FiFilter, FiUser, FiClock, FiPaperclip, FiEdit, FiTrash2, FiEye, FiMoreVertical } = FiIcons;

function Requirements() {
  const { requirements, projects, addRequirement, updateRequirement } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [newRequirement, setNewRequirement] = useState({
    projectId: '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignee: 'John Doe',
    dueDate: ''
  });

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateRequirement = () => {
    if (!newRequirement.title.trim() || !newRequirement.projectId) {
      toast.error('Title and project are required');
      return;
    }

    addRequirement({
      ...newRequirement,
      createdAt: new Date(),
      dueDate: newRequirement.dueDate ? new Date(newRequirement.dueDate) : null,
      files: []
    });

    setNewRequirement({
      projectId: '',
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assignee: 'John Doe',
      dueDate: ''
    });
    setShowCreateModal(false);
    toast.success('Requirement created successfully!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const handleStatusChange = (reqId, newStatus) => {
    updateRequirement(reqId, { status: newStatus });
    toast.success('Status updated successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-dark-800 mb-2">Requirements</h1>
          <p className="text-gray-600">Capture, review, and manage project requirements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>New Requirement</span>
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
              placeholder="Search requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.map((requirement, index) => (
          <motion.div
            key={requirement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <SafeIcon icon={FiFileText} className="text-primary-600 text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-dark-800">{requirement.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(requirement.status)}`}>
                      {requirement.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(requirement.priority)}`}>
                      {requirement.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{requirement.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiFileText} className="text-xs" />
                      <span>{getProjectName(requirement.projectId)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} className="text-xs" />
                      <span>{requirement.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="text-xs" />
                      <span>Created {format(requirement.createdAt, 'MMM dd, yyyy')}</span>
                    </div>
                    {requirement.dueDate && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="text-xs" />
                        <span>Due {format(requirement.dueDate, 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {requirement.files && requirement.files.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiPaperclip} className="text-xs" />
                        <span>{requirement.files.length} files</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={requirement.status}
                  onChange={(e) => handleStatusChange(requirement.id, e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => {
                    setSelectedRequirement(requirement);
                    setShowDetailModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiEye} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <SafeIcon icon={FiMoreVertical} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Requirement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-dark-800 mb-4">Create New Requirement</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={newRequirement.projectId}
                    onChange={(e) => setNewRequirement({ ...newRequirement, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select
                    value={newRequirement.assignee}
                    onChange={(e) => setNewRequirement({ ...newRequirement, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Alice Brown">Alice Brown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newRequirement.title}
                  onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter requirement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  placeholder="Describe the requirement in detail"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newRequirement.priority}
                    onChange={(e) => setNewRequirement({ ...newRequirement, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newRequirement.status}
                    onChange={(e) => setNewRequirement({ ...newRequirement, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newRequirement.dueDate}
                    onChange={(e) => setNewRequirement({ ...newRequirement, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
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
                onClick={handleCreateRequirement}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Requirement
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-800">Requirement Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiMoreVertical} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-dark-800">{selectedRequirement.title}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRequirement.status)}`}>
                    {selectedRequirement.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedRequirement.priority)}`}>
                    {selectedRequirement.priority}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequirement.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <p className="text-gray-600">{getProjectName(selectedRequirement.projectId)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <p className="text-gray-600">{selectedRequirement.assignee}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                  <p className="text-gray-600">{format(selectedRequirement.createdAt, 'MMM dd, yyyy HH:mm')}</p>
                </div>
                {selectedRequirement.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <p className="text-gray-600">{format(selectedRequirement.dueDate, 'MMM dd, yyyy')}</p>
                  </div>
                )}
              </div>

              {selectedRequirement.files && selectedRequirement.files.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <div className="space-y-2">
                    {selectedRequirement.files.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <SafeIcon icon={FiPaperclip} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Requirements;