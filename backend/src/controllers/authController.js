const authService = require('../services/authService');

/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 * Follows MVC pattern
 */
class AuthController {
  /**
   * Register a new user
   * @route POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * @route POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current logged in user
   * @route GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user._id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all developers
   * @route GET /api/auth/developers
   */
  async getDevelopers(req, res, next) {
    try {
      const developers = await authService.getDevelopers();
      res.status(200).json({
        success: true,
        count: developers.length,
        data: developers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users (managers only)
   * @route GET /api/auth/users
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
