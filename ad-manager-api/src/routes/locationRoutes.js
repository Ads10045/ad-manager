const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Geolocation tracking
 */

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Retrieve history of user locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations.
 */
router.get('/', locationController.getLocations);

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Track a new user location
 *     tags: [Locations]
 *     responses:
 *       201:
 *         description: Location saved.
 */
router.post('/', locationController.saveLocation);

module.exports = router;
