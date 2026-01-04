const db = require('../utils/db');

/**
 * @desc Get all users
 */
const getUsers = async (req, res) => {
  try {
    const users = await db.execute(
      () => db.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true }
      }),
      'SELECT id, name, email, role, avatar, "createdAt" FROM "User" ORDER BY "createdAt" DESC'
    );
    const result = users.rows ? users.rows : users;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get user by ID
 */
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.execute(
      () => db.prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true }
      }),
      `SELECT id, name, email, role, avatar, "createdAt" FROM "User" WHERE id = '${id}' LIMIT 1`
    );
    const result = user.rows ? (user.rows[0] || null) : user;
    if (!result) return res.status(404).json({ error: 'User not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Create user
 */
const createUser = async (req, res) => {
  try {
    const user = await db.prisma.user.create({
      data: req.body
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser };
