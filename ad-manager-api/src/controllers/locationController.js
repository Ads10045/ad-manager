const db = require('../utils/db');

/**
 * @desc Get all locations
 */
const getLocations = async (req, res) => {
  try {
    const locations = await db.execute(
      () => db.prisma.location.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { timestamp: 'desc' }
      }),
      'SELECT l.*, u.name as "userName", u.email as "userEmail" FROM "Location" l JOIN "User" u ON l."userId" = u.id ORDER BY l.timestamp DESC'
    );
    const result = locations.rows ? locations.rows : locations;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Save location
 */
const saveLocation = async (req, res) => {
  try {
    const location = await prisma.location.create({
      data: req.body
    });
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getLocations, saveLocation };
