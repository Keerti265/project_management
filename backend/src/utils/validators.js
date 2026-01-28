const { body, param, validationResult } = require('express-validator');

/**
 * Validation rules for different endpoints
 * Follows Single Responsibility Principle (SOLID)
 */

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['manager', 'developer'])
    .withMessage('Role must be either manager or developer'),
  handleValidationErrors,
];

// User login validation
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Project creation validation
const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  handleValidationErrors,
];

// Phase creation validation
const createPhaseValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Phase name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('deadline')
    .notEmpty()
    .withMessage('Deadline is required')
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  body('assignedDeveloper')
    .optional()
    .notEmpty()
    .withMessage('Invalid developer ID'),
  handleValidationErrors,
];

// Phase update validation
const updatePhaseValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'delayed'])
    .withMessage('Invalid status value'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  handleValidationErrors,
];

// Comment validation
const commentValidation = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  handleValidationErrors,
];

// ID validation (supports both MongoDB ObjectId and mock IDs)
const objectIdValidation = (paramName) => [
  param(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`),
  handleValidationErrors,
];

// Assign developers validation
const assignDevelopersValidation = [
  body('developers')
    .isArray({ min: 1 })
    .withMessage('At least one developer must be provided'),
  body('developers.*')
    .notEmpty()
    .withMessage('Developer ID cannot be empty'),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  createProjectValidation,
  createPhaseValidation,
  updatePhaseValidation,
  commentValidation,
  objectIdValidation,
  assignDevelopersValidation,
  handleValidationErrors,
};
