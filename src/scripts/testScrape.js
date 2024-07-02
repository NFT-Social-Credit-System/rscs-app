const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BASE_URL = 'PLACEHOLDER';

async function testScrape(username) {
  try {
    console.log(`Attempting to scrape data for ${username}...`);
    const response = await axios.post(`${BASE_URL}/scrape`, { 
      username,
      timestamp: new Date().getTime()
    });
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Scraped data:`, JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(`Error scraping data for ${username}:`, error.message);
  }
}

async function testScrapeAll() {
  try {
    console.log(`Attempting to start scrape-all operation...`);
    const response = await axios.post(`${BASE_URL}/scrape-all`, {
      timestamp: new Date().getTime()
    });
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(response.data.message);
    
    // Start polling for status
    pollScrapeAllStatus();
  } catch (error) {
    console.error(`Error starting scrape-all operation:`, error.message);
  }
}

async function pollScrapeAllStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/scrape-status`);
    if (response.data.is_scraping) {
      console.log(`Scrape-all operation is still in progress... Queue size: ${response.data.queue_size}`);
      setTimeout(pollScrapeAllStatus, 5000); // Poll again after 5 seconds
    } else {
      console.log('Scrape-all operation completed.');
    }
  } catch (error) {
    console.error(`Error checking scrape-all status:`, error.message);
  }
}

async function pingServer() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log('Server is reachable. Response:', response.data);
  } catch (error) {
    console.error('Error pinging server:', error.message);
  }
}

function promptForUsername() {
  rl.question('Enter a Twitter username to scrape (or type "scrape-all" to fetch all users, "ping" to check server, or "exit" to quit): ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    } else if (input.toLowerCase() === 'scrape-all') {
      await testScrapeAll();
    } else if (input.toLowerCase() === 'ping') {
      await pingServer();
    } else {
      await testScrape(input);
    }
    promptForUsername();
  });
}

// Start with the prompt immediately
console.log('Welcome to the Twitter scraper test tool.');
promptForUsername();
