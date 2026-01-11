const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../../config/config.json');

/**
 * @desc Get banner template HTML by ID or Path
 */
const getTemplate = async (req, res) => {
  let id = req.params.id || req.params[0];
  try {
    let relativePath = id;

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
 * @desc Create/Update a banner HTML template file
 */
const createTemplate = async (req, res) => {
  const { name, category, size, htmlContent } = req.body;
  try {
    const bannersDir = path.join(__dirname, '../../templates');
    const categoryDir = path.join(bannersDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${slug}-${size}.html`;
    const filePath = path.join(categoryDir, filename);
    const relativePath = `${category}/${filename}`;

    fs.writeFileSync(filePath, htmlContent, 'utf8');

    res.status(201).json({
      id: `${category}/${filename}`,
      name: name,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      file: relativePath,
      size: size,
      description: "Custom Template"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get local templates from ad-manager-banner folder
 */
const getLocalTemplates = async (req, res) => {
  try {
    const bannersDir = path.join(__dirname, '../../templates');
    const categories = fs.readdirSync(bannersDir).filter(f => {
        try {
            return fs.statSync(path.join(bannersDir, f)).isDirectory();
        } catch(e) { return false; }
    });
    
    let allTemplates = [];

    categories.forEach(cat => {
      const catPath = path.join(bannersDir, cat);
      try {
          const files = fs.readdirSync(catPath).filter(f => f.endsWith('.html'));
          files.forEach(file => {
            allTemplates.push({
              id: `${cat}/${file}`,
              name: file.replace('.html', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              category: cat.charAt(0).toUpperCase() + cat.slice(1),
              file: `${cat}/${file}`,
              size: file.includes('728x90') ? '728x90' : (file.includes('300x250') ? '300x250' : 'Banner')
            });
          });
      } catch(e) {}
    });

    res.json(allTemplates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Delete a banner template file
 */
const deleteTemplate = async (req, res) => {
    let id = req.params.id || req.params[0];

    try {
        const bannersDir = path.join(__dirname, '../../templates');
        const safeId = id.replace(/\.\./g, '');
        const filePath = path.join(bannersDir, safeId);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'Template deleted successfully', id });
        } else {
            res.status(404).json({ error: 'Template file not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc Update an existing banner template file
 */
const updateTemplate = async (req, res) => {
    let id = req.params.id || req.params[0];
    const { name, category, size, htmlContent } = req.body;

    try {
    const bannersDir = path.join(__dirname, '../../templates');
        const safeId = id.replace(/\.\./g, '');
        const filePath = path.join(bannersDir, safeId);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Template file not found' });
        }

        fs.writeFileSync(filePath, htmlContent, 'utf8');

        res.json({
            id: safeId,
            name: name || safeId.split('/').pop().replace('.html', ''),
            category: category || safeId.split('/')[0],
            file: safeId,
            size: size || '300x250',
            message: 'Template updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
  getTemplate,
  getLocalTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
