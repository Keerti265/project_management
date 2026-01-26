const aiService = require('../services/aiService');

/**
 * AI Controller
 * Handles HTTP requests for AI-generated performance summaries
 * Follows MVC pattern
 */
class AIController {
  /**
   * Get developer performance summary
   * @route GET /api/ai/summary/developer/:id
   */
  async getDeveloperSummary(req, res, next) {
    try {
      const summary = await aiService.getDeveloperSummary(req.params.id);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get project performance summary
   * @route GET /api/ai/summary/project/:id
   */
  async getProjectSummary(req, res, next) {
    try {
      const summary = await aiService.getProjectSummary(req.params.id);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's performance summary (for developers)
   * @route GET /api/ai/summary/me
   */
  async getMyPerformanceSummary(req, res, next) {
    try {
      if (req.user.role !== 'developer') {
        return res.status(400).json({
          success: false,
          message: 'Performance summary is only available for developers',
        });
      }

      const summary = await aiService.getDeveloperSummary(req.user._id);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
