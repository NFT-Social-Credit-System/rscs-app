const axios = require('axios');
const cron = require('node-cron');

const BASE_URL = 'http://95.217.2.184:5000';

async function scrapeAll() {
  try {
    console.log('Starting scheduled scrape-all operation...');
    const response = await axios.post(`${BASE_URL}/scrape-all`, {
      timestamp: new Date().getTime()
    });
    console.log('Scrape-all operation initiated:', response.data.message);
  } catch (error) {
    console.error('Error starting scrape-all operation:', error.message);
  }
}

// Schedule scrape-all operation to run every 24 hours
cron.schedule('0 0 * * *', scrapeAll);

console.log('Scrape-all scheduler started');
