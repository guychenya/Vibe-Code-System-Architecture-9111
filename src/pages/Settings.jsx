import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const { 
  FiSettings, 
  FiUser, 
  FiBell, 
  FiShield, 
  FiDatabase, 
  FiGlobe, 
  FiSave, 
  FiUpload,
  FiGithub,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCheck,
  FiX
} = FiIcons;

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email || 'User',
    email: user?.email || 'user@example.com',
    role: 'Developer',
    bio: 'Senior Software Developer with 5+ years of experience in full-stack development.',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    phone: '+1 (555) 123-4567',
    website: 'https://example.com'
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

  const [integrations, setIntegrations] = useState({
    github: {
      connected: true,
      username: 'johndoe',
      lastSync: '2024-01-15T10:30:00Z'
    },
    slack: {
      connected: false,
      workspace: null,
      lastSync: null
    },
    discord: {
      connected: false,
      server: null,
      lastSync: null
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'integrations', label: 'Integrations', icon: FiDatabase },
    { id: 'general', label: 'General', icon: FiGlobe }
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleSecurity = (key) => {
    setSecurity(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleConnectIntegration = (service) => {
    toast.loading(`Connecting to ${service}...`);
    
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [service]: {
          ...prev[service],
          connected: true,
          lastSync: new Date().toISOString()
        }
      }));
      toast.dismiss();
      toast.success(`Successfully connected to ${service}!`);
    }, 2000);
  };

  const handleDisconnectIntegration = (service) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        connected: false,
        lastSync: null
      }
    }));
    toast.success(`Disconnected from ${service}`);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=0ea5e9&color=fff`}
            alt={profileData.name}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={profileData.website}
            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
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
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
            { key: 'desktop', label: 'Desktop Notifications', desc: 'Show desktop notifications in browser' },
            { key: 'projectUpdates', label: 'Project Updates', desc: 'Get notified about project changes' },
            { key: 'versionReleases', label: 'Version Releases', desc: 'Get notified about new version releases' },
            { key: 'requirementChanges', label: 'Requirement Changes', desc: 'Get notified about requirement updates' },
            { key: 'chatMessages', label: 'Chat Messages', desc: 'Get notified about new chat messages' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-dark-800">{label}</h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
              <button
                onClick={() => handleToggleNotification(key)}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                  notifications[key] ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
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
            <button
              onClick={() => handleToggleSecurity('twoFactor')}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                security.twoFactor ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
                  security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark-800">Login Notifications</h4>
              <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
            </div>
            <button
              onClick={() => handleToggleSecurity('loginNotifications')}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                security.loginNotifications ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ${
                  security.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
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
              <option value="365">1 year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Change Password
        </button>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-800 mb-4">Connected Services</h3>
        <div className="space-y-4">
          {[
            { 
              key: 'github', 
              name: 'GitHub', 
              icon: FiGithub, 
              desc: 'Sync repositories and track commits',
              color: 'bg-gray-900'
            },
            { 
              key: 'slack', 
              name: 'Slack', 
              icon: FiMail, 
              desc: 'Get notifications in your Slack workspace',
              color: 'bg-purple-600'
            },
            { 
              key: 'discord', 
              name: 'Discord', 
              icon: FiMail, 
              desc: 'Connect with your Discord server',
              color: 'bg-indigo-600'
            }
          ].map(({ key, name, icon, desc, color }) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${color}`}>
                    <SafeIcon icon={icon} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-dark-800">{name}</h4>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {integrations[key].connected ? (
                    <>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                        <SafeIcon icon={FiCheck} className="text-xs" />
                        <span>Connected</span>
                      </span>
                      <button
                        onClick={() => handleDisconnectIntegration(key)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnectIntegration(key)}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
              {integrations[key].connected && integrations[key].lastSync && (
                <p className="text-xs text-gray-500 mt-2">
                  Last synced: {new Date(integrations[key].lastSync).toLocaleString()}
                </p>
              )}
            </div>
          ))}
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
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'security': return renderSecurityTab();
      case 'integrations': return renderIntegrationsTab();
      case 'general': return renderGeneralTab();
      default: return renderProfileTab();
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
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
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