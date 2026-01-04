const db = require('../utils/db');

/**
 * @desc Get all orders
 */
const getOrders = async (req, res) => {
  try {
    const orders = await db.execute(
      () => db.prisma.order.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      'SELECT o.*, u.name as "userName", u.email as "userEmail" FROM "Order" o JOIN "User" u ON o."userId" = u.id ORDER BY o."createdAt" DESC'
    );
    const result = orders.rows ? orders.rows : orders;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get order by ID
 */
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.execute(
      () => db.prisma.order.findUnique({
        where: { id },
        include: { user: { select: { name: true, email: true } } }
      }),
      `SELECT o.*, u.name as "userName", u.email as "userEmail" FROM "Order" o JOIN "User" u ON o."userId" = u.id WHERE o.id = '${id}' LIMIT 1`
    );
    const result = order.rows ? (order.rows[0] || null) : order;
    if (!result) return res.status(404).json({ error: 'Order not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Create order
 */
const createOrder = async (req, res) => {
  try {
    const order = await db.prisma.order.create({
      data: req.body
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getOrders, getOrderById, createOrder };
