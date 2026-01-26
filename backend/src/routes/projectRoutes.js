const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const {
  createProjectValidation,
  createPhaseValidation,
  assignDevelopersValidation,
  objectIdValidation,
} = require('../utils/validators');

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         manager:
 *           $ref: '#/components/schemas/User'
 *         developers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         phases:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Phase'
 *         status:
 *           type: string
 *           enum: [active, completed, on_hold, cancelled]
 *         progress:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Phase:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, delayed]
 *         deadline:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         assignedDeveloper:
 *           $ref: '#/components/schemas/User'
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         text:
 *           type: string
 *         author:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for current user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/', projectController.getProjects);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project (managers only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post(
  '/',
  authorize('manager'),
  createProjectValidation,
  projectController.createProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
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
 *         description: Project details
 */
router.get('/:id', objectIdValidation('id'), projectController.getProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project (managers only)
 *     tags: [Projects]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put(
  '/:id',
  authorize('manager'),
  objectIdValidation('id'),
  projectController.updateProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project (managers only)
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 */
router.delete(
  '/:id',
  authorize('manager'),
  objectIdValidation('id'),
  projectController.deleteProject
);

/**
 * @swagger
 * /api/projects/{id}/assign:
 *   post:
 *     summary: Assign developers to project (managers only)
 *     tags: [Projects]
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
 *             properties:
 *               developers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Developers assigned successfully
 */
router.post(
  '/:id/assign',
  authorize('manager'),
  objectIdValidation('id'),
  assignDevelopersValidation,
  projectController.assignDevelopers
);

/**
 * @swagger
 * /api/projects/{id}/phases:
 *   post:
 *     summary: Add phase to project (managers only)
 *     tags: [Projects]
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
 *               - name
 *               - deadline
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               assignedDeveloper:
 *                 type: string
 *     responses:
 *       201:
 *         description: Phase added successfully
 */
router.post(
  '/:id/phases',
  authorize('manager'),
  objectIdValidation('id'),
  createPhaseValidation,
  projectController.addPhase
);

module.exports = router;
