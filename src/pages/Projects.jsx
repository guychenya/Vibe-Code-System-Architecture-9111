import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import useSupabase from '../hooks/useSupabase';

const { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiMoreVertical, 
  FiUsers, 
  FiGitBranch, 
  FiFileText, 
  FiClock, 
  FiLoader,
  FiEdit,
  FiTrash2,
  FiEye,
  FiX
} = FiIcons;

function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active',
    priority: 'medium',
    progress: 0
  });

  // Use Supabase hook to fetch and manage projects
  const { 
    data: projects, 
    loading, 
    error, 
    create: createProject,
    update: updateProject,
    remove: deleteProject 
  } = useSupabase('projects_vcs2024', {
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    realtime: true
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      const project = {
        ...newProject,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };

      await createProject(project);
      
      setNewProject({
        name: '',
        description: '',
        status: 'active',
        priority: 'medium',
        progress: 0
      });
      setShowCreateModal(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error(`Failed to create project: ${error.message}`);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete.id);
      toast.success('Project deleted successfully!');
      setShowDeleteModal(false);
      setProjectToDelete(null);
      setShowDropdown(null);
    } catch (error) {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  const handleDropdownAction = (action, project) => {
    setShowDropdown(null);
    
    switch (action) {
      case 'edit':
        toast.info('Edit functionality coming soon!');
        break;
      case 'delete':
        setProjectToDelete(project);
        setShowDeleteModal(true);
        break;
      case 'view':
        toast.info('View details coming soon!');
        break;
      default:
        break;
    }
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[calc(100vh-6rem)]">
        <div className="text-center">
          <SafeIcon icon={FiLoader} className="text-4xl text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center h-[calc(100vh-6rem)]">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">Error loading projects</div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-dark-800 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your development projects and track progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>New Project</span>
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
              placeholder="Search projects..."
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
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No projects found matching your criteria</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} />
              <span>Create your first project</span>
            </button>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-800 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(showDropdown === project.id ? null : project.id);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <SafeIcon icon={FiMoreVertical} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDropdown === project.id && (
                    <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-10">
                      <button
                        onClick={() => handleDropdownAction('view', project)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <SafeIcon icon={FiEye} className="text-sm" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => handleDropdownAction('edit', project)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <SafeIcon icon={FiEdit} className="text-sm" />
                        <span>Edit Project</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => handleDropdownAction('delete', project)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                        <span>Delete Project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUsers} className="text-xs" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiGitBranch} className="text-xs" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiFileText} className="text-xs" />
                      <span>0</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <SafeIcon icon={FiClock} />
                    <span>
                      {format(new Date(project.last_updated || project.created_at), 'MMM dd')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-semibold text-dark-800 mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
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
                onClick={handleCreateProject}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <SafeIcon icon={FiTrash2} className="text-red-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark-800">Delete Project</h2>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete <strong>"{projectToDelete.name}"</strong>? 
                This will permanently remove the project and all associated data.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Project
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Projects;