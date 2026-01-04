const db = require('../utils/db');

/**
 * @desc Get all active banners (optionally filtered by category)
 */
const getBanners = async (req, res) => {
  const { category } = req.query;
  try {
    const banners = await db.execute(
      () => db.prisma.banner.findMany({
        where: { 
          active: true,
          ...(category && { category })
        },
        orderBy: { createdAt: 'desc' }
      }),
      category 
        ? `SELECT * FROM "Banner" WHERE active = true AND category = '${category}' ORDER BY "createdAt" DESC`
        : 'SELECT * FROM "Banner" WHERE active = true ORDER BY "createdAt" DESC'
    );
    const result = banners.rows ? banners.rows : banners;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get banner by ID
 */
const getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await db.execute(
      () => db.prisma.banner.findUnique({ where: { id } }),
      `SELECT * FROM "Banner" WHERE id = '${id}' LIMIT 1`
    );
    const result = banner.rows ? (banner.rows[0] || null) : banner;
    if (!result) return res.status(404).json({ error: 'Banner not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get banners by date range
 */
const getBannersByDate = async (req, res) => {
  const { start, end } = req.query;
  try {
    const banners = await db.execute(
      () => db.prisma.banner.findMany({
        where: {
          createdAt: {
            gte: new Date(start),
            lte: new Date(end)
          }
        }
      }),
      `SELECT * FROM "Banner" WHERE "createdAt" BETWEEN '${start}' AND '${end}'`
    );
    const result = banners.rows ? banners.rows : banners;
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Invalid date format' });
  }
};

/**
 * @desc Get expired banners
 */
const getExpiredBanners = async (req, res) => {
  try {
    const now = new Date().toISOString();
    const banners = await db.execute(
      () => db.prisma.banner.findMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      }),
      `SELECT * FROM "Banner" WHERE "expiresAt" < '${now}'`
    );
    const result = banners.rows ? banners.rows : banners;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Create banner
 */
const createBanner = async (req, res) => {
  try {
    const banner = await db.prisma.banner.create({
      data: req.body
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  getBanners, 
  getBannerById, 
  getBannersByDate, 
  getExpiredBanners, 
  createBanner 
};
