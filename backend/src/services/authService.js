const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mockDb = require('../config/mockDb');

/**
 * Authentication Service
 * Uses in-memory mock database
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = mockDb.findUserByEmail(email);
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    // Create user
    const user = mockDb.createUser({
      name,
      email,
      password,
      role: role || 'developer',
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.toPublicJSON(user),
      token,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    const user = mockDb.findUserByEmail(email);

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.toPublicJSON(user),
      token,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = mockDb.findUserById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return this.toPublicJSON(user);
  }

  /**
   * Get all developers
   */
  async getDevelopers() {
    const developers = mockDb.findUsersByRole('developer');
    return developers.map((u) => this.toPublicJSON(u));
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    const users = mockDb.getAllUsers();
    return users.map((u) => this.toPublicJSON(u));
  }

  /**
   * Generate JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
  }

  /**
   * Convert user to public JSON (without password)
   */
  toPublicJSON(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

module.exports = new AuthService();
