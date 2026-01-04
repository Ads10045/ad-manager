const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config/config.json');

dotenv.config();

const app = express();

// Determine Environment
const env = process.env.NODE_ENV || config.current_env || 'local';
const currentConfig = config.environments[env] || config.environments.local;
const PORT = currentConfig.port || process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: currentConfig.cors }));
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ads-AI Manager API',
      version: '1.0.0',
      description: 'Public Works Advertising and Banner Management System [Optimized]',
    },
    servers: [
      { 
        url: currentConfig.swagger_url || '/', 
        description: `${env.toUpperCase()} Server` 
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: env,
    message: 'Ad-Manager API is running stable' 
  });
});

// Routes Registration
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send(`Welcome to Ad-Manager API (${env}). Visit /api-docs for documentation.`);
});

// Launch Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Ad-Manager API [${env}] running on http://localhost:${PORT}`);
    console.log(`📖 Documentation available on http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
