const express = require('express');
const router = express.Router();
const renderController = require('../controllers/renderController');

/**
 * @swagger
 * tags:
 *   name: Rendering
 *   description: Dynamic Banner Generation & Injection
 */

/**
 * @swagger
 * /api/render-preview:
 *   get:
 *     summary: Render a dynamic banner preview with a random product
 *     tags: [Rendering]
 *     responses:
 *       200:
 *         description: Rendered HTML banner.
 */
router.get('/', renderController.renderDynamicPreview);
router.get('/:category/:banner', (req, res) => {
    req.params.path = `${req.params.category}/${req.params.banner}`;
    return renderController.renderDynamicPreviewByPath(req, res);
});

module.exports = router;
