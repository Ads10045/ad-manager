const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: HTML Banner Templates Management
 */

router.get('/categories', templateController.getCategoriesWithTemplates);
router.get('/local', templateController.getLocalTemplates);

router.get('/*', (req, res, next) => {
    // If it's just /local, it already matched
    if (req.params[0] === 'local') return next();
    return templateController.getTemplate(req, res);
});

router.post('/', templateController.createTemplate);

router.put('/*', (req, res) => {
    return templateController.updateTemplate(req, res);
});

router.delete('/*', (req, res) => {
    return templateController.deleteTemplate(req, res);
});

module.exports = router;
