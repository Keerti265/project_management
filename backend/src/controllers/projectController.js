const projectService = require('../services/projectService');

/**
 * Project Controller
 * Handles HTTP requests for project management
 * Follows MVC pattern
 */
class ProjectController {
  /**
   * Create a new project
   * @route POST /api/projects
   */
  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all projects for current user
   * @route GET /api/projects
   */
  async getProjects(req, res, next) {
    try {
      let projects;

      if (req.user.role === 'manager') {
        projects = await projectService.getManagerProjects(req.user._id);
      } else {
        projects = await projectService.getDeveloperProjects(req.user._id);
      }

      res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single project by ID
   * @route GET /api/projects/:id
   */
  async getProject(req, res, next) {
    try {
      const project = await projectService.getProjectById(
        req.params.id,
        req.user._id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update project
   * @route PUT /api/projects/:id
   */
  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete project
   * @route DELETE /api/projects/:id
   */
  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign developers to project
   * @route POST /api/projects/:id/assign
   */
  async assignDevelopers(req, res, next) {
    try {
      const project = await projectService.assignDevelopers(
        req.params.id,
        req.body.developers,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Developers assigned successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add phase to project
   * @route POST /api/projects/:id/phases
   */
  async addPhase(req, res, next) {
    try {
      const project = await projectService.addPhase(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(201).json({
        success: true,
        message: 'Phase added successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
