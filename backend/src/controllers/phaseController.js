const projectService = require('../services/projectService');
const mockDb = require('../config/mockDb');

/**
 * Phase Controller
 * Handles HTTP requests for phase management
 */
class PhaseController {
  /**
   * Update phase
   * @route PUT /api/phases/:id
   */
  async updatePhase(req, res, next) {
    try {
      // Find project containing this phase
      const project = mockDb.findProjectByPhaseId(req.params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Phase not found',
        });
      }

      const updatedProject = await projectService.updatePhase(
        project._id,
        req.params.id,
        req.body,
        req.user._id,
        req.user.role
      );

      // Find the updated phase
      const updatedPhase = updatedProject.phases.find(p => p._id === req.params.id);

      res.status(200).json({
        success: true,
        message: 'Phase updated successfully',
        data: {
          phase: updatedPhase,
          project: updatedProject,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add comment to phase
   * @route POST /api/phases/:id/comments
   */
  async addComment(req, res, next) {
    try {
      // Find project containing this phase
      const project = mockDb.findProjectByPhaseId(req.params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Phase not found',
        });
      }

      const updatedProject = await projectService.addComment(
        project._id,
        req.params.id,
        req.body.text,
        req.user._id
      );

      // Find the updated phase
      const updatedPhase = updatedProject.phases.find(p => p._id === req.params.id);

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: {
          comments: updatedPhase.comments,
          phase: updatedPhase,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get phase comments
   * @route GET /api/phases/:id/comments
   */
  async getComments(req, res, next) {
    try {
      // Find project containing this phase
      const project = mockDb.findProjectByPhaseId(req.params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Phase not found',
        });
      }

      const comments = await projectService.getPhaseComments(
        project._id,
        req.params.id
      );

      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete phase
   * @route DELETE /api/phases/:id
   */
  async deletePhase(req, res, next) {
    try {
      // Find project containing this phase
      const project = mockDb.findProjectByPhaseId(req.params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Phase not found',
        });
      }

      const updatedProject = await projectService.deletePhase(
        project._id,
        req.params.id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Phase deleted successfully',
        data: updatedProject,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single phase by ID
   * @route GET /api/phases/:id
   */
  async getPhase(req, res, next) {
    try {
      // Find project containing this phase
      const project = mockDb.findProjectByPhaseId(req.params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Phase not found',
        });
      }

      const populatedProject = mockDb.populateProject(project);
      const phase = populatedProject.phases.find(p => p._id === req.params.id);

      res.status(200).json({
        success: true,
        data: {
          phase,
          projectId: project._id,
          projectTitle: project.title,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PhaseController();
