const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Advanced Banner Management
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Retrieve all active banners (filtered by category)
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [achats, promotions, travaux, evenements]
 *         description: Category filter
 *     responses:
 *       200:
 *         description: List of active banners.
 */
router.get('/local-templates', bannerController.getLocalTemplates);
router.get('/', bannerController.getBanners);

/**
 * @swagger
 * /api/banners/expired:
 *   get:
 *     summary: Retrieve list of expired banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of expired banners.
 */
router.get('/expired', bannerController.getExpiredBanners);

/**
 * @swagger
 * /api/banners/by-date:
 *   get:
 *     summary: Retrieve banners created within a date range
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of banners in range.
 */
router.get('/by-date', bannerController.getBannersByDate);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Get banner details by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner details.
 *       404:
 *         description: Banner not found.
 */
router.get('/:id', bannerController.getBannerById);
router.get('/:id/template', bannerController.getBannerTemplate);
router.get('/template/*', (req, res) => {
    req.params.id = req.params[0];
    return bannerController.getBannerTemplate(req, res);
});

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               position:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Banner created.
 */
router.post('/', bannerController.createBanner);

module.exports = router;
