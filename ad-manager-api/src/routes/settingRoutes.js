const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System settings management
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Retrieve all system settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: List of settings.
 */
router.get('/', settingController.getSettings);

/**
 * @swagger
 * /api/settings/{key}:
 *   get:
 *     summary: Retrieve an individual setting by key
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting value.
 *       404:
 *         description: Setting not found.
 */
router.get('/:key', settingController.getSettingByKey);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Update or create a system setting
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Setting updated.
 */
router.post('/', settingController.updateSetting);

module.exports = router;
