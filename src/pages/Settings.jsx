import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const { FiSettings, FiUser, FiBell, FiShield, FiDatabase, FiGlobe, FiSave, FiUpload } = FiIcons;

function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    bio: 'Senior Software Developer with 5+ years of experience in full-stack development.',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    projectUpdates: true,
    versionReleases: true,
    requirementChanges: true,
    chatMessages: false
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginNotifications: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'integration', label: 'Integration', icon: FiDatabase },
    { id: 'general', label: 'General', icon: FiGlobe }
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
            <SafeIcon icon={FiUpload} className="text-sm" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-800">Profile Picture</h3>
          <p className="text-gray-600 text-sm">Update your profile picture</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={profileData.role}
            onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Developer">Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select
          value={profileData.timezone}
          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="Europe/London">Greenwich Mean Time (GMT)</option>
          <option value="Europe/Paris">Central European Time (CET)</option>
          <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-800 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive push notifications on your device</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Desktop Notifications</h4>
              <p className="text-sm text-gray-600">Show desktop notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.desktop}
                onChange={(e) => setNotifications({ ...notifications, desktop: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-800 mb-4">Activity Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Project Updates</h4>
              <p className="text-sm text-gray-600">Get notified about project changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.projectUpdates}
                onChange={(e) => setNotifications({ ...notifications, projectUpdates: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Version Releases</h4>
              <p className="text-sm text-gray-600">Get notified about new version releases</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.versionReleases}
                onChange={(e) => setNotifications({ ...notifications, versionReleases: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Requirement Changes</h4>
              <p className="text-sm text-gray-600">Get notified about requirement updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.requirementChanges}
                onChange={(e) => setNotifications({ ...notifications, requirementChanges: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Chat Messages</h4>
              <p className="text-sm text-gray-600">Get notified about new chat messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.chatMessages}
                onChange={(e) => setNotifications({ ...notifications, chatMessages: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-800 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Login Notifications</h4>
              <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.loginNotifications}
                onChange={(e) => setSecurity({ ...security, loginNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <select
            value={security.sessionTimeout}
            onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="480">8 hours</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
          <select
            value={security.passwordExpiry}
            onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Change Password
        </button>
      </div>
    </div>
  );

  const renderIntegrationTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-800 mb-4">API Integration</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-dark-800">GitHub Integration</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Sync your repositories and track commits</p>
            <button className="text-primary-600 hover:text-primary-700 text-sm">Configure</button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-dark-800">Slack Integration</h4>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Not Connected</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Get notifications in your Slack workspace</p>
            <button className="text-primary-600 hover:text-primary-700 text-sm">Connect</button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-dark-800">Jira Integration</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Sync requirements with Jira tickets</p>
            <button className="text-primary-600 hover:text-primary-700 text-sm">Configure</button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-800 mb-4">API Keys</h3>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-dark-800">Personal Access Token</h4>
              <button className="text-primary-600 hover:text-primary-700 text-sm">Regenerate</button>
            </div>
            <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              vcs_****************************
            </code>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-800 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-dark-800 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'integration':
        return renderIntegrationTab();
      case 'general':
        return renderGeneralTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-dark-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <SafeIcon icon={tab.icon} className="text-lg" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiSave} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;