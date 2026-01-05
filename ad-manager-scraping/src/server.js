require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Load config (same as ScraperService)
const configPath = path.resolve(__dirname, '../../config/config.json');
let config = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.warn('⚠️ Could not load config.json, using defaults');
  config = { environments: { local: { port: 3000 } } };
}

const app = express();
app.use(cors());
app.use(express.json());

// Swagger definition (basic)
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ad‑Manager Scraping API',
      version: '1.0.0',
      description: 'Search products across Amazon, AliExpress and eBay',
    },
    servers: [{ url: `http://localhost:${config.environments?.local?.port || 3000}` }],
  },
  apis: ['./src/api/*.js'], // will be created below
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import scraper service
const scraperService = require('./services/ScraperService');

/**
 * @openapi
 * /api/search:
 *   get:
 *     summary: Search products across Amazon, AliExpress and eBay
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of results per provider
 *     responses:
 *       200:
 *         description: Array of product objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
app.get('/api/search', async (req, res) => {
  const query = req.query.q || 'watch';
  const limit = parseInt(req.query.limit, 10) || 5;
  try {
    const results = await scraperService.searchAll(query, limit);
    res.json(results);
  } catch (e) {
    console.error('Search error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Simple health check
app.get('/', (req, res) => res.send('Ad‑Manager Scraping API – Local dev')); 

const PORT = config.environments?.local?.port || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
