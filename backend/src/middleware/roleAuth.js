/**
 * Role-based authorization middleware
 * Restricts access based on user roles
 * Follows Open/Closed Principle (SOLID) - can extend roles without modifying
 */

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

/**
 * Check if user is a manager
 */
const isManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Manager role required.',
    });
  }
};

/**
 * Check if user is a developer
 */
const isDeveloper = (req, res, next) => {
  if (req.user && req.user.role === 'developer') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Developer role required.',
    });
  }
};

module.exports = { authorize, isManager, isDeveloper };
