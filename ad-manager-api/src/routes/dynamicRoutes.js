const express = require('express');
const router = express.Router();
const dynamicController = require('../controllers/dynamicController');

/**
 * @swagger
 * tags:
 *   name: Dynamic
 *   description: Dynamic Database Introspection & Generic Data Access
 */

/**
 * @swagger
 * /api/dynamic/tables:
 *   get:
 *     summary: List all user tables in the database
 *     tags: [Dynamic]
 */
router.get('/tables', dynamicController.getTables);

/**
 * @swagger
 * /api/dynamic/columns/{tableName}:
 *   get:
 *     summary: List columns for a specific table
 *     tags: [Dynamic]
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 */
router.get('/columns/:tableName', dynamicController.getColumns);

/**
 * @swagger
 * /api/dynamic/data/{tableName}:
 *   get:
 *     summary: Get sample data from a specific table
 *     tags: [Dynamic]
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
/**
 * @swagger
 * /api/dynamic/random/{tableName}:
 *   get:
 *     summary: Get random row(s) from a specific table (Generic Product logic)
 *     tags: [Dynamic]
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
/**
 * @swagger
 * /api/dynamic/row/{tableName}/{columnName}/{value}:
 *   get:
 *     summary: Get a single row from a specific table by a column value (e.g., ID)
 *     tags: [Dynamic]
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *       - in: path
 *         name: columnName
 *         required: true
 *       - in: path
 *         name: value
 *         required: true
 */
router.get('/row/:tableName/:columnName/:value', dynamicController.getRowByColumn);

module.exports = router;
