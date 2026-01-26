const bcrypt = require('bcryptjs');

/**
 * In-Memory Mock Database
 * Replaces MongoDB for demo/testing purposes
 */

// Generate ObjectId-like strings
const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Pre-hash passwords
const hashedManagerPassword = bcrypt.hashSync('Manager123!', 12);
const hashedDevPassword = bcrypt.hashSync('Developer123!', 12);

// Sample Users
const users = [
  {
    _id: 'user_manager_001',
    name: 'Project Manager',
    email: 'manager@example.com',
    password: hashedManagerPassword,
    role: 'manager',
    createdAt: new Date('2024-01-01'),
  },
  {
    _id: 'user_dev_001',
    name: 'John Developer',
    email: 'dev1@example.com',
    password: hashedDevPassword,
    role: 'developer',
    createdAt: new Date('2024-01-02'),
  },
  {
    _id: 'user_dev_002',
    name: 'Jane Developer',
    email: 'dev2@example.com',
    password: hashedDevPassword,
    role: 'developer',
    createdAt: new Date('2024-01-03'),
  },
  {
    _id: 'user_dev_003',
    name: 'Mike Developer',
    email: 'dev3@example.com',
    password: hashedDevPassword,
    role: 'developer',
    createdAt: new Date('2024-01-04'),
  },
];

// Sample Projects with Phases
const now = new Date();
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

const projects = [
  {
    _id: 'project_001',
    title: 'E-Commerce Platform',
    description: 'Build a full-featured e-commerce platform with user authentication, product catalog, shopping cart, and payment integration.',
    manager: 'user_manager_001',
    developers: ['user_dev_001', 'user_dev_002'],
    status: 'active',
    createdAt: new Date('2024-01-10'),
    phases: [
      {
        _id: 'phase_001',
        name: 'Database Design',
        description: 'Design and implement MongoDB schemas for users, products, orders, and payments.',
        status: 'completed',
        deadline: twoWeeksAgo,
        completedAt: new Date(twoWeeksAgo.getTime() - 2 * 24 * 60 * 60 * 1000),
        assignedDeveloper: 'user_dev_001',
        comments: [
          { _id: 'comment_001', text: 'Schema design completed, ready for review.', author: 'user_dev_001', createdAt: new Date(twoWeeksAgo.getTime() - 3 * 24 * 60 * 60 * 1000) },
          { _id: 'comment_002', text: 'Approved! Moving to implementation.', author: 'user_manager_001', createdAt: new Date(twoWeeksAgo.getTime() - 2 * 24 * 60 * 60 * 1000) },
        ],
        statusHistory: [
          { status: 'pending', changedAt: new Date(twoWeeksAgo.getTime() - 10 * 24 * 60 * 60 * 1000), changedBy: 'user_manager_001' },
          { status: 'in_progress', changedAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000), changedBy: 'user_dev_001' },
          { status: 'completed', changedAt: new Date(twoWeeksAgo.getTime() - 2 * 24 * 60 * 60 * 1000), changedBy: 'user_dev_001' },
        ],
      },
      {
        _id: 'phase_002',
        name: 'User Authentication',
        description: 'Implement JWT-based authentication with registration, login, and password reset.',
        status: 'completed',
        deadline: oneWeekAgo,
        completedAt: new Date(oneWeekAgo.getTime() + 1 * 24 * 60 * 60 * 1000),
        assignedDeveloper: 'user_dev_001',
        comments: [
          { _id: 'comment_003', text: 'Running into some issues with token refresh.', author: 'user_dev_001', createdAt: oneWeekAgo },
          { _id: 'comment_004', text: 'Fixed! Auth is working now.', author: 'user_dev_001', createdAt: new Date(oneWeekAgo.getTime() + 1 * 24 * 60 * 60 * 1000) },
        ],
        statusHistory: [
          { status: 'pending', changedAt: twoWeeksAgo, changedBy: 'user_manager_001' },
          { status: 'in_progress', changedAt: new Date(oneWeekAgo.getTime() - 5 * 24 * 60 * 60 * 1000), changedBy: 'user_dev_001' },
          { status: 'completed', changedAt: new Date(oneWeekAgo.getTime() + 1 * 24 * 60 * 60 * 1000), changedBy: 'user_dev_001' },
        ],
      },
      {
        _id: 'phase_003',
        name: 'Product Catalog UI',
        description: 'Build React components for product listing, filtering, and search functionality.',
        status: 'in_progress',
        deadline: oneWeekLater,
        completedAt: null,
        assignedDeveloper: 'user_dev_002',
        comments: [
          { _id: 'comment_005', text: 'Started working on the product grid component.', author: 'user_dev_002', createdAt: now },
        ],
        statusHistory: [
          { status: 'pending', changedAt: oneWeekAgo, changedBy: 'user_manager_001' },
          { status: 'in_progress', changedAt: now, changedBy: 'user_dev_002' },
        ],
      },
      {
        _id: 'phase_004',
        name: 'Shopping Cart',
        description: 'Implement shopping cart with add/remove items, quantity updates, and persistent storage.',
        status: 'pending',
        deadline: twoWeeksLater,
        completedAt: null,
        assignedDeveloper: 'user_dev_002',
        comments: [],
        statusHistory: [{ status: 'pending', changedAt: now, changedBy: 'user_manager_001' }],
      },
      {
        _id: 'phase_005',
        name: 'Payment Integration',
        description: 'Integrate Stripe payment gateway for secure checkout.',
        status: 'pending',
        deadline: oneMonthLater,
        completedAt: null,
        assignedDeveloper: 'user_dev_001',
        comments: [],
        statusHistory: [{ status: 'pending', changedAt: now, changedBy: 'user_manager_001' }],
      },
    ],
  },
  {
    _id: 'project_002',
    title: 'Task Management App',
    description: 'Develop a Trello-like task management application with boards, lists, and cards.',
    manager: 'user_manager_001',
    developers: ['user_dev_002', 'user_dev_003'],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    phases: [
      {
        _id: 'phase_006',
        name: 'UI/UX Design',
        description: 'Create wireframes and mockups for the application.',
        status: 'completed',
        deadline: twoWeeksAgo,
        completedAt: new Date(twoWeeksAgo.getTime() - 1 * 24 * 60 * 60 * 1000),
        assignedDeveloper: 'user_dev_002',
        comments: [
          { _id: 'comment_006', text: 'Mockups ready for review on Figma.', author: 'user_dev_002', createdAt: new Date(twoWeeksAgo.getTime() - 2 * 24 * 60 * 60 * 1000) },
          { _id: 'comment_007', text: 'Looks great! Approved.', author: 'user_manager_001', createdAt: new Date(twoWeeksAgo.getTime() - 1 * 24 * 60 * 60 * 1000) },
        ],
        statusHistory: [
          { status: 'pending', changedAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000), changedBy: 'user_manager_001' },
          { status: 'completed', changedAt: new Date(twoWeeksAgo.getTime() - 1 * 24 * 60 * 60 * 1000), changedBy: 'user_dev_002' },
        ],
      },
      {
        _id: 'phase_007',
        name: 'Backend API',
        description: 'Build REST API for boards, lists, and cards with real-time updates.',
        status: 'in_progress',
        deadline: oneWeekLater,
        completedAt: null,
        assignedDeveloper: 'user_dev_003',
        comments: [
          { _id: 'comment_008', text: 'API for boards and lists is ready. Working on cards now.', author: 'user_dev_003', createdAt: now },
        ],
        statusHistory: [
          { status: 'pending', changedAt: twoWeeksAgo, changedBy: 'user_manager_001' },
          { status: 'in_progress', changedAt: oneWeekAgo, changedBy: 'user_dev_003' },
        ],
      },
      {
        _id: 'phase_008',
        name: 'Drag & Drop',
        description: 'Implement drag and drop functionality for cards between lists.',
        status: 'pending',
        deadline: twoWeeksLater,
        completedAt: null,
        assignedDeveloper: 'user_dev_002',
        comments: [],
        statusHistory: [{ status: 'pending', changedAt: now, changedBy: 'user_manager_001' }],
      },
    ],
  },
  {
    _id: 'project_003',
    title: 'Analytics Dashboard',
    description: 'Create a data visualization dashboard with charts, graphs, and real-time metrics.',
    manager: 'user_manager_001',
    developers: ['user_dev_003'],
    status: 'active',
    createdAt: new Date('2024-01-20'),
    phases: [
      {
        _id: 'phase_009',
        name: 'Data Pipeline Setup',
        description: 'Set up data ingestion pipeline and data warehouse.',
        status: 'completed',
        deadline: oneWeekAgo,
        completedAt: new Date(oneWeekAgo.getTime() + 3 * 24 * 60 * 60 * 1000),
        assignedDeveloper: 'user_dev_003',
        comments: [
          { _id: 'comment_009', text: 'Encountered issues with data format. Need more time.', author: 'user_dev_003', createdAt: oneWeekAgo },
          { _id: 'comment_010', text: 'Pipeline is up and running now.', author: 'user_dev_003', createdAt: new Date(oneWeekAgo.getTime() + 3 * 24 * 60 * 60 * 1000) },
        ],
        statusHistory: [
          { status: 'pending', changedAt: twoWeeksAgo, changedBy: 'user_manager_001' },
          { status: 'in_progress', changedAt: new Date(oneWeekAgo.getTime() - 5 * 24 * 60 * 60 * 1000), changedBy: 'user_dev_003' },
          { status: 'delayed', changedAt: oneWeekAgo, changedBy: 'user_dev_003' },
          { status: 'completed', changedAt: new Date(oneWeekAgo.getTime() + 3 * 24 * 60 * 60 * 1000), changedBy: 'user_dev_003' },
        ],
      },
      {
        _id: 'phase_010',
        name: 'Chart Components',
        description: 'Build reusable chart components using Chart.js or D3.',
        status: 'in_progress',
        deadline: oneWeekLater,
        completedAt: null,
        assignedDeveloper: 'user_dev_003',
        comments: [
          { _id: 'comment_011', text: 'Starting with bar and line charts first.', author: 'user_dev_003', createdAt: now },
        ],
        statusHistory: [
          { status: 'pending', changedAt: oneWeekAgo, changedBy: 'user_manager_001' },
          { status: 'in_progress', changedAt: now, changedBy: 'user_dev_003' },
        ],
      },
      {
        _id: 'phase_011',
        name: 'Real-time Updates',
        description: 'Implement WebSocket connections for real-time data updates.',
        status: 'pending',
        deadline: oneMonthLater,
        completedAt: null,
        assignedDeveloper: 'user_dev_003',
        comments: [],
        statusHistory: [{ status: 'pending', changedAt: now, changedBy: 'user_manager_001' }],
      },
    ],
  },
];

// Mock Database Class
class MockDB {
  constructor() {
    this.users = [...users];
    this.projects = [...projects];
  }

  // User Methods
  findUserByEmail(email) {
    return this.users.find((u) => u.email === email.toLowerCase()) || null;
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id) || null;
  }

  findUsersByRole(role) {
    return this.users.filter((u) => u.role === role);
  }

  getAllUsers() {
    return this.users;
  }

  createUser(userData) {
    const newUser = {
      _id: generateId(),
      ...userData,
      email: userData.email.toLowerCase(),
      password: bcrypt.hashSync(userData.password, 12),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Project Methods
  findProjectsByManager(managerId) {
    return this.projects.filter((p) => p.manager === managerId);
  }

  findProjectsByDeveloper(developerId) {
    return this.projects.filter(
      (p) =>
        p.developers.includes(developerId) ||
        p.phases.some((ph) => ph.assignedDeveloper === developerId)
    );
  }

  findProjectById(id) {
    return this.projects.find((p) => p._id === id) || null;
  }

  createProject(projectData) {
    const newProject = {
      _id: generateId(),
      ...projectData,
      phases: [],
      developers: [],
      status: 'active',
      createdAt: new Date(),
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id, updateData) {
    const index = this.projects.findIndex((p) => p._id === id);
    if (index === -1) return null;
    this.projects[index] = { ...this.projects[index], ...updateData };
    return this.projects[index];
  }

  deleteProject(id) {
    const index = this.projects.findIndex((p) => p._id === id);
    if (index === -1) return false;
    this.projects.splice(index, 1);
    return true;
  }

  // Phase Methods
  findProjectByPhaseId(phaseId) {
    return this.projects.find((p) => p.phases.some((ph) => ph._id === phaseId)) || null;
  }

  addPhaseToProject(projectId, phaseData) {
    const project = this.findProjectById(projectId);
    if (!project) return null;

    const newPhase = {
      _id: generateId(),
      ...phaseData,
      comments: [],
      statusHistory: [{ status: 'pending', changedAt: new Date(), changedBy: phaseData.createdBy }],
      status: 'pending',
      completedAt: null,
    };
    project.phases.push(newPhase);
    return project;
  }

  updatePhase(projectId, phaseId, updateData, userId) {
    const project = this.findProjectById(projectId);
    if (!project) return null;

    const phase = project.phases.find((ph) => ph._id === phaseId);
    if (!phase) return null;

    // Track status change
    if (updateData.status && updateData.status !== phase.status) {
      phase.statusHistory.push({
        status: updateData.status,
        changedAt: new Date(),
        changedBy: userId,
      });
      if (updateData.status === 'completed') {
        phase.completedAt = new Date();
      }
    }

    Object.assign(phase, updateData);
    return project;
  }

  deletePhase(projectId, phaseId) {
    const project = this.findProjectById(projectId);
    if (!project) return null;

    const index = project.phases.findIndex((ph) => ph._id === phaseId);
    if (index === -1) return null;

    project.phases.splice(index, 1);
    return project;
  }

  addCommentToPhase(projectId, phaseId, commentData) {
    const project = this.findProjectById(projectId);
    if (!project) return null;

    const phase = project.phases.find((ph) => ph._id === phaseId);
    if (!phase) return null;

    const newComment = {
      _id: generateId(),
      ...commentData,
      createdAt: new Date(),
    };
    phase.comments.push(newComment);
    return project;
  }

  // Helper to populate user references
  populateUser(userId) {
    const user = this.findUserById(userId);
    if (!user) return null;
    return { _id: user._id, name: user.name, email: user.email };
  }

  populateProject(project) {
    if (!project) return null;
    return {
      ...project,
      manager: this.populateUser(project.manager),
      developers: project.developers.map((id) => this.populateUser(id)).filter(Boolean),
      phases: project.phases.map((phase) => ({
        ...phase,
        assignedDeveloper: phase.assignedDeveloper ? this.populateUser(phase.assignedDeveloper) : null,
        comments: phase.comments.map((c) => ({
          ...c,
          author: this.populateUser(c.author),
        })),
      })),
      progress: this.calculateProgress(project),
      phasesCount: this.getPhasesCount(project),
    };
  }

  calculateProgress(project) {
    if (!project.phases || project.phases.length === 0) return 0;
    const completed = project.phases.filter((p) => p.status === 'completed').length;
    return Math.round((completed / project.phases.length) * 100);
  }

  getPhasesCount(project) {
    if (!project.phases) return { total: 0, pending: 0, in_progress: 0, completed: 0, delayed: 0 };
    return {
      total: project.phases.length,
      pending: project.phases.filter((p) => p.status === 'pending').length,
      in_progress: project.phases.filter((p) => p.status === 'in_progress').length,
      completed: project.phases.filter((p) => p.status === 'completed').length,
      delayed: project.phases.filter((p) => p.status === 'delayed').length,
    };
  }
}

// Export singleton instance
module.exports = new MockDB();
