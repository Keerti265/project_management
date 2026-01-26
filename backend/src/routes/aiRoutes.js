const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const { objectIdValidation } = require('../utils/validators');

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/ai/summary/me:
 *   get:
 *     summary: Get current user's performance summary (developers only)
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Developer performance summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     developerId:
 *                       type: string
 *                     developerName:
 *                       type: string
 *                     summary:
 *                       type: string
 *                     metrics:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         completed:
 *                           type: number
 *                         onTime:
 *                           type: number
 *                         late:
 *                           type: number
 *                         completionRate:
 *                           type: number
 *                         onTimeRate:
 *                           type: number
 */
router.get('/summary/me', aiController.getMyPerformanceSummary);

/**
 * @swagger
 * /api/ai/summary/developer/{id}:
 *   get:
 *     summary: Get developer performance summary (managers only)
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Developer ID
 *     responses:
 *       200:
 *         description: Developer performance summary
 */
router.get(
  '/summary/developer/:id',
  authorize('manager'),
  objectIdValidation('id'),
  aiController.getDeveloperSummary
);

/**
 * @swagger
 * /api/ai/summary/project/{id}:
 *   get:
 *     summary: Get project performance summary
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project performance summary
 */
router.get(
  '/summary/project/:id',
  objectIdValidation('id'),
  aiController.getProjectSummary
);

module.exports = router;
