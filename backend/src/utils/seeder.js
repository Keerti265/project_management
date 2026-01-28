require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project_management');

// Sample users data
const users = [
  {
    name: 'Project Manager',
    email: 'manager@example.com',
    password: 'Manager123!',
    role: 'manager',
  },
  {
    name: 'John Developer',
    email: 'dev1@example.com',
    password: 'Developer123!',
    role: 'developer',
  },
  {
    name: 'Jane Developer',
    email: 'dev2@example.com',
    password: 'Developer123!',
    role: 'developer',
  },
  {
    name: 'Mike Developer',
    email: 'dev3@example.com',
    password: 'Developer123!',
    role: 'developer',
  },
];

// Function to create sample projects
const createSampleProjects = (managerId, developerIds) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return [
    {
      title: 'E-Commerce Platform',
      description: 'Build a full-featured e-commerce platform with user authentication, product catalog, shopping cart, and payment integration.',
      manager: managerId,
      developers: [developerIds[0], developerIds[1]],
      status: 'active',
      phases: [
        {
          name: 'Database Design',
          description: 'Design and implement MongoDB schemas for users, products, orders, and payments.',
          status: 'completed',
          deadline: twoWeeksAgo,
          completedAt: new Date(twoWeeksAgo.getTime() - 2 * 24 * 60 * 60 * 1000), // Completed 2 days early
          assignedDeveloper: developerIds[0],
          comments: [
            { text: 'Schema design completed, ready for review.', author: developerIds[0] },
            { text: 'Approved! Moving to implementation.', author: managerId },
          ],
          statusHistory: [
            { status: 'pending', changedAt: new Date(twoWeeksAgo.getTime() - 10 * 24 * 60 * 60 * 1000), changedBy: managerId },
            { status: 'in_progress', changedAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000), changedBy: developerIds[0] },
            { status: 'completed', changedAt: new Date(twoWeeksAgo.getTime() - 2 * 24 * 60 * 60 * 1000), changedBy: developerIds[0] },
          ],
        },
        {
          name: 'User Authentication',
          description: 'Implement JWT-based authentication with registration, login, and password reset.',
          status: 'completed',
          deadline: oneWeekAgo,
          completedAt: new Date(oneWeekAgo.getTime() + 1 * 24 * 60 * 60 * 1000), // Completed 1 day late
          assignedDeveloper: developerIds[0],
          comments: [
            { text: 'Running into some issues with token refresh.', author: developerIds[0] },
            { text: 'Try implementing a sliding window approach.', author: managerId },
            { text: 'Fixed! Auth is working now.', author: developerIds[0] },
          ],
          statusHistory: [
            { status: 'pending', changedAt: twoWeeksAgo, changedBy: managerId },
            { status: 'in_progress', changedAt: new Date(oneWeekAgo.getTime() - 5 * 24 * 60 * 60 * 1000), changedBy: developerIds[0] },
            { status: 'delayed', changedAt: oneWeekAgo, changedBy: developerIds[0] },
            { status: 'completed', changedAt: new Date(oneWeekAgo.getTime() + 1 * 24 * 60 * 60 * 1000), changedBy: developerIds[0] },
          ],
        },
        {
          name: 'Product Catalog UI',
          description: 'Build React components for product listing, filtering, and search functionality.',
          status: 'in_progress',
          deadline: oneWeekLater,
          assignedDeveloper: developerIds[1],
          comments: [
            { text: 'Started working on the product grid component.', author: developerIds[1] },
          ],
          statusHistory: [
            { status: 'pending', changedAt: oneWeekAgo, changedBy: managerId },
            { status: 'in_progress', changedAt: now, changedBy: developerIds[1] },
          ],
        },
        {
          name: 'Shopping Cart',
          description: 'Implement shopping cart with add/remove items, quantity updates, and persistent storage.',
          status: 'pending',
          deadline: twoWeeksLater,
          assignedDeveloper: developerIds[1],
          comments: [],
          statusHistory: [
            { status: 'pending', changedAt: now, changedBy: managerId },
          ],
        },
        {
          name: 'Payment Integration',
          description: 'Integrate Stripe payment gateway for secure checkout.',
          status: 'pending',
          deadline: oneMonthLater,
          assignedDeveloper: developerIds[0],
          comments: [],
          statusHistory: [
            { status: 'pending', changedAt: now, changedBy: managerId },
          ],
        },
      ],
    },
    {
      title: 'Task Management App',
      description: 'Develop a Trello-like task management application with boards, lists, and cards.',
      manager: managerId,
      developers: [developerIds[1], developerIds[2]],
      status: 'active',
      phases: [
        {
          name: 'UI/UX Design',
          description: 'Create wireframes and mockups for the application.',
          status: 'completed',
          deadline: twoWeeksAgo,
          completedAt: new Date(twoWeeksAgo.getTime() - 1 * 24 * 60 * 60 * 1000), // Completed 1 day early
          assignedDeveloper: developerIds[1],
          comments: [
            { text: 'Mockups ready for review on Figma.', author: developerIds[1] },
            { text: 'Looks great! Approved.', author: managerId },
          ],
          statusHistory: [
            { status: 'pending', changedAt: new Date(twoWeeksAgo.getTime() - 7 * 24 * 60 * 60 * 1000), changedBy: managerId },
            { status: 'in_progress', changedAt: new Date(twoWeeksAgo.getTime() - 5 * 24 * 60 * 60 * 1000), changedBy: developerIds[1] },
            { status: 'completed', changedAt: new Date(twoWeeksAgo.getTime() - 1 * 24 * 60 * 60 * 1000), changedBy: developerIds[1] },
          ],
        },
        {
          name: 'Backend API',
          description: 'Build REST API for boards, lists, and cards with real-time updates.',
          status: 'in_progress',
          deadline: oneWeekLater,
          assignedDeveloper: developerIds[2],
          comments: [
            { text: 'API for boards and lists is ready. Working on cards now.', author: developerIds[2] },
          ],
          statusHistory: [
            { status: 'pending', changedAt: twoWeeksAgo, changedBy: managerId },
            { status: 'in_progress', changedAt: oneWeekAgo, changedBy: developerIds[2] },
          ],
        },
        {
          name: 'Drag & Drop',
          description: 'Implement drag and drop functionality for cards between lists.',
          status: 'pending',
          deadline: twoWeeksLater,
          assignedDeveloper: developerIds[1],
          comments: [],
          statusHistory: [
            { status: 'pending', changedAt: now, changedBy: managerId },
          ],
        },
      ],
    },
    {
      title: 'Analytics Dashboard',
      description: 'Create a data visualization dashboard with charts, graphs, and real-time metrics.',
      manager: managerId,
      developers: [developerIds[2]],
      status: 'active',
      phases: [
        {
          name: 'Data Pipeline Setup',
          description: 'Set up data ingestion pipeline and data warehouse.',
          status: 'completed',
          deadline: oneWeekAgo,
          completedAt: new Date(oneWeekAgo.getTime() + 3 * 24 * 60 * 60 * 1000), // Completed 3 days late
          assignedDeveloper: developerIds[2],
          comments: [
            { text: 'Encountered issues with data format. Need more time.', author: developerIds[2] },
            { text: 'Take the time you need. Quality over speed.', author: managerId },
            { text: 'Pipeline is up and running. Data flowing correctly now.', author: developerIds[2] },
          ],
          statusHistory: [
            { status: 'pending', changedAt: twoWeeksAgo, changedBy: managerId },
            { status: 'in_progress', changedAt: new Date(oneWeekAgo.getTime() - 5 * 24 * 60 * 60 * 1000), changedBy: developerIds[2] },
            { status: 'delayed', changedAt: oneWeekAgo, changedBy: developerIds[2] },
            { status: 'completed', changedAt: new Date(oneWeekAgo.getTime() + 3 * 24 * 60 * 60 * 1000), changedBy: developerIds[2] },
          ],
        },
        {
          name: 'Chart Components',
          description: 'Build reusable chart components using Chart.js or D3.',
          status: 'in_progress',
          deadline: oneWeekLater,
          assignedDeveloper: developerIds[2],
          comments: [
            { text: 'Starting with bar and line charts first.', author: developerIds[2] },
          ],
          statusHistory: [
            { status: 'pending', changedAt: oneWeekAgo, changedBy: managerId },
            { status: 'in_progress', changedAt: now, changedBy: developerIds[2] },
          ],
        },
        {
          name: 'Real-time Updates',
          description: 'Implement WebSocket connections for real-time data updates.',
          status: 'pending',
          deadline: oneMonthLater,
          assignedDeveloper: developerIds[2],
          comments: [],
          statusHistory: [
            { status: 'pending', changedAt: now, changedBy: managerId },
          ],
        },
      ],
    },
  ];
};

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    }

    const managerId = createdUsers[0]._id;
    const developerIds = createdUsers.slice(1).map((u) => u._id);

    console.log('\n');

    // Create projects
    const projectsData = createSampleProjects(managerId, developerIds);
    for (const projectData of projectsData) {
      const project = await Project.create(projectData);
      console.log(`✓ Created project: ${project.title} (${project.phases.length} phases)`);
    }

    console.log('\n========================================');
    console.log('✅ Database seeded successfully!\n');
    console.log('📝 Sample Credentials:');
    console.log('----------------------------------------');
    console.log('Manager Account:');
    console.log('  Email: manager@example.com');
    console.log('  Password: Manager123!\n');
    console.log('Developer Accounts:');
    console.log('  Email: dev1@example.com');
    console.log('  Password: Developer123!\n');
    console.log('  Email: dev2@example.com');
    console.log('  Password: Developer123!\n');
    console.log('  Email: dev3@example.com');
    console.log('  Password: Developer123!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
