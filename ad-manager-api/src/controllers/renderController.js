const fs = require('fs');
const path = require('path');
const db = require('../utils/db');

/**
 * @desc Renders a dynamic banner by injecting a random product into a template
 */
const renderDynamicPreview = async (req, res) => {
  try {
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
    const templatePath = path.join(__dirname, '../../../ad-manager-banner/test-dynamic-banner.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // 3. Perform tag injection
    html = html.replace(/\[imageURL\]/g, randomProduct.imageUrl || '');
    html = html.replace(/\[productName\]/g, randomProduct.name || 'Produit Sans Nom');
    html = html.replace(/\[productPrice\]/g, randomProduct.price || '0.00');
    html = html.replace(/\[productDescription\]/g, randomProduct.description || 'Description non disponible.');
    html = html.replace(/\[productLink\]/g, randomProduct.sourceUrl || '#');
    
    // 4. Return the rendered HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Render Error:', error);
    res.status(500).send('Error rendering banner: ' + error.message);
  }
};

module.exports = { renderDynamicPreview };
