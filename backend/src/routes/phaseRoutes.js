const express = require('express');
const router = express.Router();
const phaseController = require('../controllers/phaseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const {
  updatePhaseValidation,
  commentValidation,
  objectIdValidation,
} = require('../utils/validators');

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/phases/{id}:
 *   get:
 *     summary: Get phase by ID
 *     tags: [Phases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phase details
 */
router.get('/:id', objectIdValidation('id'), phaseController.getPhase);

/**
 * @swagger
 * /api/phases/{id}:
 *   put:
 *     summary: Update phase (developers can update status, managers can update all)
 *     tags: [Phases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, delayed]
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Phase updated successfully
 */
router.put(
  '/:id',
  objectIdValidation('id'),
  updatePhaseValidation,
  phaseController.updatePhase
);

/**
 * @swagger
 * /api/phases/{id}:
 *   delete:
 *     summary: Delete phase (managers only)
 *     tags: [Phases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phase deleted successfully
 */
router.delete(
  '/:id',
  authorize('manager'),
  objectIdValidation('id'),
  phaseController.deletePhase
);

/**
 * @swagger
 * /api/phases/{id}/comments:
 *   get:
 *     summary: Get phase comments
 *     tags: [Phases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/:id/comments', objectIdValidation('id'), phaseController.getComments);

/**
 * @swagger
 * /api/phases/{id}/comments:
 *   post:
 *     summary: Add comment to phase
 *     tags: [Phases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post(
  '/:id/comments',
  objectIdValidation('id'),
  commentValidation,
  phaseController.addComment
);

module.exports = router;
