const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Load external config
const configPath = path.join(__dirname, '../../config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || config.rapidapi.key;

class ScraperService {
  
  constructor() {
    this.key = RAPIDAPI_KEY;
    this.hosts = config.rapidapi.hosts;
    this.margins = config.settings.margins;
  }

  // Search Amazon products
  async searchAmazon(query, limit = config.settings.default_limit) {
    if (!this.key) return [];
    
    console.log(`🔍 [Amazon] Searching: "${query}"`);
    
    try {
      const response = await axios.get(`https://${this.hosts.amazon}/search`, {
        params: { query, page: '1', category_id: 'aps', sort_by: 'RELEVANCE' },
        headers: { 'X-RapidAPI-Key': this.key, 'X-RapidAPI-Host': this.hosts.amazon },
        timeout: 15000
      });

      const products = response.data?.data?.products || [];
      return products.slice(0, limit).map((p, i) => {
        let supplierPrice = parseFloat(p.product_price?.replace(/[^0-9.,]/g, '').replace(',', '.') || 25);
        if (supplierPrice > 1000) supplierPrice /= 100;
        
        const price = parseFloat((supplierPrice * this.margins.amazon).toFixed(2));
        
        return {
          id: `AMZ-${p.asin || Date.now()}-${i}`,
          name: p.product_title || 'Amazon Product',
          description: p.product_title,
          price: price,
          supplierPrice: supplierPrice,
          imageUrl: p.product_photo || p.product_photos?.[0] || 'https://via.placeholder.com/400',
          images: p.product_photos || [],
          supplier: 'Amazon',
          link: p.product_url,
          rating: parseFloat(p.product_star_rating) || 4.0,
          reviews: p.product_num_ratings || 0,
          category: 'Sourcing'
        };
      });
    } catch (error) {
      console.error('❌ Amazon Error:', error.message);
      return [];
    }
  }

  // Search AliExpress products
  async searchAliExpress(query, limit = config.settings.default_limit) {
    if (!this.key) return [];

    console.log(`🔍 [AliExpress] Searching: "${query}"`);
    
    try {
      const response = await axios.get(`https://${this.hosts.aliexpress}/item_search`, {
        params: { q: query, page: '1' },
        headers: { 'X-RapidAPI-Key': this.key, 'X-RapidAPI-Host': this.hosts.aliexpress },
        timeout: 15000
      });

      const products = response.data?.result?.resultList || [];
      return products.slice(0, limit).map((p) => {
        const item = p.item || p;
        const itemId = item.itemId || item.item_id || p.productId || p.product_id;
        
        let imageUrl = item.image || item.product_main_image || 'https://via.placeholder.com/400';
        if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
        
        let supplierPrice = parseFloat(item.sku?.def?.promotionPrice || item.sku?.def?.price || item.app_sale_price || 15);
        if (isNaN(supplierPrice)) supplierPrice = 15.0;
        
        const price = parseFloat((supplierPrice * this.margins.aliexpress).toFixed(2));

        return {
          id: `AE-${itemId}`,
          name: item.title || item.product_title || 'AliExpress Product',
          description: item.title || item.product_title,
          price: price,
          supplierPrice: supplierPrice,
          imageUrl: imageUrl,
          images: (item.images || []).map(img => img.startsWith('//') ? 'https:' + img : img),
          supplier: 'AliExpress',
          link: item.itemUrl || `https://www.aliexpress.com/item/${itemId}.html`,
          rating: parseFloat(item.rating) || 4.5,
          category: 'Sourcing'
        };
      });
    } catch (error) {
      console.error('❌ AliExpress Error:', error.message);
      return [];
    }
  }

  // Search eBay products
  async searchEbay(query, limit = config.settings.default_limit) {
    if (!this.key) return [];

    console.log(`🔍 [eBay] Searching: "${query}"`);
    
    try {
      const response = await axios.get(`https://${this.hosts.ebay}/search`, {
        params: { query: query, page: '1', perPage: limit.toString() },
        headers: { 'X-RapidAPI-Key': this.key, 'X-RapidAPI-Host': this.hosts.ebay },
        timeout: 15000
      });

      const products = response.data?.items || response.data?.data?.items || [];
      return products.slice(0, limit).map((p, i) => {
        const supplierPrice = parseFloat(p.price?.value || p.price || 15);
        const price = parseFloat((supplierPrice * this.margins.ebay).toFixed(2));
        
        return {
          id: `EBAY-${p.id || p.itemId || Date.now()}-${i}`,
          name: p.title || 'eBay Product',
          description: p.title,
          price: price,
          supplierPrice: supplierPrice,
          imageUrl: p.image || p.imageUrl || 'https://via.placeholder.com/400',
          images: p.images || [],
          supplier: 'eBay',
          link: p.itemUrl || p.url,
          rating: 4.2,
          category: 'Sourcing'
        };
      });
    } catch (error) {
      console.error('❌ eBay Error:', error.message);
      return [];
    }
  }

  // Combined search
  async searchAll(query, limit = config.settings.default_limit) {
    const results = await Promise.all([
      this.searchAmazon(query, limit),
      this.searchAliExpress(query, limit),
      this.searchEbay(query, limit)
    ]);
    return results.flat().sort(() => Math.random() - 0.5);
  }
}

module.exports = new ScraperService();
