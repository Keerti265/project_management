const mockDb = require('../config/mockDb');

/**
 * Project Service
 * Uses in-memory mock database
 */
class ProjectService {
  /**
   * Create a new project
   */
  async createProject(projectData, managerId) {
    const project = mockDb.createProject({
      ...projectData,
      manager: managerId,
    });

    return mockDb.populateProject(project);
  }

  /**
   * Get all projects for a manager
   */
  async getManagerProjects(managerId) {
    const projects = mockDb.findProjectsByManager(managerId);
    return projects
      .map((p) => mockDb.populateProject(p))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get all projects for a developer
   */
  async getDeveloperProjects(developerId) {
    const projects = mockDb.findProjectsByDeveloper(developerId);
    return projects
      .map((p) => mockDb.populateProject(p))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId, userId, userRole) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Check access
    if (userRole === 'manager' && project.manager !== userId) {
      const error = new Error('Not authorized to access this project');
      error.statusCode = 403;
      throw error;
    }

    if (userRole === 'developer') {
      const hasAccess =
        project.developers.includes(userId) ||
        project.phases.some((ph) => ph.assignedDeveloper === userId);
      if (!hasAccess) {
        const error = new Error('Not authorized to access this project');
        error.statusCode = 403;
        throw error;
      }
    }

    return mockDb.populateProject(project);
  }

  /**
   * Update project
   */
  async updateProject(projectId, updateData, managerId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.manager !== managerId) {
      const error = new Error('Not authorized to update this project');
      error.statusCode = 403;
      throw error;
    }

    const allowedUpdates = ['title', 'description', 'status'];
    const filteredUpdate = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdate[key] = updateData[key];
      }
    });

    const updatedProject = mockDb.updateProject(projectId, filteredUpdate);
    return mockDb.populateProject(updatedProject);
  }

  /**
   * Delete project
   */
  async deleteProject(projectId, managerId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.manager !== managerId) {
      const error = new Error('Not authorized to delete this project');
      error.statusCode = 403;
      throw error;
    }

    mockDb.deleteProject(projectId);
  }

  /**
   * Assign developers to project
   */
  async assignDevelopers(projectId, developerIds, managerId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.manager !== managerId) {
      const error = new Error('Not authorized to modify this project');
      error.statusCode = 403;
      throw error;
    }

    // Validate all developer IDs
    const validDevs = developerIds.every((id) => {
      const user = mockDb.findUserById(id);
      return user && user.role === 'developer';
    });

    if (!validDevs) {
      const error = new Error('One or more invalid developer IDs');
      error.statusCode = 400;
      throw error;
    }

    const updatedProject = mockDb.updateProject(projectId, { developers: developerIds });
    return mockDb.populateProject(updatedProject);
  }

  /**
   * Add phase to project
   */
  async addPhase(projectId, phaseData, managerId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.manager !== managerId) {
      const error = new Error('Not authorized to modify this project');
      error.statusCode = 403;
      throw error;
    }

    // Validate assigned developer if provided
    if (phaseData.assignedDeveloper) {
      const developer = mockDb.findUserById(phaseData.assignedDeveloper);
      if (!developer || developer.role !== 'developer') {
        const error = new Error('Invalid developer ID');
        error.statusCode = 400;
        throw error;
      }

      // Add developer to project if not already assigned
      if (!project.developers.includes(phaseData.assignedDeveloper)) {
        project.developers.push(phaseData.assignedDeveloper);
      }
    }

    const updatedProject = mockDb.addPhaseToProject(projectId, {
      ...phaseData,
      createdBy: managerId,
    });

    return mockDb.populateProject(updatedProject);
  }

  /**
   * Update phase
   */
  async updatePhase(projectId, phaseId, updateData, userId, userRole) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const phase = project.phases.find((ph) => ph._id === phaseId);
    if (!phase) {
      const error = new Error('Phase not found');
      error.statusCode = 404;
      throw error;
    }

    // Check authorization
    if (userRole === 'manager') {
      if (project.manager !== userId) {
        const error = new Error('Not authorized to modify this phase');
        error.statusCode = 403;
        throw error;
      }
    } else if (userRole === 'developer') {
      if (phase.assignedDeveloper !== userId) {
        const error = new Error('Not authorized to modify this phase');
        error.statusCode = 403;
        throw error;
      }
      // Developers can only update status
      const allowedUpdates = ['status'];
      Object.keys(updateData).forEach((key) => {
        if (!allowedUpdates.includes(key)) {
          delete updateData[key];
        }
      });
    }

    const updatedProject = mockDb.updatePhase(projectId, phaseId, updateData, userId);
    return mockDb.populateProject(updatedProject);
  }

  /**
   * Add comment to phase
   */
  async addComment(projectId, phaseId, text, userId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const phase = project.phases.find((ph) => ph._id === phaseId);
    if (!phase) {
      const error = new Error('Phase not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedProject = mockDb.addCommentToPhase(projectId, phaseId, {
      text,
      author: userId,
    });

    return mockDb.populateProject(updatedProject);
  }

  /**
   * Get phase comments
   */
  async getPhaseComments(projectId, phaseId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const phase = project.phases.find((ph) => ph._id === phaseId);
    if (!phase) {
      const error = new Error('Phase not found');
      error.statusCode = 404;
      throw error;
    }

    return phase.comments.map((c) => ({
      ...c,
      author: mockDb.populateUser(c.author),
    }));
  }

  /**
   * Delete phase
   */
  async deletePhase(projectId, phaseId, managerId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.manager !== managerId) {
      const error = new Error('Not authorized to modify this project');
      error.statusCode = 403;
      throw error;
    }

    const updatedProject = mockDb.deletePhase(projectId, phaseId);
    if (!updatedProject) {
      const error = new Error('Phase not found');
      error.statusCode = 404;
      throw error;
    }

    return mockDb.populateProject(updatedProject);
  }
}

module.exports = new ProjectService();
