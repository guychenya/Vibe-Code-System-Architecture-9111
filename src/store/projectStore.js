import { create } from 'zustand';

export const useProjectStore = create((set, get) => ({
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Modern e-commerce solution with React and Node.js',
      status: 'active',
      progress: 75,
      team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      lastUpdated: new Date('2024-01-15'),
      versions: 12,
      requirements: 8,
      priority: 'high'
    },
    {
      id: '2',
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application',
      status: 'review',
      progress: 60,
      team: ['Alice Brown', 'Bob Wilson'],
      lastUpdated: new Date('2024-01-14'),
      versions: 8,
      requirements: 12,
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Analytics Dashboard',
      description: 'Real-time analytics and reporting dashboard',
      status: 'completed',
      progress: 100,
      team: ['Sarah Davis', 'Tom Anderson'],
      lastUpdated: new Date('2024-01-10'),
      versions: 15,
      requirements: 6,
      priority: 'low'
    }
  ],
  
  codeVersions: [
    {
      id: '1',
      projectId: '1',
      version: 'v2.1.0',
      description: 'Added payment gateway integration',
      author: 'John Doe',
      createdAt: new Date('2024-01-15'),
      status: 'active',
      changes: 23,
      files: ['payment.js', 'checkout.jsx', 'api.js']
    },
    {
      id: '2',
      projectId: '1',
      version: 'v2.0.5',
      description: 'Bug fixes and performance improvements',
      author: 'Jane Smith',
      createdAt: new Date('2024-01-12'),
      status: 'stable',
      changes: 8,
      files: ['utils.js', 'components.jsx']
    },
    {
      id: '3',
      projectId: '2',
      version: 'v1.3.0',
      description: 'Enhanced security features',
      author: 'Alice Brown',
      createdAt: new Date('2024-01-14'),
      status: 'active',
      changes: 15,
      files: ['auth.js', 'security.js', 'middleware.js']
    }
  ],

  requirements: [
    {
      id: '1',
      projectId: '1',
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe payment gateway with support for multiple currencies',
      priority: 'high',
      status: 'in-progress',
      assignee: 'John Doe',
      createdAt: new Date('2024-01-10'),
      dueDate: new Date('2024-01-20'),
      files: ['payment-spec.pdf', 'wireframes.png']
    },
    {
      id: '2',
      projectId: '1',
      title: 'User Authentication',
      description: 'Implement OAuth2 authentication with Google and Facebook',
      priority: 'medium',
      status: 'completed',
      assignee: 'Jane Smith',
      createdAt: new Date('2024-01-08'),
      dueDate: new Date('2024-01-15'),
      files: ['auth-flow.md']
    },
    {
      id: '3',
      projectId: '2',
      title: 'Biometric Authentication',
      description: 'Add fingerprint and face recognition for mobile app',
      priority: 'high',
      status: 'review',
      assignee: 'Alice Brown',
      createdAt: new Date('2024-01-12'),
      dueDate: new Date('2024-01-25'),
      files: ['biometric-spec.pdf', 'security-audit.pdf']
    }
  ],

  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: Date.now().toString() }]
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),

  addCodeVersion: (version) => set((state) => ({
    codeVersions: [...state.codeVersions, { ...version, id: Date.now().toString() }]
  })),

  addRequirement: (requirement) => set((state) => ({
    requirements: [...state.requirements, { ...requirement, id: Date.now().toString() }]
  })),

  updateRequirement: (id, updates) => set((state) => ({
    requirements: state.requirements.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
}));