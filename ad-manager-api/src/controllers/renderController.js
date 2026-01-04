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
    // 0. Get template path from query (default to specific one)
    const relativePath = req.query.path || 'achats/materiaux-pro-banner.html';

    // 1. Fetch a random product from the database
    const products = await db.execute(
      () => db.prisma.product.findMany({ where: { isActive: true } }),
      'SELECT * FROM "Product" WHERE "isActive" = true'
    );
    
    const rows = products.rows ? products.rows : products;
    if (!rows || rows.length === 0) {
      return res.status(404).send('No products found to render');
    }
    
    const randomProduct = rows[Math.floor(Math.random() * rows.length)];
    
    // 2. Load the HTML template (Generic GitHub Path or Local Fallback)
    let html = '';
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
    
    // 3. Perform tag injection (Supporting both [tag] and DOM mapping)
    html = html.replace(/\[imageURL\]/g, randomProduct.imageUrl || '');
    html = html.replace(/\[productName\]/g, randomProduct.name || 'Produit Sans Nom');
    html = html.replace(/\[productPrice\]/g, randomProduct.price || '0.00');
    html = html.replace(/\[productDescription\]/g, randomProduct.description || 'Description non disponible.');
    html = html.replace(/\[productID\]/g, randomProduct.id?.substring(0, 8) || 'N/A');
    html = html.replace(/\[productLink\]/g, randomProduct.sourceUrl || '#');
    
    // Injection spécifique pour JQuery (si le template utilise des IDs)
    // On ajoute un script de données globales pour le template
    const injectData = `
    <script>
      window.ADS_AI_PRODUCT = ${JSON.stringify(randomProduct)};
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
    
    // 4. Return the rendered HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Render Error:', error);
    res.status(500).send('Error rendering banner: ' + error.message);
  }
};

module.exports = { renderDynamicPreview };
