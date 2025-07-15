import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiMessageCircle, FiSend, FiPaperclip, FiImage, FiFile, FiUsers, FiSearch, FiPlus, FiMoreVertical } = FiIcons;

function Chat() {
  const { projects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || '');
  const [message, setMessage] = useState('');
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
    },
    {
      id: '3',
      sender: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      message: 'The payment flow looks good, but I noticed a small issue with the error handling. I\'ll create a ticket for it.',
      timestamp: new Date('2024-01-15T11:00:00'),
      type: 'text'
    },
    {
      id: '4',
      sender: 'Alice Brown',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      message: 'Here\'s the mockup for the new dashboard design',
      timestamp: new Date('2024-01-15T11:15:00'),
      type: 'image',
      attachment: {
        name: 'dashboard_mockup.png',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
      }
    }
  ]);

  const currentUser = {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: currentUser.name,
      avatar: currentUser.avatar,
      message: message,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    toast.success('Message sent!');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

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
                <h1 className="text-xl font-semibold text-dark-800">Project Chat</h1>
                <p className="text-gray-600">Collaborate with your team in real-time</p>
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
                <span className="text-sm text-gray-600">{selectedProjectData?.team.length || 0} members</span>
              </div>
            </div>
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
              className={`flex items-start space-x-3 ${
                msg.sender === currentUser.name ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
              
              <div className={`flex-1 max-w-md ${
                msg.sender === currentUser.name ? 'text-right' : ''
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{msg.sender}</span>
                  <span className="text-xs text-gray-500">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                </div>
                
                <div className={`inline-block p-3 rounded-lg ${
                  msg.sender === currentUser.name
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  
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
                </div>
              </div>
            </motion.div>
          ))}
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
                  placeholder="Type your message..."
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
              disabled={!message.trim()}
              className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiSend} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Supports files, images, and documents</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Chat;