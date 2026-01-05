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

// Route universelle pour attraper n'importe quel chemin après /api/render-preview/
router.get('/*', (req, res) => {
    req.params.path = req.params[0];
    return renderController.renderDynamicPreviewByPath(req, res);
});

module.exports = router;
