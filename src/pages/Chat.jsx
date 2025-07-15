import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ConnectionIndicator from '../components/common/ConnectionIndicator';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import useSupabase from '../hooks/useSupabase';

const {
  FiMessageCircle,
  FiSend,
  FiPaperclip,
  FiImage,
  FiFile,
  FiUsers,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiServer,
  FiCloud,
  FiCloudLightning,
  FiZap,
  FiBolt,
  FiCpu,
  FiX,
  FiSettings,
  FiCheck,
  FiLightbulb,
  FiLoader,
  FiCode,
  FiAlertCircle
} = FiIcons;

// Service-specific API request functions
const aiServices = {
  openai: async (message, options = {}) => {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful AI programming assistant that specializes in coding advice and software development.' },
          { role: 'user', content: message }
        ],
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  anthropic: async (message, options = {}) => {
    const apiKey = localStorage.getItem('anthropic_api_key');
    if (!apiKey) {
      throw new Error('Anthropic API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model || 'claude-2',
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: options.maxTokens || 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from Anthropic');
    }

    const data = await response.json();
    return data.content[0].text;
  },

  google: async (message, options = {}) => {
    const apiKey = localStorage.getItem('google_api_key');
    if (!apiKey) {
      throw new Error('Google AI API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: message }
            ]
          }
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 500
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from Google AI');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  },

  huggingface: async (message, options = {}) => {
    const apiKey = localStorage.getItem('huggingface_api_key');
    if (!apiKey) {
      throw new Error('Hugging Face API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response from Hugging Face');
    }

    const data = await response.json();
    return data[0].generated_text;
  }
};

// Predefined AI providers
const aiProvidersList = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'FiCloud',
    models: ['gpt-3.5-turbo', 'gpt-4'],
    description: 'ChatGPT and GPT-4 models',
    color: 'bg-green-600'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: 'FiCloudLightning',
    models: ['claude-2', 'claude-instant-1'],
    description: 'Claude AI models',
    color: 'bg-purple-600'
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: 'FiGlobe',
    models: ['gemini-pro'],
    description: 'Gemini models',
    color: 'bg-blue-600'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: 'FiCpu',
    models: ['mistral-7b-instruct'],
    description: 'Open source models',
    color: 'bg-yellow-600'
  }
];

function Chat() {
  const { projects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || '');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Fetch LLM providers from localStorage (API keys)
  const [providers, setProviders] = useState([]);
  
  // Simulated messages for demo
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      message: 'Hey team, I just pushed the latest version with the payment integration. Can someone review it?',
      timestamp: new Date('2024-01-15T10:30:00'),
      type: 'text'
    },
    {
      id: '2',
      sender: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e1e3e3?w=40&h=40&fit=crop&crop=face',
      message: 'Great work! I\'ll review it this afternoon. Also, I\'ve attached the updated wireframes.',
      timestamp: new Date('2024-01-15T10:35:00'),
      type: 'text',
      attachment: {
        name: 'wireframes_v2.pdf',
        type: 'pdf',
        size: '2.3 MB'
      }
    }
  ]);

  const currentUser = {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Check which providers have API keys
    const availableProviders = aiProvidersList.map(provider => {
      const apiKey = localStorage.getItem(`${provider.id}_api_key`);
      return {
        ...provider,
        is_connected: !!apiKey
      };
    });
    
    setProviders(availableProviders);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: currentUser.name,
      avatar: currentUser.avatar,
      message: message,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const currentMessage = message;
    setMessage('');
    
    // If AI provider is selected, get a response
    if (selectedProvider) {
      setIsTyping(true);
      const provider = providers.find(p => p.id === selectedProvider);
      
      // Add a placeholder for the AI response
      const aiPlaceholderId = Date.now().toString() + '-ai';
      
      setMessages(prev => [
        ...prev, 
        {
          id: aiPlaceholderId,
          sender: provider.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=0ea5e9&color=fff`,
          message: '...',
          timestamp: new Date(),
          type: 'text',
          isAI: true,
          isLoading: true
        }
      ]);
      
      try {
        // Call the appropriate AI service
        const aiService = aiServices[provider.id];
        const response = await aiService(currentMessage, { 
          model: selectedModel || provider.models[0],
          maxTokens: 1000
        });
        
        // Replace the placeholder with the actual response
        setMessages(prev => prev.map(msg => 
          msg.id === aiPlaceholderId 
            ? {
                ...msg,
                message: response,
                timestamp: new Date(),
                isLoading: false
              }
            : msg
        ));
        
      } catch (error) {
        console.error('AI response error:', error);
        
        // Update placeholder with error message
        setMessages(prev => prev.map(msg => 
          msg.id === aiPlaceholderId 
            ? {
                ...msg,
                message: `Error: ${error.message}`,
                timestamp: new Date(),
                isLoading: false,
                isError: true
              }
            : msg
        ));
        
        toast.error(error.message);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getProviderIcon = (type) => {
    switch (type) {
      case 'FiServer': return FiServer;
      case 'FiCloud': return FiCloud;
      case 'FiCloudLightning': return FiCloudLightning;
      case 'FiZap': return FiZap;
      case 'FiBolt': return FiBolt;
      case 'FiCpu': return FiCpu;
      case 'FiGlobe': return FiGlobe;
      case 'FiX': return FiX;
      default: return FiCloud;
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  
  const handleSelectProvider = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    
    if (!provider.is_connected) {
      toast.error(`Please add your ${provider.name} API key in Settings > API Keys`);
      return;
    }
    
    if (selectedProvider === providerId) {
      setSelectedProvider(null);
      setSelectedModel('');
      setShowModelSelection(false);
    } else {
      setSelectedProvider(providerId);
      setSelectedModel(provider.models[0]);
      setShowModelSelection(true);
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-6rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <SafeIcon icon={FiMessageCircle} className="text-primary-600 text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-dark-800">AI Chat Assistant</h1>
                <p className="text-gray-600">Collaborate with your team and AI assistants</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="text-gray-400" />
                <span className="text-sm text-gray-600">{selectedProjectData?.team?.length || 0} members</span>
              </div>
            </div>
          </div>

          {/* AI Provider Selection */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">AI Assistants</h3>
              {selectedProvider && (
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    setSelectedModel('');
                    setShowModelSelection(false);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {providers.map(provider => (
                <div
                  key={provider.id}
                  onClick={() => handleSelectProvider(provider.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    provider.id === selectedProvider
                      ? 'bg-primary-100 text-primary-700'
                      : provider.is_connected
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <SafeIcon icon={getProviderIcon(provider.icon)} className="text-sm" />
                  <span className="text-sm whitespace-nowrap">{provider.name}</span>
                  <ConnectionIndicator isConnected={provider.is_connected} size="xs" />
                </div>
              ))}
              
              <button
                onClick={() => window.location.href = '#/settings'}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-primary-600 border border-primary-200 hover:bg-primary-50"
              >
                <SafeIcon icon={FiSettings} className="text-sm" />
                <span className="text-sm whitespace-nowrap">Manage API Keys</span>
              </button>
            </div>
            
            {/* Model Selection */}
            {showModelSelection && selectedProvider && (
              <div className="mt-3">
                <label className="text-xs text-gray-600 mb-1 block">Select Model:</label>
                <div className="flex flex-wrap gap-2">
                  {providers.find(p => p.id === selectedProvider)?.models.map(model => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedModel === model
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-3 ${msg.sender === currentUser.name ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className={`flex-1 max-w-xl ${msg.sender === currentUser.name ? 'text-right' : ''}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{msg.sender}</span>
                  <span className="text-xs text-gray-500">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                  {msg.isAI && <SafeIcon icon={FiLightbulb} className="text-xs text-green-500" />}
                </div>
                
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.sender === currentUser.name
                      ? 'bg-primary-600 text-white'
                      : msg.isAI
                        ? msg.isError
                          ? 'bg-red-50 border border-red-200 text-gray-800'
                          : 'bg-green-50 border border-green-200 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiLoader} className="animate-spin text-sm" />
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  )}
                  
                  {msg.attachment && (
                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded border border-white border-opacity-30">
                      {msg.attachment.type === 'image' ? (
                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          className="max-w-full h-auto rounded"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiFile} className="text-sm" />
                          <div>
                            <div className="text-xs font-medium">{msg.attachment.name}</div>
                            <div className="text-xs opacity-75">{msg.attachment.size}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {msg.isAI && msg.isError && (
                    <div className="mt-2 flex items-center text-xs text-red-600">
                      <SafeIcon icon={FiAlertCircle} className="mr-1" />
                      <span>Error retrieving AI response</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <SafeIcon icon={FiMessageCircle} className="text-5xl mb-4" />
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedProvider
                      ? `Ask ${providers.find(p => p.id === selectedProvider)?.name} something...`
                      : "Type your message..."
                  }
                  rows="2"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiPaperclip} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiImage} />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? <SafeIcon icon={FiLoader} className="animate-spin" /> : <SafeIcon icon={FiSend} />}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>
              {selectedProvider ? (
                <div className="flex items-center space-x-1">
                  <span>Using:</span>
                  <span className="font-medium text-primary-600">
                    {providers.find(p => p.id === selectedProvider)?.name} 
                    {selectedModel && ` (${selectedModel})`}
                  </span>
                  <ConnectionIndicator isConnected={true} size="xs" />
                </div>
              ) : (
                'Select an AI provider to enable AI assistance'
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Chat;