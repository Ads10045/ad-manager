const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../utils/db');
const config = require('../../config/config.json');

/**
 * @desc Renders a dynamic banner by injecting a random product into a template
 */
const renderDynamicPreview = async (req, res) => {
  try {
    let identifier = req.query.path || 'achats/materiaux-pro-banner.html';
    let injectDataMap = {};

    // Simplified path-based template loading (Banner model removed)
    let relativePath = identifier;
    if (!relativePath.includes('.')) {
      relativePath += '.html';
    }

    // Existing logic: fetch a random product for injection
    const products = await db.execute(
      () => db.prisma.product.findMany({ where: { isActive: true } }),
      'SELECT * FROM "Product" WHERE "isActive" = true'
    );
    const rows = products.rows ? products.rows : products;
    if (!rows || rows.length === 0) {
      return res.status(404).send('No products found to render');
    }
    const randomProduct = rows[Math.floor(Math.random() * rows.length)];
    injectDataMap = { ...randomProduct };

    // Merge any query parameters (overrides) – ignore the original "path" key
    const queryOverrides = { ...req.query };
    delete queryOverrides.path;
    injectDataMap = { ...injectDataMap, ...queryOverrides };

    // 1. Load the HTML template (external GitHub or local fallback)
    let html = '';
    
    // Check if relativePath is actually a full URL
    const isFullUrl = relativePath.startsWith('http://') || relativePath.startsWith('https://');
    
    if (isFullUrl) {
        try {
            console.log(`Fetching banner directly from URL: ${relativePath}`);
            const response = await axios.get(relativePath);
            html = response.data;
        } catch (err) {
            console.warn(`Failed to fetch banner from full URL (${relativePath})`);
            return res.status(404).send(`Failed to fetch template from URL: ${relativePath}`);
        }
    } else {
        const baseDir = config.external?.template_base_url;
        if (baseDir) {
          try {
            const fullUrl = `${baseDir}${relativePath}`;
            console.log(`Fetching template from GitHub: ${fullUrl}`);
            const response = await axios.get(fullUrl);
            html = response.data;
          } catch (err) {
            console.warn(`Failed to fetch external template (${relativePath}), falling back to local file.`);
          }
        }
        if (!html) {
          const templatePath = path.join(__dirname, '../../../ad-manager-banner', relativePath);
          if (fs.existsSync(templatePath)) {
            html = fs.readFileSync(templatePath, 'utf8');
          } else {
            return res.status(404).send(`Template not found: ${relativePath}`);
          }
        }
    }

    // Aliases for backward compatibility
    if (injectDataMap.expiresAt && !injectDataMap.promoExpiry) {
      injectDataMap.promoExpiry = injectDataMap.expiresAt;
    }
    if (injectDataMap.sourceUrl && !injectDataMap.productLink) {
      injectDataMap.productLink = injectDataMap.sourceUrl;
    }

    // 2. Perform tag injection (case‑insensitive)
    Object.keys(injectDataMap).forEach(key => {
      const value = injectDataMap[key] !== null ? String(injectDataMap[key]) : '';
      const regex = new RegExp(`\\[${key}\\]`, 'gi');
      html = html.replace(regex, value);
    });
    // Backward‑compatible specific tags
    html = html.replace(/\[imageURL\]/gi, injectDataMap.imageUrl || '');
    html = html.replace(/\[productName\]/gi, injectDataMap.name || '');
    html = html.replace(/\[productPrice\]/gi, injectDataMap.price || '');
    html = html.replace(/\[productID\]/gi, injectDataMap.id || '');
    html = html.replace(/\[productLink\]/gi, injectDataMap.sourceUrl || '#');

    // Inject global script for jQuery templates
    const injectData = `
    <script>
      window.ADS_AI_PRODUCT = ${JSON.stringify(injectDataMap)};
      $(document).ready(function() {
        if (window.ADS_AI_PRODUCT) {
          const p = window.ADS_AI_PRODUCT;
          $('#product-name').text(p.name);
          $('#product-imageUrl').attr('src', p.imageUrl).css('opacity', '1');
          $('#product-price').text(p.price);
          $('#product-description').text(p.description);
        }
      });
    </script>
    `;
    html = html.replace('</body>', injectData + '</body>');

    // 3. Return rendered HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Render Error:', error);
    res.status(500).send('Error rendering banner: ' + error.message);
  }
};

const renderDynamicPreviewByPath = async (req, res) => {
  req.query.path = req.params.path;
  return renderDynamicPreview(req, res);
};

module.exports = { renderDynamicPreview, renderDynamicPreviewByPath };
