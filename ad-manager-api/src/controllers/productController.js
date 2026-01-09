const db = require('../utils/db');

/**
 * @desc Get all products (optionally filtered by category)
 */
const getProducts = async (req, res) => {
  const { category } = req.query;
  try {
    const products = await db.execute(
      () => db.prisma.product.findMany({
        where: { isActive: true, ...(category && { category }) },
        orderBy: { createdAt: 'desc' }
      }),
      category 
        ? `SELECT * FROM "Product" WHERE "isActive" = true AND category = '${category}' ORDER BY "createdAt" DESC`
        : 'SELECT * FROM "Product" WHERE "isActive" = true ORDER BY "createdAt" DESC'
    );
    const result = products.rows ? products.rows : products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get product by ID
 */
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.execute(
      () => db.prisma.product.findUnique({ where: { id } }),
      `SELECT * FROM "Product" WHERE id = '${id}' LIMIT 1`
    );
    const result = product.rows ? (product.rows[0] || null) : product;
    if (!result) return res.status(404).json({ error: 'Product not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get products by date range
 */
const getProductsByDate = async (req, res) => {
  const { start, end } = req.query;
  try {
    const products = await db.execute(
      () => db.prisma.product.findMany({
        where: {
          createdAt: { gte: new Date(start), lte: new Date(end) }
        }
      }),
      `SELECT * FROM "Product" WHERE "createdAt" BETWEEN '${start}' AND '${end}'`
    );
    const result = products.rows ? products.rows : products;
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Invalid date format' });
  }
};

/**
 * @desc Get expired products/promos
 */
const getExpiredProducts = async (req, res) => {
  try {
    const now = new Date().toISOString();
    const products = await db.execute(
      () => db.prisma.product.findMany({
        where: { expiresAt: { lt: new Date() } }
      }),
      `SELECT * FROM "Product" WHERE "expiresAt" < '${now}'`
    );
    const result = products.rows ? products.rows : products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Create product
 */
const createProduct = async (req, res) => {
  try {
    const product = await db.prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc Get random active promo product that is not expired
 */
const getRandomPromoProduct = async (req, res) => {
  try {
    const now = new Date().toISOString();
    
    // Get all candidate products first
    // Logic: isActive = true AND isPromo = true AND (expiresAt IS NULL OR expiresAt > now)
    const productsOrResult = await db.execute(
      () => db.prisma.product.findMany({
        where: {
          isActive: true,
          isPromo: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      }),
      `SELECT * FROM "Product" WHERE "isActive" = true AND "isPromo" = true AND ("expiresAt" IS NULL OR "expiresAt" > '${now}')`
    );

    const products = productsOrResult.rows ? productsOrResult.rows : productsOrResult;

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No active promo products found' });
    }

    // Select random product
    const randomIndex = Math.floor(Math.random() * products.length);
    const randomProduct = products[randomIndex];

    res.json(randomProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get multiple random active products
 */
const getRandomProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const { category } = req.query;
  
  try {
    const productsOrResult = await db.execute(
      () => db.prisma.product.findMany({
        where: { 
          isActive: true,
          ...(category && { category })
        },
      }),
      category 
        ? `SELECT * FROM "Product" WHERE "isActive" = true AND category = '${category}'`
        : 'SELECT * FROM "Product" WHERE "isActive" = true'
    );

    let products = productsOrResult.rows ? productsOrResult.rows : productsOrResult;

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No active products found' });
    }

    // Shuffle and limit
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, limit);

    res.json(selected);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  getProductsByDate, 
  getExpiredProducts, 
  getRandomPromoProduct,
  getRandomProducts,
  createProduct 
};
