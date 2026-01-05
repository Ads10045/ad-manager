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
    let relativePath = req.query.path || 'achats/materiaux-pro-banner.html';
    
    // Auto-fix: Ajoute .html si l'extension est manquante
    if (!relativePath.includes('.')) {
      relativePath += '.html';
    }

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
    
    // 2. Load the HTML template
    let html = '';
    const baseDir = config.external?.template_base_url;

    // Fusionner les données : Priorité aux paramètres d'URL (overrides)
    // On ignore 'path' qui est réservé au template
    const injectDataMap = { ...randomProduct, ...req.query };
    delete injectDataMap.path;

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
    
    // Aliases pour les bannières
    if (injectDataMap.expiresAt && !injectDataMap.promoExpiry) {
        injectDataMap.promoExpiry = injectDataMap.expiresAt;
    }
    if (injectDataMap.sourceUrl && !injectDataMap.productLink) {
        injectDataMap.productLink = injectDataMap.sourceUrl;
    }
    
    // 3. Perform tag injection (Universal Case-Insensitive Mapping)
    Object.keys(injectDataMap).forEach(key => {
      const value = injectDataMap[key] !== null ? String(injectDataMap[key]) : '';
      
      // On remplace [key] de façon insensible à la casse ([id], [ID], [Id]...)
      const regex = new RegExp(`\\[${key}\\]`, 'gi');
      html = html.replace(regex, value);
    });

    // Compatibilité rétroactive pour certains tags spécifiques
    html = html.replace(/\[imageURL\]/gi, injectDataMap.imageUrl || '');
    html = html.replace(/\[productName\]/gi, injectDataMap.name || '');
    html = html.replace(/\[productPrice\]/gi, injectDataMap.price || '');
    html = html.replace(/\[productID\]/gi, injectDataMap.id || '');
    html = html.replace(/\[productLink\]/gi, injectDataMap.sourceUrl || '#');
    
    // Injection spécifique pour JQuery (si le template utilise des IDs)
    // On ajoute un script de données globales pour le template
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
    
    // 4. Return the rendered HTML
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
