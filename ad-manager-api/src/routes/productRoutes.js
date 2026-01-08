const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Advanced Product Feed Management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all active products (filtered by category)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter
 *     responses:
 *       200:
 *         description: List of products.
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/expired:
 *   get:
 *     summary: Retrieve expired products or limited offers
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of expired products.
 */
router.get('/expired', productController.getExpiredProducts);

/**
 * @swagger
 * /api/products/random-promo:
 *   get:
 *     summary: Retrieve a random active promo product (not expired)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Random promo product details.
 *       404:
 *         description: No active promo products found.
 */
router.get('/random-promo', productController.getRandomPromoProduct);

/**
 * @swagger
 * /api/products/by-date:
 *   get:
 *     summary: Retrieve products added within a date range
 *     tags: [Products]
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
 *         description: List of products in range.
 */
router.get('/by-date', productController.getProductsByDate);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details.
 *       404:
 *         description: Product not found.
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Product created.
 */
router.post('/', productController.createProduct);

module.exports = router;
