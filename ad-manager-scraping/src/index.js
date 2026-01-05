require('dotenv').config();
const scraperService = require('./services/ScraperService');
const fs = require('fs');
const path = require('path');

async function main() {
    const query = process.argv[2] || 'smartwatch';
    console.log(`🚀 Starting Ads-AI Scraper for: "${query}"...`);
    
    try {
        const products = await scraperService.searchAll(query, 3);
        
        console.log(`\n✅ Found ${products.length} products!`);
        
        // Save to data folder for inspection
        const outputPath = path.join(__dirname, '../data/last_search.json');
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
        
        console.log(`📦 Results saved to: ad-manager-scraping/data/last_search.json`);
        
        products.slice(0, 5).forEach(p => {
            console.log(`- [${p.supplier}] ${p.name.substring(0, 50)}... (${p.price}€)`);
        });

    } catch (error) {
        console.error('💥 Fatal Scraper Error:', error.message);
    }
}

main();
