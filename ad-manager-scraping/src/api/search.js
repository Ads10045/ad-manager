const scraper = require('../services/ScraperService');

module.exports = async (req, res) => {
  const query = req.query.q || 'watch';
  const limit = parseInt(req.query.limit) || 5;
  try {
    const results = await scraper.searchAll(query, limit);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error('Scraper endpoint error:', e);
    res.status(500).send({error: e.message});
  }
};
