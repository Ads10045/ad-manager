const db = require('../utils/db');

/**
 * @desc Get all settings
 */
const getSettings = async (req, res) => {
  try {
    const settings = await db.execute(
      () => db.prisma.setting.findMany(),
      'SELECT * FROM "Setting"'
    );
    const result = settings.rows ? settings.rows : settings;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get individual setting by key
 */
const getSettingByKey = async (req, res) => {
  const { key } = req.params;
  try {
    const setting = await db.execute(
      () => db.prisma.setting.findUnique({ where: { key } }),
      `SELECT * FROM "Setting" WHERE key = '${key}'`
    );
    const result = setting.rows ? (setting.rows[0] || null) : setting;
    if (!result) return res.status(404).json({ error: 'Setting not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Update or Create setting
 */
const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await db.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json(setting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getSettings, getSettingByKey, updateSetting };
