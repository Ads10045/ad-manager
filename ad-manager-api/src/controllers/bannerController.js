const db = require('../utils/db');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../../config/config.json');

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
 * @desc Get banner template HTML by ID
 */
const getBannerTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    let relativePath = '';

    // Check if ID is a path (contains /) or a UUID
    if (id.includes('/')) {
      relativePath = id;
    } else {
      // 1. Fetch Banner Info from DB
      const banner = await db.execute(
        () => db.prisma.banner.findUnique({ where: { id } }),
        `SELECT * FROM "Banner" WHERE id = '${id}' LIMIT 1`
      );
      const result = banner.rows ? (banner.rows[0] || null) : banner;
      if (!result) return res.status(404).json({ error: 'Banner not found' });
      relativePath = result.path;
    }

    if (!relativePath.includes('.')) {
      relativePath += '.html';
    }

    // Load HTML
    let html = '';
    
    // Check if relativePath is actually a full URL
    const isFullUrl = relativePath.startsWith('http://') || relativePath.startsWith('https://');
    
    if (isFullUrl) {
        try {
            const response = await axios.get(relativePath);
            html = response.data;
        } catch (err) {
            return res.status(404).send(`Failed to fetch template from URL: ${relativePath}`);
        }
    } else {
        const baseDir = config.external?.template_base_url;
        if (baseDir) {
          try {
            const fullUrl = `${baseDir}${relativePath}`;
            const response = await axios.get(fullUrl);
            html = response.data;
          } catch (err) {
            console.warn(`Failed to fetch external template (${relativePath}), falling back to local file.`);
          }
        }
        if (!html) {
          // Adjust path resolution relative to this controller or project root
          // renderController used: path.join(__dirname, '../../../ad-manager-banner', relativePath)
          const templatePath = path.join(__dirname, '../../../ad-manager-banner', relativePath);
          if (fs.existsSync(templatePath)) {
            html = fs.readFileSync(templatePath, 'utf8');
          } else {
            return res.status(404).send(`Template not found: ${relativePath}`);
          }
        }
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(html);

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

/**
 * @desc Get local templates from ad-manager-banner folder
 */
const getLocalTemplates = async (req, res) => {
  try {
    const bannersDir = path.join(__dirname, '../../../ad-manager-banner');
    const categories = fs.readdirSync(bannersDir).filter(f => fs.statSync(path.join(bannersDir, f)).isDirectory());
    
    let allTemplates = [];

    categories.forEach(cat => {
      const catPath = path.join(bannersDir, cat);
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.html'));
      
      files.forEach(file => {
        allTemplates.push({
          id: `${cat}/${file}`, // Use relative path as ID for local templates
          name: file.replace('.html', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          category: cat.charAt(0).toUpperCase() + cat.slice(1),
          path: `${cat}/${file}`,
          format: file.includes('728x90') ? '728x90' : (file.includes('300x250') ? '300x250' : 'Banner')
        });
      });
    });

    res.json(allTemplates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getBanners, 
  getBannerById, 
  getBannerTemplate,
  getLocalTemplates,
  getBannersByDate, 
  getExpiredBanners, 
  createBanner 
};
