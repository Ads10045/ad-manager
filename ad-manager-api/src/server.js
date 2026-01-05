const express = require('express');
const path = require('path');
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
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files (e.g. test pages)
// Routes Prioritaires
app.get('/catalog-test', (req, res) => {
  const filePath = path.join(__dirname, '../public/catalog-test/index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).send(`Error loading test page: ${err.message} (Path: ${filePath})`);
    }
  });
});
app.get('/ads-ai.js', (req, res) => {
  const script = `
(function($) {
    if (!$) return;
    const API_URL = "https://ad-manager-api.vercel.app/api/render-preview";
    function loadBanners() {
        $('.ads-ai-banner').each(function() {
            const $container = $(this);
            const data = $container.data();
            if ($container.hasClass('ads-ai-loaded') || !data.path) return;
            const queryParams = $.param(data);
            $.ajax({
                url: API_URL + "?" + queryParams,
                method: 'GET',
                success: function(html) {
                    $container.hide().html(html).addClass('ads-ai-loaded').fadeIn(500);
                }
            });
        });
    }
    $(document).ready(loadBanners);
    window.AdsAI = { refresh: loadBanners };
})(window.jQuery);`;
  res.set('Content-Type', 'application/javascript');
  res.send(script);
});
app.get('/api/banniere/*', (req, res) => {
  req.params.path = req.params[0];
  const renderController = require('./controllers/renderController');
  return renderController.renderDynamicPreviewByPath(req, res);
});


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
        url: env === 'prod' ? 'https://ad-manager-api.vercel.app' : (currentConfig.swagger_url || '/'), 
        description: `${env.toUpperCase()} Server` 
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI with fix for Vercel
app.get('/api-docs/swagger-ui-init.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.send(`
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  `);
});

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res) => {
  const html = swaggerUi.generateHTML(swaggerSpec, {
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
      "/api-docs/swagger-ui-init.js"
    ],
    customCss: '.swagger-ui .topbar { display: none }'
  });
  res.send(html);
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: env,
    message: 'Ad-Manager API is running stable' 
  });
});

// Routes Registration
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const locationRoutes = require('./routes/locationRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const renderRoutes = require('./routes/renderRoutes');
const settingRoutes = require('./routes/settingRoutes');


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/render-preview', renderRoutes);
app.use('/api/settings', settingRoutes);


// Root route
app.get('/', (req, res) => {
  res.send("DEPLOYED_STABLE_V5");
});

// Launch Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Ad-Manager API [${env}] running on http://localhost:${PORT}`);
    console.log(`📖 Documentation available on http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
